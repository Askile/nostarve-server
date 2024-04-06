"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const player_1 = __importDefault(require("../entities/player"));
const state_type_1 = require("../enums/types/state.type");
const physics_utils_1 = __importDefault(require("./physics.utils"));
const tile_type_1 = require("../enums/types/tile.type");
const entity_type_1 = require("../enums/types/entity.type");
const building_1 = __importDefault(require("../building/building"));
const packets_1 = require("../enums/packets");
class Physics {
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
    static update(entity) {
        const obstacles = physics_utils_1.default.getObstacles(entity.server.world, entity.realPosition, entity.radius);
        const fly = entity instanceof player_1.default && entity.flight;
        if (fly && obstacles.length) {
            entity.addState(state_type_1.StateType.IS_COLLIDE);
            return;
        }
        for (const obstacle of obstacles) {
            if (obstacle.realPosition.distance(entity.position) > entity.radius + obstacle.radius)
                continue;
            // console.log(PhysicsUtils.rayDistObstacle(entity, obstacles[0]));
            const closest = physics_utils_1.default.getClosestPointOnCircle(entity, obstacle, false);
            const staticClosest = physics_utils_1.default.getClosestPointOnCircle(entity, obstacle, true);
            entity.addState(state_type_1.StateType.IS_COLLIDE);
            if (obstacles.length >= 2) {
                const distance = Math.abs(obstacles[0].realPosition.distance(obstacles[1].realPosition)) - (obstacles[0].radius + obstacles[1].radius);
                if (distance > 40)
                    entity.position.set(closest);
                else
                    entity.position.set(staticClosest);
            }
            else {
                entity.position.set(closest);
            }
        }
    }
    static updateState(entity) {
        const thisChunk = entity.server.world.getChunk(entity.position.x, entity.position.y);
        const biomes = entity.server.world.getBiomesAtEntityPosition(entity.position);
        const biomesString = biomes.map(biome => biome.type);
        if (!thisChunk)
            return;
        let state = 0;
        for (const tile of thisChunk.tiles) {
            if (tile.type === tile_type_1.TileType.SAND && !(state & state_type_1.StateType.IN_ISLAND)) {
                state += state_type_1.StateType.IN_ISLAND;
            }
            if (tile.type === tile_type_1.TileType.RIVER) {
                if (!(state & state_type_1.StateType.IN_WATER))
                    state += state_type_1.StateType.IN_WATER;
                if (!(state & state_type_1.StateType.IN_LAKE))
                    state += state_type_1.StateType.IN_LAKE;
                if (tile.meta && !(state & state_type_1.StateType.IN_RIVER))
                    state += state_type_1.StateType.IN_RIVER;
            }
        }
        if (biomes instanceof Array) {
            entity.biomes = biomes;
        }
        for (const entity of thisChunk.entities) {
            if (entity === undefined)
                continue;
            if (entity.type === entity_type_1.EntityType.BRIDGE && !(state & state_type_1.StateType.IN_BRIDGE))
                state += state_type_1.StateType.IN_BRIDGE;
            if (entity.type === entity_type_1.EntityType.ROOF && !(state & state_type_1.StateType.IN_ROOF))
                state += state_type_1.StateType.IN_ROOF;
            if (entity.type === entity_type_1.EntityType.TOWER && !(state & state_type_1.StateType.IN_TOWER))
                state += state_type_1.StateType.IN_TOWER;
            if (entity.type === entity_type_1.EntityType.BED && !(state & state_type_1.StateType.IN_BED))
                state += state_type_1.StateType.IN_BED;
            if (entity.type === entity_type_1.EntityType.PLOT && !(state & state_type_1.StateType.IN_PLOT))
                state += state_type_1.StateType.IN_PLOT;
            if (entity.type === entity_type_1.EntityType.FIRE && !(state & state_type_1.StateType.IN_FIRE))
                state += state_type_1.StateType.IN_FIRE;
            if (entity instanceof building_1.default && entity.isSeed() && !(state & state_type_1.StateType.IN_SEED))
                state += state_type_1.StateType.IN_SEED;
        }
        if (biomesString.length >= 1) {
            if (biomesString.includes("DESERT") && !(state & state_type_1.StateType.IN_DESERT))
                state += state_type_1.StateType.IN_DESERT;
            if (biomesString.includes("WINTER") || biomesString.includes("DRAGON") && !(state & state_type_1.StateType.IN_WINTER))
                state += state_type_1.StateType.IN_WINTER;
            if (biomesString.includes("LAVA") && !(state & state_type_1.StateType.IN_LAVA_BIOME))
                state += state_type_1.StateType.IN_LAVA_BIOME;
            if (biomesString.includes("FOREST") && !(state & state_type_1.StateType.IN_FOREST))
                state += state_type_1.StateType.IN_FOREST;
            if (biomesString.includes("DRAGON") && !(state & state_type_1.StateType.IN_CAVE))
                state += state_type_1.StateType.IN_CAVE;
            if (biomesString.includes("SEA") && !(state & state_type_1.StateType.IN_ISLAND) && !(state & state_type_1.StateType.IN_WATER))
                state += state_type_1.StateType.IN_WATER;
        }
        else {
            if (!(state & state_type_1.StateType.IN_WATER) && !(state & state_type_1.StateType.IN_ISLAND))
                state += state_type_1.StateType.IN_WATER;
        }
        if (entity instanceof player_1.default && !entity.flight) {
            const entities = entity.server.world.getEntities(entity.realPosition.x, entity.realPosition.y, 3);
            const tiles = entity.server.world.getTiles(entity.realPosition.x, entity.realPosition.y, 3);
            const nearest = [];
            for (const unit of entities) {
                const dist = entity.realPosition.distance(unit.realPosition);
                if (nearest[unit.type] === undefined || dist < nearest[unit.type][0]) {
                    nearest[unit.type] = [dist, unit];
                }
                if (unit instanceof building_1.default) {
                    if (unit.type === entity_type_1.EntityType.WORKBENCH && dist < 180 && (state & state_type_1.StateType.WORKBENCH) !== state_type_1.StateType.WORKBENCH) {
                        state += state_type_1.StateType.WORKBENCH;
                    }
                    else if (dist < 180 && (unit.type === entity_type_1.EntityType.FIRE || unit.type === entity_type_1.EntityType.BIG_FIRE || (unit.type === entity_type_1.EntityType.FURNACE && unit.info)) && (state & state_type_1.StateType.FIRE) !== state_type_1.StateType.FIRE) {
                        state += state_type_1.StateType.FIRE;
                        if (dist < 50 && (state & state_type_1.StateType.RESURRECTION) !== state_type_1.StateType.IN_FIRE)
                            state += state_type_1.StateType.IN_FIRE;
                    }
                    else if (unit.type === entity_type_1.EntityType.WELL && dist < 180 && !(state & state_type_1.StateType.WELL)) {
                        state += state_type_1.StateType.WELL;
                    }
                    else if (unit.type === entity_type_1.EntityType.RESURRECTION && dist < 100 && (state & state_type_1.StateType.RESURRECTION) !== state_type_1.StateType.RESURRECTION) {
                        state += state_type_1.StateType.RESURRECTION;
                    }
                }
            }
            for (const tile of tiles) {
                const dist = entity.realPosition.distance(tile.realPosition);
                if (tile.type === tile_type_1.TileType.LAVA && dist < tile.radius && (state & state_type_1.StateType.IN_LAVA) !== state_type_1.StateType.IN_LAVA) {
                    state += state_type_1.StateType.IN_LAVA;
                }
            }
            if ((state & state_type_1.StateType.IN_FIRE) !== (entity.state & state_type_1.StateType.IN_FIRE)) {
                entity.gauges.lastUpdateFire = Date.now();
            }
            if ((state & state_type_1.StateType.WORKBENCH) !== (entity.state & state_type_1.StateType.WORKBENCH)) {
                entity.client.sendU8([packets_1.ClientPackets.WORKBENCH, Number((state & state_type_1.StateType.WORKBENCH) === state_type_1.StateType.WORKBENCH)]);
            }
            if ((state & state_type_1.StateType.FIRE) !== (entity.state & state_type_1.StateType.FIRE) || (state & state_type_1.StateType.IN_LAVA) !== (entity.state & state_type_1.StateType.IN_LAVA)) {
                entity.client.sendU8([packets_1.ClientPackets.FIRE, Number((state & state_type_1.StateType.FIRE) === state_type_1.StateType.FIRE || (state & state_type_1.StateType.IN_LAVA) === state_type_1.StateType.IN_LAVA)]);
            }
            if ((state & state_type_1.StateType.IN_WATER) !== (entity.state & state_type_1.StateType.IN_WATER)) {
                entity.client.sendU8([packets_1.ClientPackets.WATER, Number(state & state_type_1.StateType.IN_WATER)]);
            }
            if ((state & state_type_1.StateType.WELL) !== (entity.state & state_type_1.StateType.WELL)) {
                entity.client.sendU8([packets_1.ClientPackets.WELL, Number(state & state_type_1.StateType.WELL)]);
            }
            entity.nearestBuildings = nearest.map((value) => value[1]);
        }
        for (const type of Object.values(state_type_1.StateType)) {
            if (typeof type !== "number" || [
                state_type_1.StateType.GOD_MODE, state_type_1.StateType.ATTACK, state_type_1.StateType.INVISIBLE, state_type_1.StateType.IS_COLLIDE, state_type_1.StateType.CRAFT, state_type_1.StateType.GHOST
            ].includes(type))
                continue;
            if (!(entity.state & type) && (state & type)) {
                entity.state += type;
            }
            else if ((entity.state & type) && !(state & type)) {
                entity.state -= type;
            }
        }
    }
}
exports.default = Physics;
