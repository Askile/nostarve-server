import {Entity} from "../entities/entity";
import {ClientPackets} from "../enums/packets";
import {BinaryWriter} from "../modules/binary.writer";
import Player from "../entities/player";
import {CachedPackets} from "../network/cached.packets";
import {ItemType} from "../enums/types/item.type";

export default class Inventory {
    public owner: Entity;
    public items: number[];
    public maxSize: number;
    public size: number;
    constructor(owner: Entity, maxSize: number) {
        this.owner = owner;
        this.maxSize = maxSize;
        this.items = [];
        this.size = 0;
    }
    /**
     * Checks if an item is in the inventory
     */
    public contains(id: number, count: number = 1) : boolean {
        return this.count(id) >= count;
    }
    /**
     * Returns the count of an item
     */
    public count(id: number) {
        return this.items[id] ?? 0;
    }
    /**
     * Increases an item in the inventory
     */
    public increase(id: number, count: number = 1, send: boolean = false) {
        if(send && this.owner instanceof Player && !this.owner.client?.isActive) send = false;
        if(count < 1) return;

        this.items[id] ??= 0;
        if(id === ItemType.BAG) {
            this.maxSize = 16;
            if(this.owner instanceof Player) this.owner.updateInfo();
            if(send) {
                (this.owner as Player).client.sendBinary(CachedPackets.get(ClientPackets.GET_BAG));
            }
        } else if(this.contains(id)) {
            this.items[id] += count;
            if(send) {
                const writer = new BinaryWriter();

                writer.writeUInt16(ClientPackets.GATHER);
                if(count > 65535) {
                    for (let i = 0; i < count; i += 65535) {
                        if(i > 16777216) break;
                        writer.writeUInt16(id);
                        writer.writeUInt16(Math.min(count - i, 65535));
                    }
                } else {
                    writer.writeUInt16(id);
                    writer.writeUInt16(count);
                }

                (this.owner as Player).client.sendBinary(writer.toBuffer());
            }
        } else if(this.size < this.maxSize) {
            this.items[id] = count;
            this.size++;
            if(send) {
                const writer = new BinaryWriter();

                writer.writeUInt16(ClientPackets.GATHER);
                if(count > 65535) {
                    for (let i = 0; i < count; i += 65535) {
                        if(i > 16777216) break;
                        writer.writeUInt16(id);
                        writer.writeUInt16(Math.min(count - i, 65535));
                    }
                } else {
                    writer.writeUInt16(id);
                    writer.writeUInt16(count);
                }

                (this.owner as Player).client.sendBinary(writer.toBuffer());
            }
        } else {
            if(send) {
                (this.owner as Player).client.sendBinary(CachedPackets.get(ClientPackets.INV_FULL));
            }
        }
    }
    /**
     * Decreases an item in the inventory
     */
    public decrease(id: number, count: number = 1, send: boolean = false) {
        if(send && this.owner instanceof Player && !this.owner.client?.isActive) send = false;
        this.items[id] ??= 0;
        const itemCount = this.count(id);
        if(itemCount < 1) return;
        if(count >= itemCount) {
            return this.delete(id, send);
        } else if(count > 0 && count < 256) {
            this.items[id] -= count;
            if(send) {
                const writer = new BinaryWriter();

                writer.writeUInt8(ClientPackets.DECREASE_ITEM);
                writer.writeUInt8(id);
                writer.writeUInt8(count);

                (this.owner as Player).client.sendBinary(writer.toBuffer());
            }
        } else if(count > 0) {
            this.items[id] -= count;
            if(send) {
                const writer = new BinaryWriter();

                writer.writeUInt8(ClientPackets.DECREASE_ITEM_2);
                writer.writeUInt8(id);
                writer.writeUInt8(count >> 8);
                writer.writeUInt8(count % 256);

                (this.owner as Player).client.sendBinary(writer.toBuffer());
            }
        }
    }
    /**
     * Removes an item from the inventory
     */
    public delete(id: number, send: boolean = false) {
        if(send && this.owner instanceof Player && !this.owner.client?.isActive) send = false;
        this.items[id] = 0;
        this.size--;
        if(this.owner instanceof Player) this.owner.unEquipItem(id);
        if(send) {
            const writer = new BinaryWriter();

            writer.writeUInt8(ClientPackets.DELETE_INV_OK);
            writer.writeUInt8(id);

            (this.owner as Player).client.sendBinary(writer.toBuffer());
        }
    }
    /**
     * Clears the inventory
     */
    public clear(send: boolean = false) {
        if(send && this.owner instanceof Player && !this.owner.client?.isActive) send = false;
        this.items = [];
        this.size = 0;
        if(send) {
            (this.owner as Player).client.sendBinary(CachedPackets.get(ClientPackets.CLEAN_INVENTORY));
            (this.owner as Player).unEquipInventory();
        }
    }
    /**
     * Checks if the inventory is full
     */
    public isFull() {
        return this.size >= this.maxSize;
    }
    /**
     * Serializes the inventory
     */
    public serialize() {
        return Array.from(this.items.entries()).filter(([id, count]) => count > 0);
    }
    /**
     * Merges two inventories
     */
    public concate(inventory: Inventory, bound: number = Infinity, send: boolean = false) {
        if(send && this.owner instanceof Player && !this.owner.client?.isActive) send = false;
        if(this.isFull() && send) {
            (this.owner as Player).client.sendBinary(CachedPackets.get(ClientPackets.INV_FULL));
        }

        const writer = new BinaryWriter();

        let isFull = false;

        writer.writeUInt16(ClientPackets.GATHER);

        for (let i = 0; i < inventory.items.length; i++) {
            if(this.isFull() && !this.contains(i)) {
                isFull = true;
                continue;
            }

            const count = Math.min(bound, inventory.count(i));
            if(!count) continue;

            if(!this.items[i]) {
                this.items[i] = count;
                this.size++;
            } else this.items[i] += count;

            for (let j = 0; j < count; j += 65535) {
                if(j > 16777216) break;

                writer.writeUInt16(i);
                writer.writeUInt16(Math.min(count - j, 65535));
            }
        }

        if(send) {
            (this.owner as Player).client.sendBinary(writer.toBuffer());
            if(isFull) (this.owner as Player).client.sendBinary(CachedPackets.get(ClientPackets.INV_FULL));
        }
    }
}