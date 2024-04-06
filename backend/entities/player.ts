import {Entity} from "./entity";
import {Client} from "../network/client";
import {getDefaultCamera, getDefaultPlayerCosmetics} from "../default/default.values";
import {EntityType} from "../enums/types/entity.type";
import {DeathReason} from "../enums/death.reason";
import {Permissions} from "../enums/permissions";
import Building from "../building/building";
import {ItemType} from "../enums/types/item.type";
import {QuestState, QuestType} from "../enums/types/quest.type";
import {Account} from "../modules/account";
import {StateType} from "../enums/types/state.type";
import {Server} from "../server";
import {Vector} from "../modules/vector";
import {ClientPackets} from "../enums/packets";
import {BiomeType} from "../enums/types/biome.type";
import {BinaryWriter} from "../modules/binary.writer";
import Master from "../master/master";
import PhysicsUtils from "../physics/physics.utils";
import Inventory from "../items/inventory";
import Gauges from "../attributes/gauges";
import HealthSystem from "../attributes/health.system";
import {ComponentType} from "../enums/types/component.type";

export default class Player extends Entity {
    public client!: Client;
    public account!: Account;

    public alive: boolean;

    public cosmetics: PlayerCosmetics;
    /* camera */
    public camera: Camera;
    public inCamera: boolean[];
    /* camera */
    /* systems */
    public gauges: Gauges;
    public inventory: Inventory;
    /* systems */
    /* data */
    public permission: number;
    public nickname: string;
    public token_id: string;
    public token: string;
    /* data */
    /* stats */
    public level: number;
    public kills: number;
    public time: number;
    public score: number;
    /* stats */
    /* timestamps */
    public timestamps: Map<string, number> = new Map();
    public lastEvent: number[];
    /* timestamps */
    /* buildings */
    public totem: Building | null = null;
    public buildings: Building[][] = [];
    public nearestBuildings: Building[] = [];
    /* buildings */

    public vehicleSpeed: number = 0;

    public quests: number[] = new Array(13).fill(QuestState.PROCCESS);

    public reason: number = DeathReason.UNKNOWN;
    public helmet: any = this.server.interactionSystem.items[0];
    public right: any = this.server.interactionSystem.items[0];
    public vehicle: any = this.server.interactionSystem.items[0];
    constructor(server: Server) {
        super(EntityType.PLAYER, server);

        this.nickname = "";
        this.token = "";
        this.token_id = "";

        this.alive = false;

        this.level = 0;
        this.kills = 0;
        this.time = 0;
        this.score = this.server.config.default_score;

        for (const kit in server.kitSystem.kits) {
            this.timestamps.set("kit_" + kit, Date.now());
        }

        this.timestamps.set("drop", 0);
        this.timestamps.set("ghost", 0);
        this.timestamps.set("attack", 0);
        this.timestamps.set("build", 0);
        this.timestamps.set("weapon", 0);
        this.timestamps.set("helmet", 0);
        this.timestamps.set("join_totem", 0);
        this.timestamps.set("hood", 0);

        this.cosmetics = getDefaultPlayerCosmetics();
        this.camera = getDefaultCamera();

        this.inCamera = [];
        this.lastEvent = new Array(this.server.config.important.events.length).fill(Date.now());

        this.position.set(this.server.spawner.getSpawnPoint(BiomeType.FOREST, 0));
        this.realPosition.set(this.position);

        this.permission = this.server.settings.production ? Permissions.PLAYER : Permissions.OWNER;

        this.gauges = new Gauges(this);
        this.inventory = new Inventory(this, 10);
    }

    public get defense() {
        return (this.helmet.defense ? this.helmet.defense : 0) + (this.right.defense ? this.right.defense : 0);
    }

    public get bulletDefense() {
        return (this.helmet.defense ? this.helmet.defense : 0) + (this.right.defense ? (this.right.defense * 4) : 0);
    }

    public get mobDefense() {
        return (this.helmet.mob_defense ? this.helmet.mob_defense : 0) + (this.right.mob_defense ? this.right.mob_defense : 0);
    }

    public addBuilding(building: Building) {
        if(this.buildings[building.type] === undefined) {
            this.buildings[building.type] = [];
        }

        this.buildings[building.type].push(building);
    }

