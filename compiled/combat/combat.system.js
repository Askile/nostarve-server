"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const player_1 = __importDefault(require("../entities/player"));
const state_type_1 = require("../enums/types/state.type");
const action_type_1 = require("../enums/types/action.type");
const utils_1 = require("../modules/utils");
const bullet_1 = require("../entities/bullet");
const item_type_1 = require("../enums/types/item.type");
const world_time_1 = require("../enums/world.time");
const death_reason_1 = require("../enums/death.reason");
const health_system_1 = __importDefault(require("../attributes/health.system"));
const building_1 = __importDefault(require("../building/building"));
const tile_1 = require("../world/tile");
const tile_type_1 = require("../enums/types/tile.type");
const crate_1 = require("../entities/crate");
const cached_packets_1 = require("../network/cached.packets");
const packets_1 = require("../enums/packets");
const team_system_1 = __importDefault(require("../team/team.system"));
const binary_writer_1 = require("../modules/binary.writer");
const entity_1 = require("../entities/entity");
class CombatSystem {
    server;
    constructor(server) {
        this.server = server;
    }
    tick(player) {
        const now = Date.now();
        if (this.server.config.disable_attack === 1 ||
            !player.hasState(state_type_1.StateType.ATTACK) ||
            now - player.timestamps.get("attack") < 500)
            return;
        player.addAction(action_type_1.ActionType.ATTACK);
        player.timestamps.set("attack", now);
        if (player.right.isBow()) {
            const type = utils_1.Utils.getArrowType(player);
            if (type !== -1) {
                player.inventory.decrease(type[1], 1, true);
                new bullet_1.Bullet(this.server, player, type[0]);
            }
            return;
        }
        const hitPosition = utils_1.Utils.getOffsetVector(player.realPosition, player.right.offset, player.angle);
        const damaged = this.server.world.queryCircle(hitPosition, player.right.radius);
        let empty = false;
        let dontHarvest = false;
        let damagedSpikes = [];
        const canDig = !player.hasState(state_type_1.StateType.IN_WATER) && player.right.dig && !player.flight;
        if (canDig) {
            const item = (
            // this.server.world.distanceFromSand(player.biomes[0], player.biomes[0].position.x, player.biomes[0].position.y) ||
            player.hasState(state_type_1.StateType.IN_ISLAND) ||
                player.hasState(state_type_1.StateType.IN_DESERT)) ? item_type_1.ItemType.SAND : (player.hasState(state_type_1.StateType.IN_LAVA_BIOME) ||
                player.hasState(state_type_1.StateType.IN_FOREST)) ? item_type_1.ItemType.GROUND : player.hasState(state_type_1.StateType.IN_WINTER) ? item_type_1.ItemType.ICE : 0;
            const reward = utils_1.Utils.getShovelTreasure(this.server.configSystem.dropChance);
            item && player.inventory.increase(item, player.right.dig, true);
            reward !== -1 && player.inventory.increase(reward, player.right.dig, true);
        }
        const writer = new binary_writer_1.BinaryWriter();
        writer.writeUInt16(packets_1.ClientPackets.HITTEN);
        for (const unit of damaged) {
            if (unit === player)
                continue;
            if (unit instanceof player_1.default) {
                if (unit.flight !== player.flight)
                    continue;
                const isHood = [item_type_1.ItemType.HOOD, item_type_1.ItemType.WINTER_HOOD].includes(player.helmet.id);
                const peasant = unit.helmet.id === item_type_1.ItemType.WINTER_PEASANT || (player.helmet.id === item_type_1.ItemType.HOOD && unit.helmet.id === item_type_1.ItemType.PEASANT);
                if (player.right.id === item_type_1.ItemType.HAND && isHood && !peasant && !player.hasState(state_type_1.StateType.FIRE) && !unit.hasState(state_type_1.StateType.FIRE) &&
                    this.server.timeSystem.time === world_time_1.WorldTime.NIGHT &&
                    now - player.timestamps.get("hood") > (player.helmet.id === item_type_1.ItemType.WINTER_HOOD ? 4000 : 8000)) {
                    const items = Array.from(unit.inventory.items.entries()).filter(([id, count]) => unit.helmet.id !== id && unit.right.id !== id && unit.vehicle.id !== id && count > 0);
                    if (items.length > 0) {
                        const [id, c] = utils_1.Utils.getRandomFromArray(items);
                        const count = Math.min(this.server.config.dead_box_drop_limit, c);
                        player.inventory.increase(id, count, true);
                        unit.inventory.decrease(id, count, true);
                        player.ruinQuests();
                        player.timestamps.set("hood", now);
                    }
                }
                unit.reason = death_reason_1.DeathReason.PLAYER;
                health_system_1.default.damage(unit, (player.right.damage + unit.defense) * (team_system_1.default.isAlly(player, unit) ? .3 : 1), action_type_1.ActionType.HURT, player);
            }
            else if (unit instanceof building_1.default) {
                if (player.flight)
                    continue;
                if (player.right.id === item_type_1.ItemType.WRENCH) {
                    health_system_1.default.heal(unit, player.right.building_damage);
                }
                else {
                    if (unit.hasComponent("ON_HIT_DAMAGE" /* ComponentType.ON_HIT_DAMAGE */) && !(unit.owner && team_system_1.default.isAlly(player, unit.owner)) && unit.getComponent("OBSTACLE" /* ComponentType.OBSTACLE */)) {
                        damagedSpikes.push(unit);
                    }
                    health_system_1.default.damage(unit, player.right.building_damage, 0, player);
                }
                this.server.buildingSystem.addShake(player.angle, unit.id);
            }
            else if (unit instanceof tile_1.Tile && unit.collide) {
                if (player.flight)
                    continue;
                empty = damaged.length > 1;
                dontHarvest = damaged.length > 1;
                let harvest = Math.max(0, player.right.harvest + 1 - unit.hard) * this.server.config.harvest;
                if (unit.type === tile_type_1.TileType.CACTUS) {
                    health_system_1.default.damage(player, 40, action_type_1.ActionType.HURT, player);
                }
                if (unit.hard === -1)
                    harvest = 1;
                unit.angle = player.angle;
                writer.writeUInt16(...unit.shake());
                if (harvest)
                    dontHarvest = false;
                if (unit.count > 0)
                    empty = false;
                unit.dig(player, harvest);
            }
            else if (unit instanceof crate_1.Crate) {
                if (player.flight)
                    continue;
                health_system_1.default.damage(unit, player.right.damage, action_type_1.ActionType.HURT, player);
            }
            else if (unit instanceof entity_1.Entity) {
                unit.onDead(player);
                unit.delete();
            }
        }
        if (empty && player.client)
            player.client.sendBinary(cached_packets_1.CachedPackets.get(packets_1.ClientPackets.EMPTY_RES));
        if (dontHarvest && player.client)
            player.client.sendBinary(cached_packets_1.CachedPackets.get(packets_1.ClientPackets.DONT_HARVEST));
        if (damagedSpikes.length) {
            const spike = damagedSpikes.sort((b, a) => this.server.content.entities[a.type].ON_HIT_DAMAGE - this.server.content.entities[b.type].ON_HIT_DAMAGE);
            if (spike[0].damage > 0) {
                health_system_1.default.damage(player, spike[0].getComponent("ON_HIT_DAMAGE" /* ComponentType.ON_HIT_DAMAGE */), action_type_1.ActionType.HURT, spike[0]);
            }
        }
        if (writer.toBuffer().length > 2) {
            this.server.broadcast(writer.toBuffer(), true);
        }
    }
}
exports.default = CombatSystem;
