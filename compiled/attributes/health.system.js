"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const building_1 = __importDefault(require("../building/building"));
const player_1 = __importDefault(require("../entities/player"));
const action_type_1 = require("../enums/types/action.type");
const entity_type_1 = require("../enums/types/entity.type");
const packet_sender_1 = __importDefault(require("../network/packet.sender"));
const state_type_1 = require("../enums/types/state.type");
class HealthSystem {
    static damage(entity, amount, action, damager) {
        if (!entity.server.loaded)
            return;
        if (entity.type === entity_type_1.EntityType.PLAYER && (entity.hasState(state_type_1.StateType.GOD_MODE) || Date.now() - entity.createdAt < 8000))
            return;
        entity.addAction(action);
        if (amount < 0)
            return;
        entity.health = Math.max(0, entity.health - amount);
        if (entity.health <= 0) {
            entity.delete();
            entity.onDead(damager);
            if (entity.type === entity_type_1.EntityType.PLAYER && damager instanceof player_1.default) {
                damager.kills++;
            }
        }
        entity.onDamage(damager);
        if (entity.type === entity_type_1.EntityType.PLAYER) {
            packet_sender_1.default.health(entity);
        }
    }
    static heal(entity, amount) {
        if (amount < 0)
            return;
        entity.health = Math.min(entity.server.configSystem.health[entity.type], entity.health + amount);
        if (entity.type === entity_type_1.EntityType.PLAYER && entity.health) {
            packet_sender_1.default.health(entity);
        }
        if (!(entity instanceof building_1.default)) {
            entity.addAction(action_type_1.ActionType.HEAL);
        }
        else {
            entity.updateInfo();
        }
    }
}
exports.default = HealthSystem;