    public reset() {
        this.client = undefined;
        this.account = undefined;
        this.totem = undefined;
        this.biomes = [];

        this.nickname = "";
        this.token = "";
        this.token_id = "";
        this.level = 0;

        this.position.set(this.server.spawner.getSpawnPoint(BiomeType.FOREST, 0));
        this.realPosition.set(this.position);
        this.velocity = new Vector(0, 0);

        this.gauges.reset();

        this.server.alivePlayers = this.server.alivePlayers.filter(player => player !== this);
        this.health = this.server.configSystem?.health[EntityType.PLAYER];

        this.inventory.clear();
        this.inventory.maxSize = 10;

        this.score = this.server.config.default_score;
        this.kills = 0;
        this.time = 0;

        this.state = 0;
        this.action = 0;
        this.info = 0;
        this.angle = 0;
        this.extra = 0;
        this.direction = 0;

        this.alive = false;
        this.permission = this.server.settings.production ? Permissions.PLAYER : Permissions.OWNER;

        this.inCamera = [];

        for (const kit in this.server.kitSystem.kits) {
            this.timestamps.set("kit_" + kit, Date.now());
        }

        this.timestamps.set("ghost", 0);
        this.timestamps.set("drop", 0);
        this.timestamps.set("attack", 0);
        this.timestamps.set("build", 0);
        this.timestamps.set("weapon", 0);
        this.timestamps.set("helmet", 0);
        this.timestamps.set("join_totem", 0);
        this.timestamps.set("hood", 0);

        this.createdAt = Date.now();
        this.lastEvent = new Array(this.server.config.important.events.length).fill(Date.now());

        this.cosmetics = getDefaultPlayerCosmetics();
        this.camera = getDefaultCamera();

        this.oldPosition = Vector.zero();
        this.oldAngle = 0;
        this.oldAction = 0;
        this.oldSpeed = 0;
        this.oldExtra = 0;
        this.oldInfo = 0;

        this.reason = DeathReason.UNKNOWN;
        this.helmet = this.server.interactionSystem.items[0];
        this.right = this.server.interactionSystem.items[0];
        this.vehicle = this.server.interactionSystem.items[0];
    }
    public get flight() {
        return this.vehicle?.isFlight() && this.speed > 0.18;
    }

    public onTick() {
        const lifeTime = Date.now() - this.createdAt;

        this.gauges.tick();

        if(!this.vehicle.isFlight()) {
            if (this.hasState(StateType.IN_RIVER) && !this.hasState(StateType.IN_BRIDGE) && !this.direction)
                this.direction = 12;
            else if (this.direction === 12) this.direction = 0;
        }

        const time = Math.floor(lifeTime / 480e3);

        if(this.time !== time) {
            this.score += this.server.config.score_per_day;
            this.client.sendU8([ClientPackets.SURVIVE]);
            this.time = time;
        }

        if (this.inventory.contains(ItemType.BREAD, 100)) {
            this.hasState(StateType.IN_WINTER) && this.successQuest(QuestType.WINTER_PEASANT_FUR);
            this.hasState(StateType.IN_DESERT) && this.successQuest(QuestType.GOLDEN_PITCHFORK);
        }

        if (lifeTime > 3 * 480e3) {
            this.failQuests(QuestType.ORANGE_GEM, QuestType.DRAGON_CUBE);
        }

        if (this.createdAt - Date.now() > 480e3 && !this.hasState(StateType.IN_WINTER)) {
            this.failQuests(QuestType.WINTER_HOOD_FUR);
        }

        if (lifeTime > 4 * 480e3) {
            this.failQuests(QuestType.WINTER_PEASANT_FUR);
        }

        if (lifeTime > 5 * 480e3) {
            this.failQuests(QuestType.GREEN_GEM);
        }

        if (lifeTime > 6 * 480e3) {
            this.successQuest(QuestType.BLUE_GEM);
            this.failQuests(QuestType.DRAGON_ORB, QuestType.LAVA_CUBE, QuestType.PILOT_HAT);
        }

        if (lifeTime > 7 * 480e3) {
            this.failQuests(QuestType.SLOT_2, QuestType.GOLDEN_PITCHFORK);
        }

        if (lifeTime > 8 * 480e3) {
            this.failQuests(QuestType.SLOT_1);
        }
    }

    public failQuests(...types: QuestType[]) {
        for (const type of types) {
            if (this.quests[type] !== QuestState.PROCCESS) continue;

            this.quests[type] = QuestState.FAILED;
            this.client.sendU8([ClientPackets.FAIL_QUEST, type]);
        }
    }

