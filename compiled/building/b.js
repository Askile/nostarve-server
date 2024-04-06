"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const entity_1 = require("../entities/entity");
const player_1 = __importDefault(require("../entities/player"));
const entity_type_1 = require("../enums/types/entity.type");
const timestamp_1 = __importDefault(require("../modules/timestamp"));
const item_type_1 = require("../enums/types/item.type");
const default_recipes_1 = require("../default/default.recipes");
const death_reason_1 = require("../enums/death.reason");
const health_system_1 = __importDefault(require("../attributes/health.system"));
const action_type_1 = require("../enums/types/action.type");
const binary_writer_1 = require("../modules/binary.writer");
const packets_1 = require("../enums/packets");
const team_system_1 = __importDefault(require("../team/team.system"));
const building_utils_1 = __importDefault(require("./building.utils"));
const state_type_1 = require("../enums/types/state.type");
class Building extends entity_1.Entity {
    timestamps;
    data;
    owner;
    constructor(type, owner, server) {
        super(type, server);
        this.timestamps = new Map();
        this.data = [];
        this.owner = owner ?? undefined;
    }
    onPlaced() {
        switch (this.type) {
            case entity_type_1.EntityType.BERRY_SEED:
            case entity_type_1.EntityType.WHEAT_SEED:
            case entity_type_1.EntityType.PUMPKIN_SEED:
            case entity_type_1.EntityType.CARROT_SEED:
            case entity_type_1.EntityType.TOMATO_SEED:
            case entity_type_1.EntityType.THORNBUSH_SEED:
            case entity_type_1.EntityType.GARLIC_SEED:
            case entity_type_1.EntityType.WATERMELON_SEED:
            case entity_type_1.EntityType.ALOE_VERA_SEED:
                {
                    this.info = 10;
                    if (this.owner?.helmet?.id === item_type_1.ItemType.PEASANT)
                        this.data = [1];
                    if (this.owner?.helmet?.id === item_type_1.ItemType.WINTER_PEASANT)
                        this.data = [2];
                }
                break;
            case entity_type_1.EntityType.TOTEM:
                {
                    this.timestamps.set("teammates", new timestamp_1.default(3000));
                    if (this.owner?.id) {
                        this.owner.totem = this;
                        this.data.push(this.owner.id);
                    }
                }
                break;
        }
        if (this.hasComponent("HEALTH_BAR" /* ComponentType.HEALTH_BAR */)) {
            this.info = 100;
            if (this.hasComponent("DOOR" /* ComponentType.DOOR */)) {
                this.info = 200;
            }
        }
        this.pid = this.owner?.id ?? 0;
        this.realPosition.set(this.position);
        this.id = this.server.entityPool.generate();
        this.server.entities[this.id] = this;
        const timeEvents = this.getComponent("time-events");
        if (timeEvents && timeEvents.length) {
            for (const { time, commands } of timeEvents) {
                this.timestamps.set("time-event#" + this.id, new timestamp_1.default(time * 1000));
            }
        }
    }
    onTick() {
        const now = Date.now();
        /* Special buildings */
        switch (this.type) {
            case entity_type_1.EntityType.BERRY_SEED:
            case entity_type_1.EntityType.WHEAT_SEED:
            case entity_type_1.EntityType.PUMPKIN_SEED:
            case entity_type_1.EntityType.CARROT_SEED:
            case entity_type_1.EntityType.TOMATO_SEED:
            case entity_type_1.EntityType.THORNBUSH_SEED:
            case entity_type_1.EntityType.GARLIC_SEED:
            case entity_type_1.EntityType.WATERMELON_SEED:
            case entity_type_1.EntityType.ALOE_VERA_SEED:
                {
                    const data = this.data[0];
                    const isPeasant = data === 1;
                    const isWinterPeasant = data === 2;
                    const hasBorn = now - this.createdAt >= this.server.configSystem.seedBirth[this.type] * (this.hasState(state_type_1.StateType.IN_PLOT) ? isPeasant ? 0.6 : 0.8 : isPeasant ? 0.8 : 1) * (isWinterPeasant ? 0.6 : 1);
                    const hasGrowth = now - this.timestamps[0] >= this.server.configSystem.seedGrowth[this.type] * (this.hasState(state_type_1.StateType.IN_PLOT) ? isPeasant ? 0.6 : 0.8 : isPeasant ? 0.8 : 1) * (isWinterPeasant ? 0.6 : 1);
                    const hasDrain = now - this.timestamps[1] >= this.server.configSystem.seedDrain[this.type] * (this.hasState(state_type_1.StateType.IN_PLOT) ? isPeasant ? 1.4 : 1.2 : isPeasant ? 1.2 : 1) * (isWinterPeasant ? 1.4 : 1);
                    const needDelete = now - this.createdAt >= this.server.configSystem.seedLife[this.type];
                    if (hasDrain && this.info !== 10 && !(this.info & 16)) {
                        this.timestamps[1] = now;
                        this.info |= 16;
                    }
                    if (hasGrowth && this.info !== 10 && !(this.info & 16)) {
                        this.timestamps[0] = now;
                        this.info = Math.min(this.server.configSystem.seedFruitsCount[this.type], this.info + 1);
                    }
                    if (hasBorn && this.info === 10) {
                        this.info = 0;
                        this.timestamps[0] = now;
                        this.timestamps[1] = now;
                    }
                    needDelete && this.delete();
                }
                break;
            case entity_type_1.EntityType.TOTEM:
                {
                    if (this.timestamps.get("teammates").isFinished()) {
                        const positions = new binary_writer_1.BinaryWriter();
                        positions.writeUInt8(packets_1.ClientPackets.MINIMAP);
                        for (const id of this.data) {
                            const player = this.server.players[id - 1];
                            if (player.alive)
                                positions.writeUInt8(player.position.x / this.server.world.width * 250, player.position.y / this.server.world.height * 250);
                        }
                        for (const id of this.data) {
                            const player = this.server.players[id - 1];
                            if (player?.client)
                                player.client.sendBinary(positions.toBuffer());
                        }
                    }
                }
                break;
        }
        if (!building_utils_1.default.isDoor(this.type) && building_utils_1.default.isSpike(this.type) && Date.now() - this.createdAt > 120_000) {
            this.delete();
        }
        const timeEvents = this.getComponent("time-events");
        if (timeEvents?.length) {
            for (const { time, commands } of timeEvents) {
                const timestamp = this.timestamps.get("time-event#" + this.id);
                if (timestamp?.isFinished()) {
                    for (const command of commands) {
                        this.server.commandSystem.handleServerCommand(command, this.owner);
                    }
                }
            }
        }
    }
    updateInfo() {
        if (this.hasComponent("HEALTH_BAR" /* ComponentType.HEALTH_BAR */)) {
            this.info = Math.floor(this.health / this.server.configSystem.health[this.type] * 100);
            if (this.hasComponent("DOOR" /* ComponentType.DOOR */)) {
                this.info = Math.floor(this.health / this.server.configSystem.health[this.type] * 200);
                const isEven = this.info % 2 === 0;
                if (isEven && !this.getComponent("OBSTACLE" /* ComponentType.OBSTACLE */)) {
                    this.info -= 1;
                }
                else if (!isEven && this.getComponent("OBSTACLE" /* ComponentType.OBSTACLE */)) {
                    this.info += 1;
                }
            }
        }
    }
    onDamage(damager) {
        if (!damager)
            return;
        if (this.hasComponent("HEALTH_BAR" /* ComponentType.HEALTH_BAR */)) {
            const nearest = this.server.world.getNearest(this, [entity_type_1.EntityType.PLAYER], this.radius + 24);
            this.info = Math.floor(this.health / this.server.configSystem.health[this.type] * 100);
            if (this.hasComponent("DOOR" /* ComponentType.DOOR */)) {
                this.info = Math.floor(this.health / this.server.configSystem.health[this.type] * 200);
                const isEven = this.info % 2 === 0;
                if (damager instanceof player_1.default && team_system_1.default.isAlly(damager, this?.owner) && !(nearest && !this.getComponent("OBSTACLE" /* ComponentType.OBSTACLE */))) {
                    this.setComponent("OBSTACLE" /* ComponentType.OBSTACLE */, !this.getComponent("OBSTACLE" /* ComponentType.OBSTACLE */));
                }
                if (isEven && !this.getComponent("OBSTACLE" /* ComponentType.OBSTACLE */)) {
                    this.info -= 1;
                }
                else if (!isEven && this.getComponent("OBSTACLE" /* ComponentType.OBSTACLE */)) {
                    this.info += 1;
                }
            }
        }
        if (damager instanceof player_1.default) {
            if (this.isSeed()) {
                const isBorn = this.info !== 10;
                if (isBorn && this.info && damager.right.id !== item_type_1.ItemType.WATERING_CAN_FULL && this.info !== 16) {
                    const harvest = damager.right.id === item_type_1.ItemType.GOLD_PITCHFORK ? 3 : item_type_1.ItemType.PITCHFORK ? 2 : 1;
                    this.info -= 1;
                    this.owner.score += 3 * harvest;
                    damager.inventory.increase(this.server.configSystem.seedFruits[this.type], harvest, true);
                }
                if (damager.right.id === item_type_1.ItemType.WATERING_CAN_FULL && this.info >= 16) {
                    this.info -= 16;
                    this.timestamps[1] = Date.now();
                }
            }
        }
    }
    delete() {
        super.delete();
        switch (this.type) {
            case entity_type_1.EntityType.TOTEM:
                {
                    this.server.teamSystem.destroyTeam(this);
                }
                break;
        }
    }
    onDead(damager) {
        super.onDead(damager);
        if (damager?.type === entity_type_1.EntityType.PLAYER && this.owner) {
            switch (this.type) {
                case entity_type_1.EntityType.EMERALD_MACHINE:
                    {
                        this.owner.reason = death_reason_1.DeathReason.EMERALD;
                        health_system_1.default.damage(this.owner, 200, action_type_1.ActionType.HURT, damager);
                    }
                    break;
            }
        }
        if (damager?.type === entity_type_1.EntityType.PLAYER) {
            if (this.server.config.disable_gather_building === 0) {
                const id = item_type_1.ItemType[entity_type_1.EntityType[this.type]];
                const craft = default_recipes_1.RECIPES[id];
                if (craft?.r) {
                    for (const [id, count] of craft.r) {
                        if (count === 1)
                            continue;
                        damager.inventory.increase(id, ~~(count / 1.8), true);
                    }
                }
            }
            damager.score += 20;
        }
        if (this.owner?.buildings[this.type]) {
            this.owner.buildings[this.type] = this.owner.buildings[this.type].filter(building => building !== this);
        }
    }
    isVisualHealth() {
        return [
            entity_type_1.EntityType.WOOD_SPIKE, entity_type_1.EntityType.STONE_SPIKE, entity_type_1.EntityType.GOLD_SPIKE, entity_type_1.EntityType.DIAMOND_SPIKE, entity_type_1.EntityType.AMETHYST_SPIKE, entity_type_1.EntityType.REIDITE_SPIKE,
            entity_type_1.EntityType.WOOD_WALL, entity_type_1.EntityType.STONE_WALL, entity_type_1.EntityType.GOLD_WALL, entity_type_1.EntityType.DIAMOND_WALL, entity_type_1.EntityType.AMETHYST_WALL, entity_type_1.EntityType.REIDITE_WALL,
            entity_type_1.EntityType.WOOD_DOOR, entity_type_1.EntityType.STONE_DOOR, entity_type_1.EntityType.GOLD_DOOR, entity_type_1.EntityType.DIAMOND_DOOR, entity_type_1.EntityType.AMETHYST_DOOR, entity_type_1.EntityType.REIDITE_DOOR,
            entity_type_1.EntityType.WOOD_DOOR_SPIKE, entity_type_1.EntityType.STONE_DOOR_SPIKE, entity_type_1.EntityType.GOLD_DOOR_SPIKE, entity_type_1.EntityType.DIAMOND_DOOR_SPIKE, entity_type_1.EntityType.AMETHYST_DOOR_SPIKE, entity_type_1.EntityType.REIDITE_DOOR_SPIKE,
            entity_type_1.EntityType.BRIDGE, entity_type_1.EntityType.ROOF, entity_type_1.EntityType.EMERALD_MACHINE
        ].includes(this.type);
    }
    isDoor() {
        return [
            entity_type_1.EntityType.WOOD_DOOR, entity_type_1.EntityType.STONE_DOOR, entity_type_1.EntityType.GOLD_DOOR, entity_type_1.EntityType.DIAMOND_DOOR, entity_type_1.EntityType.AMETHYST_DOOR, entity_type_1.EntityType.REIDITE_DOOR,
            entity_type_1.EntityType.WOOD_DOOR_SPIKE, entity_type_1.EntityType.STONE_DOOR_SPIKE, entity_type_1.EntityType.GOLD_DOOR_SPIKE, entity_type_1.EntityType.DIAMOND_DOOR_SPIKE, entity_type_1.EntityType.AMETHYST_DOOR_SPIKE, entity_type_1.EntityType.REIDITE_DOOR_SPIKE
        ].includes(this.type);
    }
    isSeed() {
        return [
            entity_type_1.EntityType.BERRY_SEED, entity_type_1.EntityType.WHEAT_SEED, entity_type_1.EntityType.CARROT_SEED, entity_type_1.EntityType.TOMATO_SEED,
            entity_type_1.EntityType.THORNBUSH_SEED, entity_type_1.EntityType.GARLIC_SEED, entity_type_1.EntityType.WATERMELON_SEED, entity_type_1.EntityType.PUMPKIN_SEED
        ].includes(this.type);
    }
    noCheck() {
        return [
            entity_type_1.EntityType.BRIDGE, entity_type_1.EntityType.ROOF, entity_type_1.EntityType.TOWER
        ].includes(this.type);
    }
    serialize() {
        return [
            this.type, this.id, this.owner ? this.owner.id : 0, Math.floor(this.position.x), Math.floor(this.position.y), this.angle, this.info, this.action, this.speed,
            this.extra, this.health,
            this.createdAt, this.data, Array.from(this.timestamps.entries()).map(([key, stamp]) => [key, stamp.time]),
        ];
    }
}
exports.default = Building;
