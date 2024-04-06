import {Entity} from "./entity";
import {Server} from "../server";
import Player from "./player";
import {EntityType} from "../enums/types/entity.type";
import {ItemType} from "../enums/types/item.type";
import {BOX} from "../enums/cosmetics";
import Inventory from "../items/inventory";

export class Crate extends Entity {
    public inventory: Inventory;
    public boxType: string;
    public owner: Entity;
    constructor(server: Server, data: any) {
        super(EntityType.CRATE, server);

        this.pid = data.owner ? data.owner.id : 0;
        this.owner = data.owner ?? null;

        this.inventory = new Inventory(this, 16);
        this.boxType = data.type ?? "drop";

        if(data.item && data.count)
            this.inventory.increase(data.item, data.count);

        if(data.restore === undefined ) {
            if(this.owner instanceof Player) {
                this.position.set(data.owner.realPosition);
                this.realPosition.set(this.position);
                this.angle = data.owner.angle;
            }

            switch (data.type) {
                case "drop": {
                    if(this.owner instanceof Player) this.info = this.owner.cosmetics.crate;
                } break;
                case "dead": {
                    if(this.owner instanceof Player) {
                        this.info = this.owner.cosmetics.dead;
                        if("inventory" in this.owner) {
                            this.health = 300;
                            this.inventory.concate(this.owner.inventory as Inventory, server.config.dead_box_drop_limit);
                        }
                    }
                } break;
                case "gift": {
                    this.info = BOX.GIFT_BOX;
                    this.health = 600;
                    const random = Math.random();
                    if(random > .998) this.inventory.increase(ItemType.SUPER_DIVING_SUIT, 1);
                    else if(random > .994) this.inventory.increase(ItemType.DRAGON_SWORD, 1);
                    else if(random > .992) this.inventory.increase(ItemType.DRAGON_SPEAR, 1);
                    else if(random > .984) this.inventory.increase(ItemType.SUPER_HAMMER, 1);
                    else if(random > .964) this.inventory.increase(ItemType.REIDITE_DOOR_SPIKE, 1);
                    else if(random > .934) this.inventory.increase(ItemType.REIDITE_SPIKE, 1);
                    else if(random > .894) this.inventory.increase(ItemType.AMETHYST_DOOR_SPIKE, 1);
                    else if(random > .834) this.inventory.increase(ItemType.AMETHYST_SPIKE, 1);
                    else if(random > .784) this.inventory.increase(ItemType.DIAMOND_DOOR_SPIKE, 1);
                    else if(random > .714) this.inventory.increase(ItemType.DIAMOND_SPIKE, 1);
                    if(random > .9) this.inventory.increase(ItemType.DIAMOND_CORD, 1 + Math.floor(Math.random() * 2));
                    this.inventory.increase(ItemType.BOTTLE_EMPTY, 40 + Math.floor(Math.random() * 40));
                } break;
            }
        }
        this.serialize()

        this.radius = 25;
    }

    public serialize() {
        return [
            this.id, this.position.x, this.position.y, this.angle, this.info, this.action, this.speed,
            this.extra,this.inventory.serialize(), this.health, this.radius,
            this.createdAt, Number(this.boxType)
        ];
    }

    public onTick() {
        const now = Date.now();

        if(now - this.createdAt >= ((this.boxType === "dead" || this.boxType === "gift") ? 480e3 : 16000)) {
            this.delete();
        }
    }

    public onDead(damager: Entity) {
        if(damager instanceof Player) {
            if(this.owner instanceof Player && damager.id !== this.owner.id) {
                damager.ruinQuests();
            }

            if(this.inventory.size !== 0) {
                damager.inventory.concate(this.inventory, Infinity, true);
                this.inventory.size = 0;
            }
        }
    }
}