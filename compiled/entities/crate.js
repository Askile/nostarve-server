"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crate = void 0;
const entity_1 = require("./entity");
const player_1 = __importDefault(require("./player"));
const entity_type_1 = require("../enums/types/entity.type");
const item_type_1 = require("../enums/types/item.type");
const cosmetics_1 = require("../enums/cosmetics");
const inventory_1 = __importDefault(require("../items/inventory"));
class Crate extends entity_1.Entity {
    inventory;
    boxType;
    owner;
    constructor(server, data) {
        super(entity_type_1.EntityType.CRATE, server);
        this.pid = data.owner ? data.owner.id : 0;
        this.owner = data.owner ?? null;
        this.inventory = new inventory_1.default(this, 16);
        this.boxType = data.type ?? "drop";
        if (data.item && data.count)
            this.inventory.increase(data.item, data.count);
        if (data.restore === undefined) {
            if (this.owner instanceof player_1.default) {
                this.position.set(data.owner.realPosition);
                this.realPosition.set(this.position);
                this.angle = data.owner.angle;
            }
            switch (data.type) {
                case "drop":
                    {
                        if (this.owner instanceof player_1.default)
                            this.info = this.owner.cosmetics.crate;
                    }
                    break;
                case "dead":
                    {
                        if (this.owner instanceof player_1.default) {
                            this.info = this.owner.cosmetics.dead;
                            if ("inventory" in this.owner) {
                                this.health = 300;
                                this.inventory.concate(this.owner.inventory, server.config.dead_box_drop_limit);
                            }
                        }
                    }
                    break;
                case "gift":
                    {
                        this.info = cosmetics_1.BOX.GIFT_BOX;
                        this.health = 600;
                        const random = Math.random();
                        if (random > .998)
                            this.inventory.increase(item_type_1.ItemType.SUPER_DIVING_SUIT, 1);
                        else if (random > .994)
                            this.inventory.increase(item_type_1.ItemType.DRAGON_SWORD, 1);
                        else if (random > .992)
                            this.inventory.increase(item_type_1.ItemType.DRAGON_SPEAR, 1);
                        else if (random > .984)
                            this.inventory.increase(item_type_1.ItemType.SUPER_HAMMER, 1);
                        else if (random > .964)
                            this.inventory.increase(item_type_1.ItemType.REIDITE_DOOR_SPIKE, 1);
                        else if (random > .934)
                            this.inventory.increase(item_type_1.ItemType.REIDITE_SPIKE, 1);
                        else if (random > .894)
                            this.inventory.increase(item_type_1.ItemType.AMETHYST_DOOR_SPIKE, 1);
                        else if (random > .834)
                            this.inventory.increase(item_type_1.ItemType.AMETHYST_SPIKE, 1);
                        else if (random > .784)
                            this.inventory.increase(item_type_1.ItemType.DIAMOND_DOOR_SPIKE, 1);
                        else if (random > .714)
                            this.inventory.increase(item_type_1.ItemType.DIAMOND_SPIKE, 1);
                        if (random > .9)
                            this.inventory.increase(item_type_1.ItemType.DIAMOND_CORD, 1 + Math.floor(Math.random() * 2));
                        this.inventory.increase(item_type_1.ItemType.BOTTLE_EMPTY, 40 + Math.floor(Math.random() * 40));
                    }
                    break;
            }
        }
        this.serialize();
        this.radius = 25;
    }
    serialize() {
        return [
            this.id, this.position.x, this.position.y, this.angle, this.info, this.action, this.speed,
            this.extra, this.inventory.serialize(), this.health, this.radius,
            this.createdAt, Number(this.boxType)
        ];
    }
    onTick() {
        const now = Date.now();
        if (now - this.createdAt >= ((this.boxType === "dead" || this.boxType === "gift") ? 480e3 : 16000)) {
            this.delete();
        }
    }
    onDead(damager) {
        if (damager instanceof player_1.default) {
            if (this.owner instanceof player_1.default && damager.id !== this.owner.id) {
                damager.ruinQuests();
            }
            if (this.inventory.size !== 0) {
                damager.inventory.concate(this.inventory, Infinity, true);
                this.inventory.size = 0;
            }
        }
    }
}
exports.Crate = Crate;
