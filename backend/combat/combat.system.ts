import {Server} from "../server";
import Player from "../entities/player";
import {StateType} from "../enums/types/state.type";
import {ActionType} from "../enums/types/action.type";
import {Utils} from "../modules/utils";
import {Bullet} from "../entities/bullet";
import {ItemType} from "../enums/types/item.type";
import {WorldTime} from "../enums/world.time";
import {DeathReason} from "../enums/death.reason";
import HealthSystem from "../attributes/health.system";
import Building from "../building/building";
import {ComponentType} from "../enums/types/component.type";
import {Tile} from "../world/tile";
import {TileType} from "../enums/types/tile.type";
import {Crate} from "../entities/crate";
import {CachedPackets} from "../network/cached.packets";
import {ClientPackets} from "../enums/packets";
import TeamSystem from "../team/team.system";
import {BinaryWriter} from "../modules/binary.writer";
import {EntityType} from "../enums/types/entity.type";
import {Entity} from "../entities/entity";

export default class CombatSystem {
    private server: Server;
    constructor(server: Server) {
        this.server = server;
    }

    public tick(player: Player) {
        const now = Date.now();

        if (
            this.server.config.disable_attack === 1 ||
            !player.hasState(StateType.ATTACK) ||
            now - player.timestamps.get("attack") < 500
        ) return;

        player.addAction(ActionType.ATTACK);
        player.timestamps.set("attack", now);

        if (player.right.isBow()) {
            const type = Utils.getArrowType(player);
            if (type !== -1) {
                player.inventory.decrease(type[1], 1, true);
                new Bullet(this.server, player, type[0]);
            }
            return;
        }

        const hitPosition = Utils.getOffsetVector(player.realPosition, player.right.offset, player.angle);
        const damaged = this.server.world.queryCircle(hitPosition, player.right.radius);

        let empty = false;
        let dontHarvest = false;
        let damagedSpikes = [];

        const canDig = !player.hasState(StateType.IN_WATER) && player.right.dig && !player.flight;
        if(canDig) {
            const item = (
                // this.server.world.distanceFromSand(player.biomes[0], player.biomes[0].position.x, player.biomes[0].position.y) ||
                player.hasState(StateType.IN_ISLAND) ||
                player.hasState(StateType.IN_DESERT)
            ) ? ItemType.SAND : (
                player.hasState(StateType.IN_LAVA_BIOME) ||
                player.hasState(StateType.IN_FOREST)
            ) ? ItemType.GROUND : player.hasState(StateType.IN_WINTER) ? ItemType.ICE : 0;
            const reward = Utils.getShovelTreasure(this.server.configSystem.dropChance);
            item && player.inventory.increase(item, player.right.dig, true);
            reward !== -1 && player.inventory.increase(reward, player.right.dig, true);
        }

        const writer = new BinaryWriter();

        writer.writeUInt16(ClientPackets.HITTEN);
        for (const unit of damaged) {
            if (unit === player) continue;

            if (unit instanceof Player) {
                if(unit.flight !== player.flight) continue;
                const isHood = [ItemType.HOOD, ItemType.WINTER_HOOD].includes(player.helmet.id);

                const peasant = unit.helmet.id === ItemType.WINTER_PEASANT || (player.helmet.id === ItemType.HOOD && unit.helmet.id === ItemType.PEASANT);
                if (
                    player.right.id === ItemType.HAND && isHood && !peasant && !player.hasState(StateType.FIRE) && !unit.hasState(StateType.FIRE) &&
                    this.server.timeSystem.time === WorldTime.NIGHT &&
                    now - player.timestamps.get("hood") > (player.helmet.id === ItemType.WINTER_HOOD ? 4000 : 8000)
                ) {
                    const items = Array.from(unit.inventory.items.entries()).filter(([id, count]) => unit.helmet.id !== id && unit.right.id !== id && unit.vehicle.id !== id && count > 0);
                    if (items.length > 0) {
                        const [id, c] = Utils.getRandomFromArray(items);

                        const count = Math.min(this.server.config.dead_box_drop_limit, c);

                        player.inventory.increase(id, count, true);
                        unit.inventory.decrease(id, count, true);
                        player.ruinQuests();
                        player.timestamps.set("hood", now);
                    }
                }

                unit.reason = DeathReason.PLAYER;
                HealthSystem.damage(
                    unit,
                    (player.right.damage + unit.defense) * (TeamSystem.isAlly(player, unit) ? .3 : 1),
                    ActionType.HURT,
                    player
                );
            } else if (unit instanceof Building) {
                if(player.flight) continue;

                if (player.right.id === ItemType.WRENCH) {
                    HealthSystem.heal(unit, player.right.building_damage);
                } else {
                    if (unit.hasComponent(ComponentType.ON_HIT_DAMAGE) && !(unit.owner && TeamSystem.isAlly(player, unit.owner)) && unit.getComponent(ComponentType.OBSTACLE)) {
                        damagedSpikes.push(unit);
                    }
                    HealthSystem.damage(unit, player.right.building_damage, 0, player);
                }
                this.server.buildingSystem.addShake(player.angle, unit.id);
            } else if (unit instanceof Tile && unit.collide) {
                if(player.flight) continue;
                empty = damaged.length > 1;
                dontHarvest = damaged.length > 1;
                let harvest = Math.max(0, player.right.harvest + 1 - unit.hard) * this.server.config.harvest;

                if(unit.type === TileType.CACTUS) {
                    HealthSystem.damage(player, 40, ActionType.HURT, player);
                }

                if (unit.hard === -1) harvest = 1;

                unit.angle = player.angle;
                writer.writeUInt16(...unit.shake());

                if (harvest) dontHarvest = false;
                if (unit.count > 0) empty = false;

                unit.dig(player, harvest);
            } else if (unit instanceof Crate) {
                if(player.flight) continue;

                HealthSystem.damage(unit, player.right.damage, ActionType.HURT, player);
            } else if(unit instanceof Entity) {
                unit.onDead(player);
                unit.delete();
            }
        }

        if (empty && player.client) player.client.sendBinary(CachedPackets.get(ClientPackets.EMPTY_RES));
        if (dontHarvest && player.client) player.client.sendBinary(CachedPackets.get(ClientPackets.DONT_HARVEST));

        if (damagedSpikes.length) {
            const spike = damagedSpikes.sort((b, a) => this.server.content.entities[a.type].ON_HIT_DAMAGE - this.server.content.entities[b.type].ON_HIT_DAMAGE);

            if(spike[0].damage > 0) {
                HealthSystem.damage(player, spike[0].getComponent(ComponentType.ON_HIT_DAMAGE), ActionType.HURT, spike[0]);
            }
        }

        if (writer.toBuffer().length > 2) {
            this.server.broadcast(writer.toBuffer(), true);
        }
    }
}