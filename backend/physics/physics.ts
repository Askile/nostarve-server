import {Entity} from "../entities/entity";
import Player from "../entities/player";
import {StateType} from "../enums/types/state.type";
import PhysicsUtils from "./physics.utils";
import {TileType} from "../enums/types/tile.type";
import {EntityType} from "../enums/types/entity.type";
import Building from "../building/building";
import {ClientPackets} from "../enums/packets";
import {ComponentType} from "../enums/types/component.type";

export default class Physics {
    // public static update(entity: Entity) {
    //     const entities = entity.server.world.getEntities(entity.realPosition.x, entity.realPosition.y, 1);
    //     const tiles = entity.server.world.getTiles(entity.realPosition.x, entity.realPosition.y, 1);
    //     for (const tile of tiles) {
    //         if(
    //             tile.type !== TileType.SAND &&
    //             tile.collide
    //         ) {
    //             PhysicsUtils.rayInterceptsCircle(entity, tile);
    //             const closest = PhysicsUtils.getClosestPointOnCircle(entity, tile, false);
    //             // entity.position.set(closest);
    //             entity.addState(StateType.IS_COLLIDE);
    //         }
    //     }
    //
    //     for (const e of entities) {
    //         if(
    //             e.hasState(StateType.COLLIDEABLE) &&
    //             entity.realPosition.distance(e.realPosition) < entity.radius + e.radius
    //         ) {
    //             const closest = PhysicsUtils.getClosestPointOnCircle(entity, e, false);
    //             entity.position.set(closest);
    //             entity.addState(StateType.IS_COLLIDE);
    //         }
    //     }
    //
    //
    //     // const chunks = entity.server.world.getChunks(entity.position.x, entity.position.y, 3);
    //     // if(entity.type === EntityType.PLAYER) console.log(entity.velocity.x, entity.velocity.y);
    //     // for (const chunk of chunks) {
    //     //     for (const tile of chunk.tiles) {
    //     //         if(
    //     //             tile.type !== TileType.SAND &&
    //     //             tile.collide &&
    //     //             entity.position.distance(tile.realPosition) < entity.radius + tile.radius
    //     //         ) {
    //     //             const closest = PhysicsUtils.getClosestPointOnCircle(entity, tile, true);
    //     //             entity.position.set(closest);
    //     //             entity.addState(StateType.IS_COLLIDE);
    //     //         }
    //     //     }
    //     // }
    // }

    public static update(entity: Entity) {
        const obstacles = PhysicsUtils.getObstacles(entity.server.world, entity.realPosition, entity.radius);
        const fly = entity instanceof Player && entity.flight;
        if(fly && obstacles.length) {
            entity.addState(StateType.IS_COLLIDE);
            return;
        }

        for (const obstacle of obstacles) {
            if (obstacle.realPosition.distance(entity.position) > entity.radius + obstacle.radius)
                continue;

            // console.log(PhysicsUtils.rayDistObstacle(entity, obstacles[0]));

            const closest = PhysicsUtils.getClosestPointOnCircle(entity, obstacle, false);
            const staticClosest = PhysicsUtils.getClosestPointOnCircle(entity, obstacle, true);

            entity.addState(StateType.IS_COLLIDE);

            if (obstacles.length >= 2) {
                const distance = Math.abs(obstacles[0].realPosition.distance(obstacles[1].realPosition)) - (obstacles[0].radius + obstacles[1].radius);
                if (distance > 40)
                    entity.position.set(closest);
                else entity.position.set(staticClosest);
            } else {
                entity.position.set(closest);
            }
        }
    }

