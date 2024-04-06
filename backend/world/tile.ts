import {Vector} from "../modules/vector";
import {Entity} from "../entities/entity";
import {TileType} from "../enums/types/tile.type";
import Player from "../entities/player";
import {ItemType} from "../enums/types/item.type";

export class Tile {
    public type: string;
    public collide: boolean = true;

    public entity!: Entity;

    public angle: number;
    public subtype: number;
    public radius: number;
    public limit: number;
    public hard: number = 0;
    public meta: number;
    public id: number;
    public resource: string;
    public position: Vector;
    public realPosition: Vector;
    public count: number;

    constructor(position: Vector, meta: number, data: any) {
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
        this.realPosition = position.multiply(100).add(new Vector(50, 50));

        if(!this.radius || this.type === TileType.LAVA) {
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

    public dig(player: Player, harvest: number) {
        if(this.resource === "NONE") return;
        if (harvest) {
            player.inventory.increase(ItemType[this.resource as any] as any, Math.min(harvest, this.count), true);
            player.score += harvest * (this.hard === -1 ? 2 : this.hard);
        }

        this.count = Math.clamp(this.count - Math.min(harvest, this.count), 0, this.limit);
        if(this.entity) this.entity.info = this.count;

    }

    public shake(): number[] {
        return [this.position.x, this.position.y, this.angle, this.id];
    }

}
