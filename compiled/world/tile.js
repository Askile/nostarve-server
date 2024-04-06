"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tile = void 0;
const vector_1 = require("../modules/vector");
const tile_type_1 = require("../enums/types/tile.type");
const item_type_1 = require("../enums/types/item.type");
class Tile {
    type;
    collide = true;
    entity;
    angle;
    subtype;
    radius;
    limit;
    hard = 0;
    meta;
    id;
    resource;
    position;
    realPosition;
    count;
    constructor(position, meta, data) {
        this.angle = 0;
        this.type = data.type;
        this.id = data.id ?? 0;
        this.radius = data.radius;
        this.resource = data.resource ?? "NONE";
        this.meta = meta ?? 0;
        this.limit = data.limit ?? 0;
        this.count = data.limit ?? 0;
        this.subtype = data.subtype ?? 0;
        this.position = position;
        this.realPosition = position.multiply(100).add(new vector_1.Vector(50, 50));
        if (!this.radius || this.type === tile_type_1.TileType.LAVA) {
            this.collide = false;
        }
        //if (this.type == TileType.RIVER && this.meta == 1) console.log(this.type, this.meta);
        switch (this.resource) {
            case "WOOD":
                this.hard = 1;
                break;
            case "STONE":
                this.hard = 2;
                break;
            case "GOLD":
                this.hard = 3;
                break;
            case "DIAMOND":
                this.hard = 4;
                break;
            case "AMETHYST":
                this.hard = 5;
                break;
            case "REIDITE":
            case "EMERALD":
                this.hard = 6;
                break;
            case "BERRY":
            case "CACTUS":
                this.hard = -1;
                break;
        }
    }
    dig(player, harvest) {
        if (this.resource === "NONE")
            return;
        if (harvest) {
            player.inventory.increase(item_type_1.ItemType[this.resource], Math.min(harvest, this.count), true);
            player.score += harvest * (this.hard === -1 ? 2 : this.hard);
        }
        this.count = Math.clamp(this.count - Math.min(harvest, this.count), 0, this.limit);
        if (this.entity)
            this.entity.info = this.count;
    }
    shake() {
        return [this.position.x, this.position.y, this.angle, this.id];
    }
}
exports.Tile = Tile;
