import {Vector} from "../modules/vector";
import {Biome} from "./biome";
import {Tile} from "./tile";
import {Entity} from "../entities/entity";
import {objects, Server} from "../server";
import {TileType} from "../enums/types/tile.type";
import {EntityType} from "../enums/types/entity.type";
import {BiomeType} from "../enums/types/biome.type";
import {BeachDirection} from "../enums/beach.direction";
import {defaultMap} from "../default/default.map";
import Player from "../entities/player";
import {GameMode} from "../enums/game.mode";
import {generateMap} from "./generator";
import TeamSystem from "../team/team.system";
import Building from "../building/building";
import {ComponentType} from "../enums/types/component.type";

interface Chunk {
    entities: Entity[];
    tiles: Tile[];
}

export class World {
    private readonly objects: any[] = [];
    private readonly server: Server;

    public width: number;
    public height: number;

    public tiles: Tile[] = [];
    public grid: Chunk[][] = [];
    public biomes: Biome[] = [];
    constructor(server: Server) {
        this.server = server;
        this.width = server.config.important.map_width * 100;
        this.height = server.config.important.map_height * 100;
        this.objects = server.config.important.custom_map.length ? server.config.important.custom_map : server.mode === GameMode.forest ? generateMap(this, 58085) : defaultMap;
        this.initBiomes();
    }

    public initBiomes() {
        const map = [];
        
        for (var i = 0; i < ~~(this.height / 100); i++) {
            map[i] = new Array(~~(this.width / 100));
            for (var j = 0; j < ~~(this.width / 100); j++) map[i][j] = 0;
        }
        
        for (const tile of this.objects) {
            const [type, x, y, sx, sy, meta] = tile.slice(1, 7);
            if (!this.isTileTypeBiome(type)) continue;

            let x1 = x * 100 + 30;
            let y1 = y * 100 + 250;
            let x2 = sx * 100 + 80;
            let y2 = sy * 100 - 200;

            if(x === 0) x1 = 0;
            if(y === 0) y1 = 0;

            this.biomes.push(new Biome(type, new Vector(x1, y1), new Vector(x2, y2), meta));
        }

        for (const biome of this.biomes) {
            const endPos = biome.endPosition.divide(100).floor();
            const pos = biome.position.divide(100).floor();
            for (let x = pos.x; x < endPos.x; x++) {
                for (let y = pos.y; y < endPos.y; y++) {
                    map[y][x] = 1;
                }
            }
        }

        for (let y = 0; y < ~~(this.height / 100); y++) {
            for (let x = 0; x < ~~(this.width / 100); x++) {
                if(map[y][x] === 0) {
                    this.addSeaBiome(map, x, y);
                }
            }
        }
    }

    public distanceFromSand(biome: Biome, x: number, y: number) {
        let is_sand = 0;

        let x1 = biome.position.x + 30 + ((biome.meta & BeachDirection.LEFT) === 0 ? 150 : 0);
        let d = x - x1;
        if ((biome.meta & BeachDirection.LEFT) > 0 && d > 0 && d < 320) is_sand = 1;
        let y1 = biome.position.y + 250 + ((biome.meta & BeachDirection.TOP) === 0 ? 150 : 0);
        d = y - y1;
        if ((biome.meta & BeachDirection.TOP) > 0 && d > 0 && d < 320) is_sand = 1;
        let x2 = biome.endPosition.x + 80 + ((biome.meta & BeachDirection.RIGHT) === 0 ? -200 : 0);
        d = x2 - x;
        if ((biome.meta & BeachDirection.RIGHT) > 0 && d > 0 && d < 320) is_sand = 1;
        let y2 = biome.endPosition.y - 200 + ((biome.meta & BeachDirection.BOTTOM) === 0 ? -200 : 0);
        d = y2 - y;
        if ((biome.meta & BeachDirection.BOTTOM) > 0 && d > 0 && d < 320) is_sand = 1;

        if (x >= x1 && x <= x2 && y >= y1 && y <= y2) return is_sand;

        return 0;
    }
    