    public static updateState(entity: Entity) {
        const thisChunk = entity.server.world.getChunk(entity.position.x, entity.position.y);
        const biomes = entity.server.world.getBiomesAtEntityPosition(entity.position);
        const biomesString = biomes.map(biome => biome.type);

        if (!thisChunk) return;

        let state = 0;

        for (const tile of thisChunk.tiles) {
            if (tile.type === TileType.SAND && !(state & StateType.IN_ISLAND)) {
                state += StateType.IN_ISLAND;
            }
            if (tile.type === TileType.RIVER) {
                if (!(state & StateType.IN_WATER)) state += StateType.IN_WATER;
                if (!(state & StateType.IN_LAKE)) state += StateType.IN_LAKE;
                if (tile.meta && !(state & StateType.IN_RIVER)) state += StateType.IN_RIVER;
            }
        }

        if(biomes instanceof Array) {
            entity.biomes = biomes;
        }

        for (const entity of thisChunk.entities) {
            if(entity === undefined) continue;
            if (entity.type === EntityType.BRIDGE && !(state & StateType.IN_BRIDGE)) state += StateType.IN_BRIDGE;
            if (entity.type === EntityType.ROOF && !(state & StateType.IN_ROOF)) state += StateType.IN_ROOF;
            if (entity.type === EntityType.TOWER && !(state & StateType.IN_TOWER)) state += StateType.IN_TOWER;
            if (entity.type === EntityType.BED && !(state & StateType.IN_BED)) state += StateType.IN_BED;
            if (entity.type === EntityType.PLOT && !(state & StateType.IN_PLOT)) state += StateType.IN_PLOT;
            if (entity.type === EntityType.FIRE && !(state & StateType.IN_FIRE)) state += StateType.IN_FIRE;
            if (entity instanceof Building && entity.isSeed() && !(state & StateType.IN_SEED)) state += StateType.IN_SEED;
        }

        if (biomesString.length >= 1) {
            if (biomesString.includes("DESERT") && !(state & StateType.IN_DESERT)) state += StateType.IN_DESERT;
            if (biomesString.includes("WINTER") || biomesString.includes("DRAGON") && !(state & StateType.IN_WINTER)) state += StateType.IN_WINTER;
            if (biomesString.includes("LAVA") && !(state & StateType.IN_LAVA_BIOME)) state += StateType.IN_LAVA_BIOME;
            if (biomesString.includes("FOREST") && !(state & StateType.IN_FOREST)) state += StateType.IN_FOREST;
            if (biomesString.includes("DRAGON") && !(state & StateType.IN_CAVE)) state += StateType.IN_CAVE;
            if (biomesString.includes("SEA") && !(state & StateType.IN_ISLAND) && !(state & StateType.IN_WATER)) state += StateType.IN_WATER;
        } else {
            if (!(state & StateType.IN_WATER) && !(state & StateType.IN_ISLAND)) state += StateType.IN_WATER;
        }

        if (entity instanceof Player && !entity.flight) {
            const entities = entity.server.world.getEntities(entity.realPosition.x, entity.realPosition.y, 3);
            const tiles = entity.server.world.getTiles(entity.realPosition.x, entity.realPosition.y, 3);

            const nearest = [];
            for (const unit of entities) {
                const dist = entity.realPosition.distance(unit.realPosition);

                if(nearest[unit.type] === undefined || dist < nearest[unit.type][0]) {
                    nearest[unit.type] = [dist, unit];
                }

                if(unit instanceof Building) {
                    if (unit.type === EntityType.WORKBENCH && dist < 180 && (state & StateType.WORKBENCH) !== StateType.WORKBENCH) {
                        state += StateType.WORKBENCH;
                    } else if (dist < 180 && (unit.type === EntityType.FIRE || unit.type === EntityType.BIG_FIRE || (unit.type === EntityType.FURNACE && unit.info)) && (state & StateType.FIRE) !== StateType.FIRE) {
                        state += StateType.FIRE;
                        if (dist < 50 && (state & StateType.RESURRECTION) !== StateType.IN_FIRE) state += StateType.IN_FIRE;
                    } else if (unit.type === EntityType.WELL && dist < 180 && !(state & StateType.WELL)) {
                        state += StateType.WELL;
                    } else if (unit.type === EntityType.RESURRECTION && dist < 100 && (state & StateType.RESURRECTION) !== StateType.RESURRECTION) {
                        state += StateType.RESURRECTION;
                    }
                }
            }

            for (const tile of tiles) {
                const dist = entity.realPosition.distance(tile.realPosition);
                if (tile.type === TileType.LAVA && dist < tile.radius && (state & StateType.IN_LAVA) !== StateType.IN_LAVA) {
                    state += StateType.IN_LAVA;
                }
            }

            if ((state & StateType.IN_FIRE) !== (entity.state & StateType.IN_FIRE)) {
                entity.gauges.lastUpdateFire = Date.now();
            }

            if ((state & StateType.WORKBENCH) !== (entity.state & StateType.WORKBENCH)) {
                entity.client.sendU8([ClientPackets.WORKBENCH, Number((state & StateType.WORKBENCH) === StateType.WORKBENCH)]);
            }

            if ((state & StateType.FIRE) !== (entity.state & StateType.FIRE) || (state & StateType.IN_LAVA) !== (entity.state & StateType.IN_LAVA)) {
                entity.client.sendU8([ClientPackets.FIRE, Number((state & StateType.FIRE) === StateType.FIRE || (state & StateType.IN_LAVA) === StateType.IN_LAVA)]);
            }

            if ((state & StateType.IN_WATER) !== (entity.state & StateType.IN_WATER)) {
                entity.client.sendU8([ClientPackets.WATER, Number(state & StateType.IN_WATER)]);
            }

            if ((state & StateType.WELL) !== (entity.state & StateType.WELL)) {
                entity.client.sendU8([ClientPackets.WELL, Number(state & StateType.WELL)]);
            }

            entity.nearestBuildings = nearest.map((value) => value[1]);
        }

        for (const type of Object.values(StateType)) {
            if (typeof type !== "number" || [
                StateType.GOD_MODE, StateType.ATTACK, StateType.INVISIBLE, StateType.IS_COLLIDE, StateType.CRAFT, StateType.GHOST
            ].includes(type)) continue;
            if (!(entity.state & type) && (state & type)) {
                entity.state += type;
            } else if ((entity.state & type) && !(state & type)) {
                entity.state -= type;
            }
        }
    }
}