    public successQuest(...types: QuestType[]) {
        for (const type of types) {
            if (this.quests[type] !== QuestState.PROCCESS) continue;

            this.quests[type] = QuestState.SUCCEED;
            this.client.sendU8([ClientPackets.SUCCEED_QUEST, type]);
        }
    }

    public ruinQuests() {
        for (let i = QuestType.DRAGON_ORB; i < QuestType.GREEN_GEM + 1; i++) {
            if (this.quests[i] !== QuestState.PROCCESS) continue;

            this.failQuests(i);
        }

        for (let i = QuestType.WINTER_PEASANT_FUR; i < QuestType.SLOT_2 + 1; i++) {
            if (this.quests[i] !== QuestState.PROCCESS) continue;

            this.failQuests(i);
        }
    }

    public updateInfo() {
        this.info = this.right.id + this.helmet.id * 128 + (this.inventory.maxSize >= 16 ? 0x4000 : 0);
        this.extra = this.hasState(StateType.GHOST) ? 1000 : this.vehicle.id;
    }

    public updateSpeed() {
        const isWeapon = this.right.isSlowDown();
        const diving_mask = this.helmet.id === ItemType.DIVING_MASK;
        const super_diving_suit = this.helmet.id === ItemType.SUPER_DIVING_SUIT;
        const config = this.server.config;

        if(this.vehicle?.id) {
            this.vehicleSpeed = (
                this.vehicle.id === ItemType.BABY_LAVA ? config.speed_mount_baby_lava :
                this.vehicle.id === ItemType.BABY_DRAGON ? config.speed_mount_baby_dragon :
                this.vehicle.id === ItemType.BABY_MAMMOTH ? config.speed_mount_baby_mammoth :
                this.vehicle.id === ItemType.PLANE ? config.speed_mount_plane : config.speed_mount_plane
            ) / 1000;

            if(this.hasState(StateType.IN_DESERT)) {
                this.vehicleSpeed = (
                    this.vehicle.id === ItemType.BABY_LAVA ? config.speed_mount_baby_lava_desert :
                        this.vehicle.id === ItemType.BABY_DRAGON ? config.speed_mount_baby_dragon_desert :
                            config.speed_mount_plane_desert
                ) / 1000;
            }

            if (this.hasState(StateType.IN_WINTER)) {
                this.vehicleSpeed = (
                    this.vehicle.id === ItemType.BABY_LAVA ? config.speed_mount_baby_lava_winter :
                        this.vehicle.id === ItemType.BABY_DRAGON ? config.speed_mount_baby_dragon_winter :
                            config.speed_mount_plane_winter
                ) / 1000;
            }

            if (this.hasState(StateType.IN_WINTER)) {
                this.vehicleSpeed = (
                    this.vehicle.id === ItemType.BABY_LAVA ? config.speed_mount_baby_lava_winter :
                        this.vehicle.id === ItemType.BABY_DRAGON ? config.speed_mount_baby_dragon_winter :
                            config.speed_mount_plane_winter
                ) / 1000;
            }

            if (this.hasState(StateType.IN_WATER) && !this.hasState(StateType.IN_BRIDGE)) {
                this.vehicleSpeed = (
                    this.vehicle.id === ItemType.BABY_LAVA ? config.speed_mount_baby_lava_water :
                        this.vehicle.id === ItemType.BABY_DRAGON ? config.speed_mount_baby_dragon_water :
                            config.speed_mount_plane_water
                ) / 1000;
            }

            if (this.hasState(StateType.IN_LAVA_BIOME)) {
                this.vehicleSpeed = (
                    this.vehicle.id === ItemType.BABY_LAVA ? config.speed_mount_baby_lava_lava :
                        this.vehicle.id === ItemType.BABY_DRAGON ? config.speed_mount_baby_dragon_lava :
                            config.speed_mount_plane_lava
                ) / 1000;
            }
        } else {
            this.speed = this.getComponent(ComponentType.SPEED);

            if (isWeapon) {
                this.speed = config.speed_weapon;
            }

            if (this.hasState(StateType.IN_DESERT)) {
                this.speed = config.speed_desert;
                if (isWeapon) this.speed = config.speed_desert_weapon;
            }

            if (this.hasState(StateType.IN_WINTER)) {
                this.speed = config.speed_winter;
                if (isWeapon) this.speed = config.speed_winter_weapon;
            }

            if (this.hasState(StateType.IN_WINTER)) {
                this.speed = config.speed_winter;
                if (isWeapon) this.speed = config.speed_winter_weapon;
            }

            if (this.hasState(StateType.IN_WATER) && !this.hasState(StateType.IN_BRIDGE)) {
                this.speed = config.speed_water;
                if (diving_mask || super_diving_suit) this.speed = 0.18;
                if (isWeapon) this.speed = config.speed_water_weapon;
            }

            if (this.hasState(StateType.IN_LAVA_BIOME)) {
                this.speed = isWeapon ? config.speed_lava_weapon : config.speed_lava;
            }
        }
        if (this.hasState(StateType.ATTACK) && !this.flight) {
            this.speed -= config.speed_attacking;
        }

        const obstacles = PhysicsUtils.getObstacles(this.server.world, this.realPosition, this.radius);

        const canSit = !this.hasState(StateType.IN_ROOF) && !obstacles.length;
        if(this.vehicle.id) {
            const flyTime =
                this.vehicle.id === ItemType.BABY_LAVA || this.vehicle.id === ItemType.NIMBUS ? 3 :
                this.vehicle.id === ItemType.BABY_DRAGON ? 5 :
                this.vehicle.id === ItemType.PLANE ? 15 : 10;
            const coefficient = (this.vehicleSpeed / flyTime) * this.server.ticker.delta;
            if(this.direction === 0) {
                this.speed =
                    Math.clamp(this.speed - coefficient, !canSit && this.flight ? 0.19 : 0.03, this.vehicleSpeed);
            } else {
                this.speed = Math.clamp(this.speed + coefficient, !canSit && this.flight ? 0.19 : 0.03, this.vehicleSpeed);
            }

            if(
                this.vehicle.id === ItemType.NIMBUS && this.helmet.id !== ItemType.WITCH_HAT &&
                !((this.hasState(StateType.IN_ROOF) || obstacles.length) && this.flight)
            ) this.speed = 0.03;
        }

        if (obstacles.length) {
            if(!this.flight) this.speed = config.speed_collide;
        }

        this.removeState(StateType.IS_COLLIDE);
    }

