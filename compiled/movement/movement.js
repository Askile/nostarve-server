"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vector_1 = require("../modules/vector");
const player_1 = __importDefault(require("../entities/player"));
const state_type_1 = require("../enums/types/state.type");
const entity_type_1 = require("../enums/types/entity.type");
const physics_1 = __importDefault(require("../physics/physics"));
class Movement {
    static tick(entity) {
        const server = entity.server;
        if (!entity.speed) {
            entity.realPosition.set(entity.position);
            return;
        }
        let angle_ = entity.realPosition.getStandardAngle(entity.position) + Math.PI;
        const vector = entity.realPosition.build(entity.speed * 1000 * server.ticker.delta, angle_);
        if (angle_) {
            if (vector.magnitude() < entity.realPosition.subtract(entity.position).magnitude()) {
                entity.realPosition.set(entity.realPosition.add(vector));
                physics_1.default.update(entity);
            }
            else {
                entity.realPosition.x = entity.position.x;
                entity.realPosition.y = entity.position.y;
            }
        }
        if (!entity.direction && (entity instanceof player_1.default && !(entity.vehicle?.id && entity.speed !== 0.03))) {
            entity.velocity = vector_1.Vector.zero();
            return;
        }
        const angle = Math.atan2(entity.direction & 4 ? 1 : entity.direction & 8 ? -1 : 0, entity.direction & 2 ? 1 : entity.direction & 1 ? -1 : 0);
        if (entity.type === entity_type_1.EntityType.PLAYER && entity.direction !== 0) {
            entity.velocity.x = Math.round(50 * Math.cos(angle));
            entity.velocity.y = Math.round(50 * Math.sin(angle));
        }
        entity.updateSpeed();
        if (entity.type === entity_type_1.EntityType.PLAYER && !entity.hasState(state_type_1.StateType.STUNNED)) {
            entity.position.set(entity.realPosition.add(entity.velocity));
            physics_1.default.update(entity);
        }
    }
}
exports.default = Movement;