    public addSeaBiome(map: any, sx: number, sy: number) {
        var xMax = sx;  
        for (var y = sy; y < ~~(this.height / 100); y++) {
            for (var x = sx; x < ~~(this.width / 100); x++) {
                if (y === sy) xMax = Math.max(x, xMax);

                if (x > xMax) break;

                // Add a new sea biome
                if (map[y][x] === 1) break;


                map[y][x] = 1;
            }

            if (x < xMax) break;
        }

        this.biomes.push(new Biome(BiomeType.SEA, new Vector(sx * 100, sy * 100), new Vector((xMax - sx + 1) * 100, (y - sy) * 100)));
    }

    /**
     * Initialize chunks to map
     */
    public initCollision() {
        const width = Math.ceil(this.width / 100);
        const height = Math.ceil(this.height / 100);
        for (let y = 0; y < height; y++) {
            this.grid[y] = [];
            for (let x = 0; x < width; x++) {
                this.grid[y][x] = {
                    tiles: [],
                    entities: []
                };
            }
        }

        for (const tile of this.objects) {
            if(tile[1] !== "isl") continue;
            let [subtype, x, y] = tile.slice(2);

            for (let k = 0; k < 4; k++) {
                for (let l = 0; l < 3; l++) {
                    this.objects.push([0, TileType.SAND, 0, x - k, y - l, 0]);
                    this.objects.push([0, TileType.SAND, 0, x - k, y + l, 0]);
                    this.objects.push([0, TileType.SAND, 0, x + k, y + l, 0]);
                    this.objects.push([0, TileType.SAND, 0, x + k, y - l, 0]);
                }
            }

            if(subtype === 0) {
                for (let k = 0; k < 2; k++) {
                    this.objects.push([0, TileType.SAND, 0, x - 4, y - k,  0]);
                    this.objects.push([0, TileType.SAND, 0, x - 4, y + k, 0]);
                    this.objects.push([0, TileType.SAND, 0, x + 4, y - k, 0]);
                    this.objects.push([0, TileType.SAND, 0, x + 4, y + k, 0]);
                }

                for (let k = 0; k < 3; k++) {
                    this.objects.push([0, TileType.SAND, 0, x + k, y - 3, 0]);
                    this.objects.push([0, TileType.SAND, 0, x + k, y + 3, 0]);
                    this.objects.push([0, TileType.SAND, 0, x - k, y - 3, 0]);
                    this.objects.push([0, TileType.SAND, 0, x - k, y + 3, 0]);
                }

                this.objects.push([0, TileType.SAND, 0, x - 2, y - 4, 0]);
                this.objects.push([0, TileType.SAND, 0, x - 3, y - 3, 0]);
                this.objects.push([0, TileType.SAND, 0, x + 2, y + 4, 0]);
                this.objects.push([0, TileType.SAND, 0, x + 3, y + 3, 0]);
            }
            else if (subtype === 1) {
                for (let k = 0; k < 3; k++) {
                    this.objects.push([0, TileType.SAND, 0, x - 4, y - k, 0]);
                    this.objects.push([0, TileType.SAND, 0, x - 4, y + k, 0]);
                    this.objects.push([0, TileType.SAND, 0, x + 4, y - k, 0]);
                    this.objects.push([0, TileType.SAND, 0, x + 4, y + k, 0]);
                }
                for (let k = 0; k < 4; k++) {
                    this.objects.push([0, TileType.SAND, 0, x + k, y - 3, 0]);
                    this.objects.push([0, TileType.SAND, 0, x + k, y + 3, 0]);
                    this.objects.push([0, TileType.SAND, 0, x - k, y - 3, 0]);
                    this.objects.push([0, TileType.SAND, 0, x - k, y + 3, 0]);
                }
            }
            else if (subtype === 2) {
                for (let k = 0; k < 3; k++) {
                    this.objects.push([0, TileType.SAND, 0, x - 4, y - k, 0]);
                    this.objects.push([0, TileType.SAND, 0, x - 4, y + k, 0]);
                    this.objects.push([0, TileType.SAND, 0, x + 4, y - k, 0]);
                    this.objects.push([0, TileType.SAND, 0, x + 4, y + k, 0]);
                }
                for (let k = 0; k < 3; k++) {
                    this.objects.push([0, TileType.SAND, 0, x + k, y - 3, 0]);
                    this.objects.push([0, TileType.SAND, 0, x + k, y + 3, 0]);
                    this.objects.push([0, TileType.SAND, 0, x - k, y - 3, 0]);
                    this.objects.push([0, TileType.SAND, 0, x - k, y + 3, 0]);
                }
            }

        }

        for (let tile of this.objects) {
            const type = tile[1];
            let subtype = 0;
            let x;
            let y;
            let meta = 0;

            if(tile.length <= 5) {
                x = tile[2];
                y = tile[3];
                meta = tile[4];
            } else {
                subtype = tile[2];
                x = tile[3];
                y = tile[4];
                meta = tile[5];
            }

            if (this.isTileTypeBiome(type)) continue;

            const object = objects.find((object) => object.type == type && object.subtype == subtype);

            if (object && this.grid[y] && this.grid[y][x]) {
                const tile = new Tile(new Vector(x, y), meta, object);
                this.grid[y][x].tiles.push(tile);

                if (tile.type === TileType.BERRY) {
                    const fruit = new Entity(EntityType.FRUIT, this.server);
                    fruit.position.set(tile.realPosition);
                    fruit.realPosition.set(tile.realPosition);
                    fruit.id = this.server.entityPool.generate();
                    this.server.entities[fruit.id] = fruit;
                    tile.entity = fruit;
                }

                this.tiles.push(tile);
            }
        }

    }

