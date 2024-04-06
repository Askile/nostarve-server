"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.World = void 0;
const vector_1 = require("../modules/vector");
const biome_1 = require("./biome");
const tile_1 = require("./tile");
const entity_1 = require("../entities/entity");
const server_1 = require("../server");
const tile_type_1 = require("../enums/types/tile.type");
const entity_type_1 = require("../enums/types/entity.type");
const biome_type_1 = require("../enums/types/biome.type");
const beach_direction_1 = require("../enums/beach.direction");
const default_map_1 = require("../default/default.map");
const game_mode_1 = require("../enums/game.mode");
const generator_1 = require("./generator");
const team_system_1 = __importDefault(require("../team/team.system"));
const building_1 = __importDefault(require("../building/building"));
class World {
    objects = [];
    server;
    width;
    height;
    tiles = [];
    grid = [];
    biomes = [];
    constructor(server) {
        this.server = server;
        this.width = server.config.important.map_width * 100;
        this.height = server.config.important.map_height * 100;
        this.objects = server.config.important.custom_map.length ? server.config.important.custom_map : server.mode === game_mode_1.GameMode.forest ? (0, generator_1.generateMap)(this, 58085) : default_map_1.defaultMap;
        this.initBiomes();
    }
    initBiomes() {
        const map = [];
        for (var i = 0; i < ~~(this.height / 100); i++) {
            map[i] = new Array(~~(this.width / 100));
            for (var j = 0; j < ~~(this.width / 100); j++)
                map[i][j] = 0;
        }
        for (const tile of this.objects) {
            const [type, x, y, sx, sy, meta] = tile.slice(1, 7);
            if (!this.isTileTypeBiome(type))
                continue;
            let x1 = x * 100 + 30;
            let y1 = y * 100 + 250;
            let x2 = sx * 100 + 80;
            let y2 = sy * 100 - 200;
            if (x === 0)
                x1 = 0;
            if (y === 0)
                y1 = 0;
            this.biomes.push(new biome_1.Biome(type, new vector_1.Vector(x1, y1), new vector_1.Vector(x2, y2), meta));
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
                if (map[y][x] === 0) {
                    this.addSeaBiome(map, x, y);
                }
            }
        }
    }
    distanceFromSand(biome, x, y) {
        let is_sand = 0;
        let x1 = biome.position.x + 30 + ((biome.meta & beach_direction_1.BeachDirection.LEFT) === 0 ? 150 : 0);
        let d = x - x1;
        if ((biome.meta & beach_direction_1.BeachDirection.LEFT) > 0 && d > 0 && d < 320)
            is_sand = 1;
        let y1 = biome.position.y + 250 + ((biome.meta & beach_direction_1.BeachDirection.TOP) === 0 ? 150 : 0);
        d = y - y1;
        if ((biome.meta & beach_direction_1.BeachDirection.TOP) > 0 && d > 0 && d < 320)
            is_sand = 1;
        let x2 = biome.endPosition.x + 80 + ((biome.meta & beach_direction_1.BeachDirection.RIGHT) === 0 ? -200 : 0);
        d = x2 - x;
        if ((biome.meta & beach_direction_1.BeachDirection.RIGHT) > 0 && d > 0 && d < 320)
            is_sand = 1;
        let y2 = biome.endPosition.y - 200 + ((biome.meta & beach_direction_1.BeachDirection.BOTTOM) === 0 ? -200 : 0);
        d = y2 - y;
        if ((biome.meta & beach_direction_1.BeachDirection.BOTTOM) > 0 && d > 0 && d < 320)
            is_sand = 1;
        if (x >= x1 && x <= x2 && y >= y1 && y <= y2)
            return is_sand;
        return 0;
    }
    addSeaBiome(map, sx, sy) {
        var xMax = sx;
        for (var y = sy; y < ~~(this.height / 100); y++) {
            for (var x = sx; x < ~~(this.width / 100); x++) {
                if (y === sy)
                    xMax = Math.max(x, xMax);
                if (x > xMax)
                    break;
                // Add a new sea biome
                if (map[y][x] === 1)
                    break;
                map[y][x] = 1;
            }
            if (x < xMax)
                break;
        }
        this.biomes.push(new biome_1.Biome(biome_type_1.BiomeType.SEA, new vector_1.Vector(sx * 100, sy * 100), new vector_1.Vector((xMax - sx + 1) * 100, (y - sy) * 100)));
    }
    /**
     * Initialize chunks to map
     */
    initCollision() {
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
            if (tile[1] !== "isl")
                continue;
            let [subtype, x, y] = tile.slice(2);
            for (let k = 0; k < 4; k++) {
                for (let l = 0; l < 3; l++) {
                    this.objects.push([0, tile_type_1.TileType.SAND, 0, x - k, y - l, 0]);
                    this.objects.push([0, tile_type_1.TileType.SAND, 0, x - k, y + l, 0]);
                    this.objects.push([0, tile_type_1.TileType.SAND, 0, x + k, y + l, 0]);
                    this.objects.push([0, tile_type_1.TileType.SAND, 0, x + k, y - l, 0]);
                }
            }
            if (subtype === 0) {
                for (let k = 0; k < 2; k++) {
                    this.objects.push([0, tile_type_1.TileType.SAND, 0, x - 4, y - k, 0]);
                    this.objects.push([0, tile_type_1.TileType.SAND, 0, x - 4, y + k, 0]);
                    this.objects.push([0, tile_type_1.TileType.SAND, 0, x + 4, y - k, 0]);
                    this.objects.push([0, tile_type_1.TileType.SAND, 0, x + 4, y + k, 0]);
                }
                for (let k = 0; k < 3; k++) {
                    this.objects.push([0, tile_type_1.TileType.SAND, 0, x + k, y - 3, 0]);
                    this.objects.push([0, tile_type_1.TileType.SAND, 0, x + k, y + 3, 0]);
                    this.objects.push([0, tile_type_1.TileType.SAND, 0, x - k, y - 3, 0]);
                    this.objects.push([0, tile_type_1.TileType.SAND, 0, x - k, y + 3, 0]);
                }
                this.objects.push([0, tile_type_1.TileType.SAND, 0, x - 2, y - 4, 0]);
                this.objects.push([0, tile_type_1.TileType.SAND, 0, x - 3, y - 3, 0]);
                this.objects.push([0, tile_type_1.TileType.SAND, 0, x + 2, y + 4, 0]);
                this.objects.push([0, tile_type_1.TileType.SAND, 0, x + 3, y + 3, 0]);
            }
            else if (subtype === 1) {
                for (let k = 0; k < 3; k++) {
                    this.objects.push([0, tile_type_1.TileType.SAND, 0, x - 4, y - k, 0]);
                    this.objects.push([0, tile_type_1.TileType.SAND, 0, x - 4, y + k, 0]);
                    this.objects.push([0, tile_type_1.TileType.SAND, 0, x + 4, y - k, 0]);
                    this.objects.push([0, tile_type_1.TileType.SAND, 0, x + 4, y + k, 0]);
                }
                for (let k = 0; k < 4; k++) {
                    this.objects.push([0, tile_type_1.TileType.SAND, 0, x + k, y - 3, 0]);
                    this.objects.push([0, tile_type_1.TileType.SAND, 0, x + k, y + 3, 0]);
                    this.objects.push([0, tile_type_1.TileType.SAND, 0, x - k, y - 3, 0]);
                    this.objects.push([0, tile_type_1.TileType.SAND, 0, x - k, y + 3, 0]);
                }
            }
            else if (subtype === 2) {
                for (let k = 0; k < 3; k++) {
                    this.objects.push([0, tile_type_1.TileType.SAND, 0, x - 4, y - k, 0]);
                    this.objects.push([0, tile_type_1.TileType.SAND, 0, x - 4, y + k, 0]);
                    this.objects.push([0, tile_type_1.TileType.SAND, 0, x + 4, y - k, 0]);
                    this.objects.push([0, tile_type_1.TileType.SAND, 0, x + 4, y + k, 0]);
                }
                for (let k = 0; k < 3; k++) {
                    this.objects.push([0, tile_type_1.TileType.SAND, 0, x + k, y - 3, 0]);
                    this.objects.push([0, tile_type_1.TileType.SAND, 0, x + k, y + 3, 0]);
                    this.objects.push([0, tile_type_1.TileType.SAND, 0, x - k, y - 3, 0]);
                    this.objects.push([0, tile_type_1.TileType.SAND, 0, x - k, y + 3, 0]);
                }
            }
        }
        for (let tile of this.objects) {
            const type = tile[1];
            let subtype = 0;
            let x;
            let y;
            let meta = 0;
            if (tile.length <= 5) {
                x = tile[2];
                y = tile[3];
                meta = tile[4];
            }
            else {
                subtype = tile[2];
                x = tile[3];
                y = tile[4];
                meta = tile[5];
            }
            if (this.isTileTypeBiome(type))
                continue;
            const object = server_1.objects.find((object) => object.type == type && object.subtype == subtype);
            if (object && this.grid[y] && this.grid[y][x]) {
                const tile = new tile_1.Tile(new vector_1.Vector(x, y), meta, object);
                this.grid[y][x].tiles.push(tile);
                if (tile.type === tile_type_1.TileType.BERRY) {
                    const fruit = new entity_1.Entity(entity_type_1.EntityType.FRUIT, this.server);
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
    getChunk(x, y) {
        const chunkX = Math.floor(Math.clamp(x, 0, this.width) / 100);
        const chunkY = Math.floor(Math.clamp(y, 0, this.height) / 100);
        if (!this.grid[chunkY])
            return;
        return this.grid[chunkY][chunkX];
    }
    getNearest(self, types, distance = Infinity) {
        const entities = this.getEntities(self.realPosition.x, self.realPosition.y, Math.round(distance / 100));
        let minDist = Infinity;
        let target = null;
        for (const entity of entities) {
            if (entity === undefined)
                continue;
            if (entity === self || !types.includes(entity.type))
                continue;
            const dist = self.realPosition.distance(entity.realPosition);
            if (dist < distance && dist < minDist) {
                target = entity;
                minDist = dist;
            }
        }
        return target;
    }
    getObjectWithDamage(self, distance = 500) {
        const entities = this.getEntities(self.realPosition.x, self.realPosition.y, Math.round(distance / 100));
        let minDist = Infinity;
        let target = null;
        for (const entity of entities) {
            if (!(entity instanceof building_1.default))
                continue;
            const isSelf = self == entity;
            const isOpen = entity.info % 2 && entity.hasComponent("DOOR" /* ComponentType.DOOR */);
            const hasDamage = entity.hasComponent("DAMAGE" /* ComponentType.DAMAGE */);
            const dist = self.realPosition.distance(entity.realPosition);
            if (!isSelf && !isOpen && hasDamage && team_system_1.default.isEnemy(self, entity?.owner) && dist < distance && dist < minDist) {
                target = entity;
                minDist = dist;
            }
        }
        return target;
    }
    getEntitiesInDistance(position, types, distance = Infinity) {
        const dist = Math.min(50, Math.round(distance / 100));
        return (this.server.entities.length < dist ** 2 ?
            this.server.entities
                .filter(entity => entity && types.includes(entity.type) && entity.position.distance(position) < distance) : this.getEntities(position.x, position.y, dist)
            .filter(entity => entity && types.includes(entity.type) && entity.position.distance(position) < distance));
    }
    queryCircle(position, distance, types) {
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
    getChunks(x, y, size) {
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
    getTiles(x, y, size) {
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
    getEntities(x, y, size) {
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
    getDistFromBiome(biome, x, y) {
        let x1 = biome.position.x + 30;
        let y1 = biome.position.y + 250;
        let x2 = biome.position.x + biome.size.x + 80;
        let y2 = biome.position.y + biome.size.y - 200;
        if (x >= x1 && x <= x2 && y >= y1 && y <= y2)
            return Math.min(x - x1, x2 - x, y - y1, y2 - y);
        let dist = -1000000;
        if (x - x1 < 0)
            dist = Math.max(dist, x - x1);
        else if (x2 - x < 0)
            dist = Math.max(dist, x2 - x);
        let distY = -1000000;
        if (y < y1 || y > y2) {
            if (y - y1 < 0)
                distY = Math.max(distY, y - y1);
            else
                distY = Math.max(distY, y2 - y);
            if (dist !== -1000000 && distY !== -1000000)
                dist = Math.min(dist, distY);
            else
                dist = distY;
        }
        return dist;
    }
    /**
     * Returns the biomes at the entity's current position.
     *
     * @param {Vector} position - The position for which to retrieve biomes.
     * @returns {Biome[]} An array containing the biomes at the entity's current position.
     */
    getBiomesAtEntityPosition(position) {
        const biomes = [];
        for (const biome of this.biomes) {
            if (biome.position.isVectorInsideRectangle(position.subtract(new vector_1.Vector(biome.size.x / 2, biome.size.y / 2)), biome.size.x + 25, biome.size.y + 25)) {
                biomes.push(biome);
            }
        }
        return biomes;
    }
    isTileTypeBiome(type) {
        const biomeTypes = ["FOREST", "DRAGON", "DESERT", "LAVA", "WINTER"];
        return biomeTypes.includes(type);
    }
}
exports.World = World;