    public onDamage(damager?: Entity): void {
        this.timestamps.set("hood", Date.now());

        this.quests[QuestType.GREEN_GEM] = QuestState.FAILED;
        this.client.sendU8([ClientPackets.FAIL_QUEST, QuestType.GREEN_GEM]);

        if (damager instanceof Player) {
            if (damager.quests[QuestType.BLUE_GEM] !== QuestState.SUCCEED) {
                damager.quests[QuestType.BLUE_GEM] = QuestState.FAILED;
                damager.client.sendU8([ClientPackets.FAIL_QUEST, QuestType.BLUE_GEM]);
            }
        }
    }

    public serialize() {
        const now = Date.now();
        return [
            this.id, this.state, this.inventory.serialize(), this.inventory.maxSize, this.position.x, this.position.y,
            this.angle, this.info, this.action, this.speed, this.extra,
            this.health, this.gauges.bandage,
            this.reason, this.score, this.time, this.nickname, this.token, this.token_id, this.level,
            this.helmet.id, this.right.id, this.vehicle.id,
            this.createdAt - now, this.lastEvent.map(x => x === -1 ? -1 : x - now), this.account ? this.account.name : undefined, this.account ? this.account.password : undefined,
            this.cosmetics.skin, this.cosmetics.accessory, this.cosmetics.book, this.cosmetics.bag, this.cosmetics.crate, this.cosmetics.dead
        ];
    }