    public getChunk(x: number, y: number): Chunk | undefined {
        const chunkX = Math.floor(Math.clamp(x, 0, this.width) / 100);
        const chunkY = Math.floor(Math.clamp(y, 0, this.height) / 100);

        if (!this.grid[chunkY]) return;

        return this.grid[chunkY][chunkX];
    }

    public getNearest(self: Entity, types: number[], distance = Infinity): Entity | null {
        const entities = this.getEntities(self.realPosition.x, self.realPosition.y, Math.round(distance / 100));
        let minDist = Infinity;
        let target = null;

        for (const entity of entities) {
            if(entity === undefined) continue;
            if(entity === self || !types.includes(entity.type)) continue;

            const dist = self.realPosition.distance(entity.realPosition);
            if(dist < distance && dist < minDist) {
                target = entity;
                minDist = dist;
            }
        }

        return target;
    }

    public getObjectWithDamage(self: Player, distance = 500) {
        const entities = this.getEntities(self.realPosition.x, self.realPosition.y, Math.round(distance / 100));
        let minDist = Infinity;
        let target = null;

        for (const entity of entities) {
            if(!(entity instanceof Building)) continue;

            const isSelf = self == (entity as any);
            const isOpen = entity.info % 2 && entity.hasComponent(ComponentType.DOOR);
            const hasDamage = entity.hasComponent(ComponentType.DAMAGE);
            const dist = self.realPosition.distance(entity.realPosition);
            if(!isSelf && !isOpen && hasDamage && TeamSystem.isEnemy(self, entity?.owner) && dist < distance && dist < minDist) {
                target = entity;
                minDist = dist;
            }
        }

        return target;
    }

    public getEntitiesInDistance(position: Vector, types: number[], distance = Infinity) {
        const dist = Math.min(50, Math.round(distance / 100));
        return (
            this.server.entities.length < dist ** 2 ?
            this.server.entities
                .filter(entity =>
                    entity && types.includes(entity.type) && entity.position.distance(position) < distance
                ): this.getEntities(position.x, position.y, dist)
                .filter(entity =>
                    entity && types.includes(entity.type) && entity.position.distance(position) < distance
                )
        );
    }


    public queryCircle(position: Vector, distance: number, types?: number[]) {
        const entities = this.getEntities(position.x, position.y, Math.ceil(distance / 100));
        const tiles = this.getTiles(position.x, position.y, Math.ceil(distance / 100));

        return [...tiles.filter(tile => tile.realPosition.distance(position) < distance + tile.radius),
                ...entities.filter(entity => entity !== undefined && entity.realPosition.distance(position) < distance + entity.radius)];
    }

