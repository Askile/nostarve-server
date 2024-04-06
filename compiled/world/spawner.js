"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spawner = void 0;
const vector_1 = require("../modules/vector");
const tile_type_1 = require("../enums/types/tile.type");
const entity_type_1 = require("../enums/types/entity.type");
class Spawner {
    server;
    spawnPoint;
    constructor(server) {
        this.server = server;
        this.spawnPoint = 0;
    }
    getSpawnPoint(biomeType, type) {
        if (this.spawnPoint !== 0 && type !== entity_type_1.EntityType.WHEAT_MOB) {
            return this.spawnPoint;
        }
        let attempt = 100;
        const biomes = this.server.world.biomes.filter(biome => biome.type === biomeType);
        const biome = biomes[Math.floor(Math.random() * biomes.length)];
        while (attempt-- > 0) {
            const x = Math.randomClamp(biome.position.x, biome.endPosition.x);
            const y = Math.randomClamp(biome.position.y, biome.endPosition.y);
            const chunks = this.server.world.getChunks(x, y, 1);
            let canSpawn = true;
            for (const chunk of chunks) {
                if (chunk.entities.filter(e => e !== undefined && e.hasComponent("OBSTACLE" /* ComponentType.OBSTACLE */)).length !== 0)
                    canSpawn = false;
                if (chunk.tiles.filter(t => t.collide || t.type === tile_type_1.TileType.RIVER).length !== 0)
                    canSpawn = false;
            }
            if (canSpawn) {
                return new vector_1.Vector(x, y);
            }
        }
        return vector_1.Vector.zero();
    }
}
exports.Spawner = Spawner;