    public delete() {
        super.delete();
        if(this.helmet.id === ItemType.CROWN_BLUE || this.inventory.contains(ItemType.DRAGON_HEART, 1)) {
            HealthSystem.heal(this, 400);
            this.addState(StateType.GHOST);
            this.client.sendU8([ClientPackets.GHOST, this.server.config.ghost_delay]);

            this.timestamps.set("ghost", Date.now());

            this.inventory.delete(ItemType.DRAGON_HEART);
            this.inventory.delete(ItemType.PITCHFORK);
            this.inventory.delete(ItemType.GOLD_PITCHFORK);
            this.inventory.delete(ItemType.WRENCH);
            this.inventory.delete(ItemType.SUPER_HAMMER);
            this.inventory.delete(ItemType.WAND1);
            this.inventory.delete(ItemType.WAND2);

            this.inventory.delete(ItemType.WOOD_PICK);
            this.inventory.delete(ItemType.STONE_PICK);
            this.inventory.delete(ItemType.GOLD_PICK);
            this.inventory.delete(ItemType.DIAMOND_PICK);
            this.inventory.delete(ItemType.AMETHYST_PICK);
            this.inventory.delete(ItemType.REIDITE_PICK);

            this.inventory.delete(ItemType.WOOD_SPEAR);
            this.inventory.delete(ItemType.STONE_SPEAR);
            this.inventory.delete(ItemType.GOLD_SPEAR);
            this.inventory.delete(ItemType.DIAMOND_SPEAR);
            this.inventory.delete(ItemType.AMETHYST_SPEAR);
            this.inventory.delete(ItemType.REIDITE_SPEAR);
            this.inventory.delete(ItemType.DRAGON_SPEAR);
            this.inventory.delete(ItemType.LAVA_SPEAR);
            this.inventory.delete(ItemType.CRAB_SPEAR);

            this.inventory.delete(ItemType.WOOD_SHIELD);
            this.inventory.delete(ItemType.STONE_SHIELD);
            this.inventory.delete(ItemType.GOLD_SHIELD);
            this.inventory.delete(ItemType.DIAMOND_SHIELD);
            this.inventory.delete(ItemType.AMETHYST_SHIELD);
            this.inventory.delete(ItemType.REIDITE_SHIELD);

            this.inventory.delete(ItemType.WOOD_BOW);
            this.inventory.delete(ItemType.STONE_BOW);
            this.inventory.delete(ItemType.GOLD_BOW);
            this.inventory.delete(ItemType.DIAMOND_BOW);
            this.inventory.delete(ItemType.AMETHYST_BOW);
            this.inventory.delete(ItemType.REIDITE_BOW);
            this.inventory.delete(ItemType.DRAGON_BOW);

            this.inventory.delete(ItemType.WOOD_SWORD);
            this.inventory.delete(ItemType.STONE_SWORD);
            this.inventory.delete(ItemType.GOLD_SWORD);
            this.inventory.delete(ItemType.DIAMOND_SWORD);
            this.inventory.delete(ItemType.AMETHYST_SWORD);
            this.inventory.delete(ItemType.REIDITE_SWORD);
            this.inventory.delete(ItemType.DRAGON_SWORD);
            this.inventory.delete(ItemType.LAVA_SWORD);
            this.inventory.delete(ItemType.PIRATE_SWORD);
            return;
        }
    }

    public unEquipItem(id: number) {
        if (this.helmet.id === id) {
            this.helmet = this.server.interactionSystem.items[ItemType.HAND];
        }
        if (this.right.id === id) {
            this.right = this.server.interactionSystem.items[ItemType.HAND];
        }
        if (this.vehicle.id === id) {
            this.vehicle = this.server.interactionSystem.items[ItemType.HAND];
        }

        this.updateInfo();
    }

    public unEquipInventory() {
        this.helmet = this.server.interactionSystem.items[ItemType.HAND];
        this.right = this.server.interactionSystem.items[ItemType.HAND];
        this.vehicle = this.server.interactionSystem.items[ItemType.HAND];

        this.updateInfo();
    }

    public onDead(damager: Entity) {
        if(this.helmet.id === ItemType.CROWN_BLUE || this.inventory.contains(ItemType.DRAGON_HEART, 1)) {
            return;
        }

        if (this.account) {
            Master.sendPlayingResult(this.server, this);
        }

        const writer = new BinaryWriter();

        writer.writeUInt8(ClientPackets.KILLED);

        writer.writeUInt8(this.reason);
        writer.writeUInt16(this.kills);
        writer.writeUInt32(this.score);

        this.client?.sendBinary(writer.toBuffer());
        this.client.close();

        if(this.totem instanceof Building && this.totem.owner !== this) {
            this.server.teamSystem.excludeMemberId(this.totem, this.id);
        }

        for (const building of this.buildings.flat(1)) {
            building.delete();
            building.onDead();
        }

        if (damager instanceof Player) {
            this.server.logger.log(`Player ${this.nickname}|${this.id} died by ${damager.nickname}|${damager.id} with reason ${this.reason}`);
            damager.score += this.score * this.server.config.score_per_kill;
        }
    }
}