import {Entity} from "../entities/entity";
import {Vector} from "../modules/vector";
import {EntityType} from "../enums/types/entity.type";
import {StateType} from "../enums/types/state.type";
import {TileType} from "../enums/types/tile.type";
import {World} from "../world/world";
import {Tile} from "../world/tile";
import {ComponentType} from "../enums/types/component.type";

export default class PhysicsUtils {
    public static rayDistObstacle(entity: Entity, obstacle: Entity | Tile) {
        const dx = entity.position.x - entity.realPosition.x;
        const dy = entity.position.y - entity.realPosition.y;
        const vcx = entity.realPosition.x - obstacle.realPosition.x;
        const vcy = entity.realPosition.y - obstacle.realPosition.y;
        const v = (vcx * dx +  vcy * dy) * (-2 / Math.hypot(dx, dy));
        const dd = v * v - 4 * (vcx * vcx + vcy * vcy - obstacle.radius * obstacle.radius);
        if (dd <= 0) { return Infinity; }
        return (v - Math.sqrt(dd)) / 2;
    }
    public static rayInterceptsCircle(entity: Entity, obstacle: Entity | Tile) {
        const r = PhysicsUtils.rayDistObstacle(entity, obstacle);
        // console.log(r);
        return r < obstacle.radius && r > 0;
    }
    public static getColliders(world: World, entity: Entity, radius: number, size: number = 2) {
        const {x, y} = entity.realPosition;
        const entities = world.getEntities(x, y, size);
        const tiles = world.getTiles(x, y, size);

        const response = [];

        for (const obstacle of entities) {
            const dist = entity.realPosition.distance(obstacle.realPosition);

            if (dist >= radius + obstacle.radius || obstacle === entity) continue;

            response.push(obstacle);
        }

        for (const obstacle of tiles) {
            const dist = entity.realPosition.distance(obstacle.realPosition);

            if (obstacle.type === TileType.SAND) continue;
            if (!obstacle.collide || dist >= radius + obstacle.radius) continue;

            response.push(obstacle);
        }

        return response;
    }
    public static getObstacles(world: World, position: Vector, radius: number, size: number = 2) {
        const entities = world.getEntities(position.x, position.y, size);
        const tiles = world.getTiles(position.x, position.y, size);

        const response = [];

        for (const obstacle of entities) {
            const dist = position.distance(obstacle.realPosition);

            if (!obstacle.getComponent(ComponentType.OBSTACLE) || dist > radius + obstacle.radius || obstacle.position === position) continue;

            response.push(obstacle);
        }

        for (const obstacle of tiles) {
            if(
                obstacle.type !== TileType.SAND &&
                obstacle.collide &&
                position.distance(obstacle.realPosition) < obstacle.radius + radius
            ) response.push(obstacle);
        }

        return response;
    }

    public checkCollision(entity: Entity, angle: number, width: number, height: number) {
        // const cosA = Math.cos(angle);
        // const sinA = Math.sin(angle);
        // const rotatedRectX = rect.x * cosA - rect.y * sinA;
        // const rotatedRectY = rect.x * sinA + rect.y * cosA;
        //
        // const dx = Math.abs(entity.realPosition.x - rotatedRectX - width / 2);
        // const dy = Math.abs(entity.realPosition.y - rotatedRectY - height / 2);
        //
        // if (dx > width / 2 + entity.radius || dy > height / 2 + entity.radius) {
        //     return false;
        // }
        //
        // if (dx <= width / 2 || dy <= height / 2) {
        //     return true;
        // }
        //
        // const cornerDistance = Math.pow(dx - width / 2, 2) + Math.pow(dy - height / 2, 2);
        // return cornerDistance <= Math.pow(entity.radius, 2);
    }

    public static getClosestPointOnCircle(entity: Entity, obstacle: any, stop: boolean) {
        const dist = entity.position.subtract(obstacle.realPosition);
        const dist_ = entity.realPosition.subtract(obstacle.realPosition);

        const overlap = entity.radius + obstacle.radius;
        const response = obstacle.realPosition.clone();

        let angle = Math.atan2(dist.y, dist.x);
        const angle_ = Math.atan2(dist_.y, dist_.x);

        const diff = angle_ - angle;

        if (angle_ < angle || diff > 5)
            angle = angle_ + 0.2;
        if (angle_ > angle || diff < -5)
            angle = angle_ - 0.2;

        if (stop || !diff) {
            angle = angle_;
        }

        response.x += overlap * Math.cos(angle);
        response.y += overlap * Math.sin(angle);

        return response;
    }
}