    /**
     * Retrieves the chunks of data from a 2D grid based on the provided coordinates and size.
     *
     * @param {number} x - The X-coordinate to start retrieving chunks from.
     * @param {number} y - The Y-coordinate to start retrieving chunks from.
     * @param {number} size - The size of the area to retrieve chunks around the specified coordinates.
     * @returns {Chunk[]} An array containing the chunks of data retrieved from the grid.
     */
    public getChunks(x: number, y: number, size: number): Chunk[] {
        const chunkX = Math.floor(x / 100);
        const chunkY = Math.floor(y / 100);
        const chunks = [];

        for (let offsetY = -size; offsetY <= size; offsetY++) {
            const chunkRow = this.grid[chunkY + offsetY];

            for (let offsetX = -size; offsetX <= size; offsetX++) {
                const chunk = chunkRow && chunkRow[chunkX + offsetX];

                if (chunk) {
                    chunks.push(chunk);
                }
            }
        }
        return chunks;
    }

    public getTiles(x: number, y: number, size: number): Tile[] {
        const chunkX = Math.floor(x / 100);
        const chunkY = Math.floor(y / 100);
        const tiles = [];

        for (let offsetY = -size; offsetY <= size; offsetY++) {
            const chunkRow = this.grid[chunkY + offsetY];

            for (let offsetX = -size; offsetX <= size; offsetX++) {
                const chunk = chunkRow && chunkRow[chunkX + offsetX];
                if (chunk) {
                    tiles.push(...chunk.tiles);
                }
            }
        }

        return tiles;
    }

    public getEntities(x: number, y: number, size: number): Entity[] {
        const chunkX = Math.floor(x / 100);
        const chunkY = Math.floor(y / 100);
        const entities = [];

        for (let offsetY = -size; offsetY <= size; offsetY++) {
            const chunkRow = this.grid[chunkY + offsetY];

            for (let offsetX = -size; offsetX <= size; offsetX++) {
                const chunk = chunkRow && chunkRow[chunkX + offsetX];
                if (chunk) {
                    entities.push(...chunk.entities);
                }
            }
        }

        return entities;
    }


    public getDistFromBiome(biome: Biome, x: number, y: number) {
        let x1 = biome.position.x + 30;
        let y1 = biome.position.y + 250;
        let x2 = biome.position.x + biome.size.x + 80;
        let y2 = biome.position.y + biome.size.y - 200;

        if (x >= x1 && x <= x2 && y >= y1 && y <= y2) return Math.min(x - x1, x2 - x, y - y1, y2 - y);

        let dist = -1000000;
        if (x - x1 < 0) dist = Math.max(dist, x - x1);
        else if (x2 - x < 0) dist = Math.max(dist, x2 - x);

        let distY = -1000000;
        if (y < y1 || y > y2) {
            if (y - y1 < 0) distY = Math.max(distY, y - y1);
            else distY = Math.max(distY, y2 - y);

            if (dist !== -1000000 && distY !== -1000000) dist = Math.min(dist, distY);
            else dist = distY;
        }

        return dist;
    }

    /**
     * Returns the biomes at the entity's current position.
     *
     * @param {Vector} position - The position for which to retrieve biomes.
     * @returns {Biome[]} An array containing the biomes at the entity's current position.
     */
    public getBiomesAtEntityPosition(position: Vector): Biome[] {
        const biomes = [];
        for (const biome of this.biomes) {
            if (biome.position.isVectorInsideRectangle(position.subtract(new Vector(biome.size.x / 2, biome.size.y / 2)), biome.size.x + 25, biome.size.y + 25)) {

                biomes.push(biome);
            }
        }

        return biomes;
    }

    private isTileTypeBiome(type: string): boolean {
        const biomeTypes = ["FOREST", "DRAGON", "DESERT", "LAVA", "WINTER"];
        return biomeTypes.includes(type);
    }
}
