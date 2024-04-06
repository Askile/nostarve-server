import {Entity} from "../entities/entity";
import {Vector} from "../modules/vector";
import Player from "../entities/player";
import {StateType} from "../enums/types/state.type";
import {EntityType} from "../enums/types/entity.type";
import Physics from "../physics/physics";

export default class Movement {
    public static tick(entity: Entity) {
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
                Physics.update(entity);
            } else {
                entity.realPosition.x = entity.position.x;
                entity.realPosition.y = entity.position.y;
            }
        }

        if (!entity.direction && (entity instanceof Player && !(entity.vehicle?.id && entity.speed !== 0.03))) {
            entity.velocity = Vector.zero();
            return;
        }

        const angle = Math.atan2(
            entity.direction & 4 ? 1 : entity.direction & 8 ? -1 : 0,
            entity.direction & 2 ? 1 : entity.direction & 1 ? -1 : 0
        );

        if (entity.type === EntityType.PLAYER && entity.direction !== 0) {
            entity.velocity.x = Math.round(50 * Math.cos(angle));
            entity.velocity.y = Math.round(50 * Math.sin(angle));
        }

        entity.updateSpeed();
        if (entity.type === EntityType.PLAYER && !entity.hasState(StateType.STUNNED)) {
            entity.position.set(entity.realPosition.add(entity.velocity));
            Physics.update(entity);
        }
    }
}