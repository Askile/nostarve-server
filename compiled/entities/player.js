"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const entity_1 = require("./entity");
const default_values_1 = require("../default/default.values");
const entity_type_1 = require("../enums/types/entity.type");
const death_reason_1 = require("../enums/death.reason");
const permissions_1 = require("../enums/permissions");
const building_1 = __importDefault(require("../building/building"));
const item_type_1 = require("../enums/types/item.type");
const quest_type_1 = require("../enums/types/quest.type");
const state_type_1 = require("../enums/types/state.type");
const vector_1 = require("../modules/vector");
const packets_1 = require("../enums/packets");
const biome_type_1 = require("../enums/types/biome.type");
const binary_writer_1 = require("../modules/binary.writer");
const master_1 = __importDefault(require("../master/master"));
const physics_utils_1 = __importDefault(require("../physics/physics.utils"));
const inventory_1 = __importDefault(require("../items/inventory"));
const gauges_1 = __importDefault(require("../attributes/gauges"));
const health_system_1 = __importDefault(require("../attributes/health.system"));
class Player extends entity_1.Entity {
    client;
    account;
    alive;
    cosmetics;
    /* camera */
    camera;
    inCamera;
    /* camera */
    /* systems */
    gauges;
    inventory;
    /* systems */
    /* data */
    permission;
    nickname;
    token_id;
    token;
    /* data */
    /* stats */
    level;
    kills;
    time;
    score;
    /* stats */
    /* timestamps */
    timestamps = new Map();
    lastEvent;
    /* timestamps */
    /* buildings */
    totem = null;
    buildings = [];
    nearestBuildings = [];
    /* buildings */
    vehicleSpeed = 0;
    quests = new Array(13).fill(quest_type_1.QuestState.PROCCESS);
    reason = death_reason_1.DeathReason.UNKNOWN;
    helmet = this.server.interactionSystem.items[0];
    right = this.server.interactionSystem.items[0];
    vehicle = this.server.interactionSystem.items[0];
    constructor(server) {
        super(entity_type_1.EntityType.PLAYER, server);
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
        this.cosmetics = (0, default_values_1.getDefaultPlayerCosmetics)();
        this.camera = (0, default_values_1.getDefaultCamera)();
        this.inCamera = [];
        this.lastEvent = new Array(this.server.config.important.events.length).fill(Date.now());
        this.position.set(this.server.spawner.getSpawnPoint(biome_type_1.BiomeType.FOREST, 0));
        this.realPosition.set(this.position);
        this.permission = this.server.settings.production ? permissions_1.Permissions.PLAYER : permissions_1.Permissions.OWNER;
        this.gauges = new gauges_1.default(this);
        this.inventory = new inventory_1.default(this, 10);
    }
    get defense() {
        return (this.helmet.defense ? this.helmet.defense : 0) + (this.right.defense ? this.right.defense : 0);
    }
    get bulletDefense() {
        return (this.helmet.defense ? this.helmet.defense : 0) + (this.right.defense ? (this.right.defense * 4) : 0);
    }
    get mobDefense() {
        return (this.helmet.mob_defense ? this.helmet.mob_defense : 0) + (this.right.mob_defense ? this.right.mob_defense : 0);
    }
    addBuilding(building) {
        if (this.buildings[building.type] === undefined) {
            this.buildings[building.type] = [];
        }
        this.buildings[building.type].push(building);
    }
    reset() {
        this.client = undefined;
        this.account = undefined;
        this.totem = undefined;
        this.biomes = [];
        this.nickname = "";
        this.token = "";
        this.token_id = "";
        this.level = 0;
        this.position.set(this.server.spawner.getSpawnPoint(biome_type_1.BiomeType.FOREST, 0));
        this.realPosition.set(this.position);
        this.velocity = new vector_1.Vector(0, 0);
        this.gauges.reset();
        this.server.alivePlayers = this.server.alivePlayers.filter(player => player !== this);
        this.health = this.server.configSystem?.health[entity_type_1.EntityType.PLAYER];
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
        this.permission = this.server.settings.production ? permissions_1.Permissions.PLAYER : permissions_1.Permissions.OWNER;
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
        this.cosmetics = (0, default_values_1.getDefaultPlayerCosmetics)();
        this.camera = (0, default_values_1.getDefaultCamera)();
        this.oldPosition = vector_1.Vector.zero();
        this.oldAngle = 0;
        this.oldAction = 0;
        this.oldSpeed = 0;
        this.oldExtra = 0;
        this.oldInfo = 0;
        this.reason = death_reason_1.DeathReason.UNKNOWN;
        this.helmet = this.server.interactionSystem.items[0];
        this.right = this.server.interactionSystem.items[0];
        this.vehicle = this.server.interactionSystem.items[0];
    }
    get flight() {
        return this.vehicle?.isFlight() && this.speed > 0.18;
    }
    onTick() {
        const lifeTime = Date.now() - this.createdAt;
        this.gauges.tick();
        if (!this.vehicle.isFlight()) {
            if (this.hasState(state_type_1.StateType.IN_RIVER) && !this.hasState(state_type_1.StateType.IN_BRIDGE) && !this.direction)
                this.direction = 12;
            else if (this.direction === 12)
                this.direction = 0;
        }
        const time = Math.floor(lifeTime / 480e3);
        if (this.time !== time) {
            this.score += this.server.config.score_per_day;
            this.client.sendU8([packets_1.ClientPackets.SURVIVE]);
            this.time = time;
        }
        if (this.inventory.contains(item_type_1.ItemType.BREAD, 100)) {
            this.hasState(state_type_1.StateType.IN_WINTER) && this.successQuest(quest_type_1.QuestType.WINTER_PEASANT_FUR);
            this.hasState(state_type_1.StateType.IN_DESERT) && this.successQuest(quest_type_1.QuestType.GOLDEN_PITCHFORK);
        }
        if (lifeTime > 3 * 480e3) {
            this.failQuests(quest_type_1.QuestType.ORANGE_GEM, quest_type_1.QuestType.DRAGON_CUBE);
        }
        if (this.createdAt - Date.now() > 480e3 && !this.hasState(state_type_1.StateType.IN_WINTER)) {
            this.failQuests(quest_type_1.QuestType.WINTER_HOOD_FUR);
        }
        if (lifeTime > 4 * 480e3) {
            this.failQuests(quest_type_1.QuestType.WINTER_PEASANT_FUR);
        }
        if (lifeTime > 5 * 480e3) {
            this.failQuests(quest_type_1.QuestType.GREEN_GEM);
        }
        if (lifeTime > 6 * 480e3) {
            this.successQuest(quest_type_1.QuestType.BLUE_GEM);
            this.failQuests(quest_type_1.QuestType.DRAGON_ORB, quest_type_1.QuestType.LAVA_CUBE, quest_type_1.QuestType.PILOT_HAT);
        }
        if (lifeTime > 7 * 480e3) {
            this.failQuests(quest_type_1.QuestType.SLOT_2, quest_type_1.QuestType.GOLDEN_PITCHFORK);
        }
        if (lifeTime > 8 * 480e3) {
            this.failQuests(quest_type_1.QuestType.SLOT_1);
        }
    }
    failQuests(...types) {
        for (const type of types) {
            if (this.quests[type] !== quest_type_1.QuestState.PROCCESS)
                continue;
            this.quests[type] = quest_type_1.QuestState.FAILED;
            this.client.sendU8([packets_1.ClientPackets.FAIL_QUEST, type]);
        }
    }
    successQuest(...types) {
        for (const type of types) {
            if (this.quests[type] !== quest_type_1.QuestState.PROCCESS)
                continue;
            this.quests[type] = quest_type_1.QuestState.SUCCEED;
            this.client.sendU8([packets_1.ClientPackets.SUCCEED_QUEST, type]);
        }
    }
    ruinQuests() {
        for (let i = quest_type_1.QuestType.DRAGON_ORB; i < quest_type_1.QuestType.GREEN_GEM + 1; i++) {
            if (this.quests[i] !== quest_type_1.QuestState.PROCCESS)
                continue;
            this.failQuests(i);
        }
        for (let i = quest_type_1.QuestType.WINTER_PEASANT_FUR; i < quest_type_1.QuestType.SLOT_2 + 1; i++) {
            if (this.quests[i] !== quest_type_1.QuestState.PROCCESS)
                continue;
            this.failQuests(i);
        }
    }
    updateInfo() {
        this.info = this.right.id + this.helmet.id * 128 + (this.inventory.maxSize >= 16 ? 0x4000 : 0);
        this.extra = this.hasState(state_type_1.StateType.GHOST) ? 1000 : this.vehicle.id;
    }
    updateSpeed() {
        const isWeapon = this.right.isSlowDown();
        const diving_mask = this.helmet.id === item_type_1.ItemType.DIVING_MASK;
        const super_diving_suit = this.helmet.id === item_type_1.ItemType.SUPER_DIVING_SUIT;
        const config = this.server.config;
        if (this.vehicle?.id) {
            this.vehicleSpeed = (this.vehicle.id === item_type_1.ItemType.BABY_LAVA ? config.speed_mount_baby_lava :
                this.vehicle.id === item_type_1.ItemType.BABY_DRAGON ? config.speed_mount_baby_dragon :
                    this.vehicle.id === item_type_1.ItemType.BABY_MAMMOTH ? config.speed_mount_baby_mammoth :
                        this.vehicle.id === item_type_1.ItemType.PLANE ? config.speed_mount_plane : config.speed_mount_plane) / 1000;
            if (this.hasState(state_type_1.StateType.IN_DESERT)) {
                this.vehicleSpeed = (this.vehicle.id === item_type_1.ItemType.BABY_LAVA ? config.speed_mount_baby_lava_desert :
                    this.vehicle.id === item_type_1.ItemType.BABY_DRAGON ? config.speed_mount_baby_dragon_desert :
                        config.speed_mount_plane_desert) / 1000;
            }
            if (this.hasState(state_type_1.StateType.IN_WINTER)) {
                this.vehicleSpeed = (this.vehicle.id === item_type_1.ItemType.BABY_LAVA ? config.speed_mount_baby_lava_winter :
                    this.vehicle.id === item_type_1.ItemType.BABY_DRAGON ? config.speed_mount_baby_dragon_winter :
                        config.speed_mount_plane_winter) / 1000;
            }
            if (this.hasState(state_type_1.StateType.IN_WINTER)) {
                this.vehicleSpeed = (this.vehicle.id === item_type_1.ItemType.BABY_LAVA ? config.speed_mount_baby_lava_winter :
                    this.vehicle.id === item_type_1.ItemType.BABY_DRAGON ? config.speed_mount_baby_dragon_winter :
                        config.speed_mount_plane_winter) / 1000;
            }
            if (this.hasState(state_type_1.StateType.IN_WATER) && !this.hasState(state_type_1.StateType.IN_BRIDGE)) {
                this.vehicleSpeed = (this.vehicle.id === item_type_1.ItemType.BABY_LAVA ? config.speed_mount_baby_lava_water :
                    this.vehicle.id === item_type_1.ItemType.BABY_DRAGON ? config.speed_mount_baby_dragon_water :
                        config.speed_mount_plane_water) / 1000;
            }
            if (this.hasState(state_type_1.StateType.IN_LAVA_BIOME)) {
                this.vehicleSpeed = (this.vehicle.id === item_type_1.ItemType.BABY_LAVA ? config.speed_mount_baby_lava_lava :
                    this.vehicle.id === item_type_1.ItemType.BABY_DRAGON ? config.speed_mount_baby_dragon_lava :
                        config.speed_mount_plane_lava) / 1000;
            }
        }
        else {
            this.speed = this.getComponent("SPEED" /* ComponentType.SPEED */);
            if (isWeapon) {
                this.speed = config.speed_weapon;
            }
            if (this.hasState(state_type_1.StateType.IN_DESERT)) {
                this.speed = config.speed_desert;
                if (isWeapon)
                    this.speed = config.speed_desert_weapon;
            }
            if (this.hasState(state_type_1.StateType.IN_WINTER)) {
                this.speed = config.speed_winter;
                if (isWeapon)
                    this.speed = config.speed_winter_weapon;
            }
            if (this.hasState(state_type_1.StateType.IN_WINTER)) {
                this.speed = config.speed_winter;
                if (isWeapon)
                    this.speed = config.speed_winter_weapon;
            }
            if (this.hasState(state_type_1.StateType.IN_WATER) && !this.hasState(state_type_1.StateType.IN_BRIDGE)) {
                this.speed = config.speed_water;
                if (diving_mask || super_diving_suit)
                    this.speed = 0.18;
                if (isWeapon)
                    this.speed = config.speed_water_weapon;
            }
            if (this.hasState(state_type_1.StateType.IN_LAVA_BIOME)) {
                this.speed = isWeapon ? config.speed_lava_weapon : config.speed_lava;
            }
        }
        if (this.hasState(state_type_1.StateType.ATTACK) && !this.flight) {
            this.speed -= config.speed_attacking;
        }
        const obstacles = physics_utils_1.default.getObstacles(this.server.world, this.realPosition, this.radius);
        const canSit = !this.hasState(state_type_1.StateType.IN_ROOF) && !obstacles.length;
        if (this.vehicle.id) {
            const flyTime = this.vehicle.id === item_type_1.ItemType.BABY_LAVA || this.vehicle.id === item_type_1.ItemType.NIMBUS ? 3 :
                this.vehicle.id === item_type_1.ItemType.BABY_DRAGON ? 5 :
                    this.vehicle.id === item_type_1.ItemType.PLANE ? 15 : 10;
            const coefficient = (this.vehicleSpeed / flyTime) * this.server.ticker.delta;
            if (this.direction === 0) {
                this.speed =
                    Math.clamp(this.speed - coefficient, !canSit && this.flight ? 0.19 : 0.03, this.vehicleSpeed);
            }
            else {
                this.speed = Math.clamp(this.speed + coefficient, !canSit && this.flight ? 0.19 : 0.03, this.vehicleSpeed);
            }
            if (this.vehicle.id === item_type_1.ItemType.NIMBUS && this.helmet.id !== item_type_1.ItemType.WITCH_HAT &&
                !((this.hasState(state_type_1.StateType.IN_ROOF) || obstacles.length) && this.flight))
                this.speed = 0.03;
        }
        if (obstacles.length) {
            if (!this.flight)
                this.speed = config.speed_collide;
        }
        this.removeState(state_type_1.StateType.IS_COLLIDE);
    }
    onDamage(damager) {
        this.timestamps.set("hood", Date.now());
        this.quests[quest_type_1.QuestType.GREEN_GEM] = quest_type_1.QuestState.FAILED;
        this.client.sendU8([packets_1.ClientPackets.FAIL_QUEST, quest_type_1.QuestType.GREEN_GEM]);
        if (damager instanceof Player) {
            if (damager.quests[quest_type_1.QuestType.BLUE_GEM] !== quest_type_1.QuestState.SUCCEED) {
                damager.quests[quest_type_1.QuestType.BLUE_GEM] = quest_type_1.QuestState.FAILED;
                damager.client.sendU8([packets_1.ClientPackets.FAIL_QUEST, quest_type_1.QuestType.BLUE_GEM]);
            }
        }
    }
    serialize() {
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
    delete() {
        super.delete();
        if (this.helmet.id === item_type_1.ItemType.CROWN_BLUE || this.inventory.contains(item_type_1.ItemType.DRAGON_HEART, 1)) {
            health_system_1.default.heal(this, 400);
            this.addState(state_type_1.StateType.GHOST);
            this.client.sendU8([packets_1.ClientPackets.GHOST, this.server.config.ghost_delay]);
            this.timestamps.set("ghost", Date.now());
            this.inventory.delete(item_type_1.ItemType.DRAGON_HEART);
            this.inventory.delete(item_type_1.ItemType.PITCHFORK);
            this.inventory.delete(item_type_1.ItemType.GOLD_PITCHFORK);
            this.inventory.delete(item_type_1.ItemType.WRENCH);
            this.inventory.delete(item_type_1.ItemType.SUPER_HAMMER);
            this.inventory.delete(item_type_1.ItemType.WAND1);
            this.inventory.delete(item_type_1.ItemType.WAND2);
            this.inventory.delete(item_type_1.ItemType.WOOD_PICK);
            this.inventory.delete(item_type_1.ItemType.STONE_PICK);
            this.inventory.delete(item_type_1.ItemType.GOLD_PICK);
            this.inventory.delete(item_type_1.ItemType.DIAMOND_PICK);
            this.inventory.delete(item_type_1.ItemType.AMETHYST_PICK);
            this.inventory.delete(item_type_1.ItemType.REIDITE_PICK);
            this.inventory.delete(item_type_1.ItemType.WOOD_SPEAR);
            this.inventory.delete(item_type_1.ItemType.STONE_SPEAR);
            this.inventory.delete(item_type_1.ItemType.GOLD_SPEAR);
            this.inventory.delete(item_type_1.ItemType.DIAMOND_SPEAR);
            this.inventory.delete(item_type_1.ItemType.AMETHYST_SPEAR);
            this.inventory.delete(item_type_1.ItemType.REIDITE_SPEAR);
            this.inventory.delete(item_type_1.ItemType.DRAGON_SPEAR);
            this.inventory.delete(item_type_1.ItemType.LAVA_SPEAR);
            this.inventory.delete(item_type_1.ItemType.CRAB_SPEAR);
            this.inventory.delete(item_type_1.ItemType.WOOD_SHIELD);
            this.inventory.delete(item_type_1.ItemType.STONE_SHIELD);
            this.inventory.delete(item_type_1.ItemType.GOLD_SHIELD);
            this.inventory.delete(item_type_1.ItemType.DIAMOND_SHIELD);
            this.inventory.delete(item_type_1.ItemType.AMETHYST_SHIELD);
            this.inventory.delete(item_type_1.ItemType.REIDITE_SHIELD);
            this.inventory.delete(item_type_1.ItemType.WOOD_BOW);
            this.inventory.delete(item_type_1.ItemType.STONE_BOW);
            this.inventory.delete(item_type_1.ItemType.GOLD_BOW);
            this.inventory.delete(item_type_1.ItemType.DIAMOND_BOW);
            this.inventory.delete(item_type_1.ItemType.AMETHYST_BOW);
            this.inventory.delete(item_type_1.ItemType.REIDITE_BOW);
            this.inventory.delete(item_type_1.ItemType.DRAGON_BOW);
            this.inventory.delete(item_type_1.ItemType.WOOD_SWORD);
            this.inventory.delete(item_type_1.ItemType.STONE_SWORD);
            this.inventory.delete(item_type_1.ItemType.GOLD_SWORD);
            this.inventory.delete(item_type_1.ItemType.DIAMOND_SWORD);
            this.inventory.delete(item_type_1.ItemType.AMETHYST_SWORD);
            this.inventory.delete(item_type_1.ItemType.REIDITE_SWORD);
            this.inventory.delete(item_type_1.ItemType.DRAGON_SWORD);
            this.inventory.delete(item_type_1.ItemType.LAVA_SWORD);
            this.inventory.delete(item_type_1.ItemType.PIRATE_SWORD);
            return;
        }
    }
    unEquipItem(id) {
        if (this.helmet.id === id) {
            this.helmet = this.server.interactionSystem.items[item_type_1.ItemType.HAND];
        }
        if (this.right.id === id) {
            this.right = this.server.interactionSystem.items[item_type_1.ItemType.HAND];
        }
        if (this.vehicle.id === id) {
            this.vehicle = this.server.interactionSystem.items[item_type_1.ItemType.HAND];
        }
        this.updateInfo();
    }
    unEquipInventory() {
        this.helmet = this.server.interactionSystem.items[item_type_1.ItemType.HAND];
        this.right = this.server.interactionSystem.items[item_type_1.ItemType.HAND];
        this.vehicle = this.server.interactionSystem.items[item_type_1.ItemType.HAND];
        this.updateInfo();
    }
    onDead(damager) {
        if (this.helmet.id === item_type_1.ItemType.CROWN_BLUE || this.inventory.contains(item_type_1.ItemType.DRAGON_HEART, 1)) {
            return;
        }
        if (this.account) {
            master_1.default.sendPlayingResult(this.server, this);
        }
        const writer = new binary_writer_1.BinaryWriter();
        writer.writeUInt8(packets_1.ClientPackets.KILLED);
        writer.writeUInt8(this.reason);
        writer.writeUInt16(this.kills);
        writer.writeUInt32(this.score);
        this.client?.sendBinary(writer.toBuffer());
        this.client.close();
        if (this.totem instanceof building_1.default && this.totem.owner !== this) {
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
exports.default = Player;
