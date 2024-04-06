import {Server} from "../server";
import {BiomeType} from "../enums/types/biome.type";
import {Vector} from "../modules/vector";
import {TileType} from "../enums/types/tile.type";
import {ComponentType} from "../enums/types/component.type";
import {EntityType} from "../enums/types/entity.type";

export class Spawner {
    public server: Server;
    public spawnPoint: Vector | number;
    constructor(server: Server) {
        this.server = server;
        this.spawnPoint = 0;
    }

    public getSpawnPoint(biomeType: BiomeType, type: number) {
        if(this.spawnPoint !== 0 && type !== EntityType.WHEAT_MOB) {
            return this.spawnPoint as Vector;
        }

        let attempt = 100;
        const biomes = this.server.world.biomes.filter(biome => biome.type === biomeType);
        const biome = biomes[Math.floor(Math.random() * biomes.length)];
        while (attempt-- > 0) {
            const x = Math.randomClamp(biome.position.x, biome.endPosition.x);
            const y = Math.randomClamp(biome.position.y, biome.endPosition.y);

            const chunks =  this.server.world.getChunks(x, y, 1);
            let canSpawn = true;

            for (const chunk of chunks) {
                if(chunk.entities.filter(e => e !== undefined && e.hasComponent(ComponentType.OBSTACLE)).length !== 0) canSpawn = false;
                if(chunk.tiles.filter(t => t.collide || t.type === TileType.RIVER).length !== 0) canSpawn = false;
            }

            if (canSpawn) {
                return new Vector(x, y);
            }
        }
        return Vector.zero();
    }
}