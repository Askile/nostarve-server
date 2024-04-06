"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const packets_1 = require("../enums/packets");
const binary_writer_1 = require("../modules/binary.writer");
const player_1 = __importDefault(require("../entities/player"));
const cached_packets_1 = require("../network/cached.packets");
const item_type_1 = require("../enums/types/item.type");
class Inventory {
    owner;
    items;
    maxSize;
    size;
    constructor(owner, maxSize) {
        this.owner = owner;
        this.maxSize = maxSize;
        this.items = [];
        this.size = 0;
    }
    /**
     * Checks if an item is in the inventory
     */
    contains(id, count = 1) {
        return this.count(id) >= count;
    }
    /**
     * Returns the count of an item
     */
    count(id) {
        return this.items[id] ?? 0;
    }
    /**
     * Increases an item in the inventory
     */
    increase(id, count = 1, send = false) {
        if (send && this.owner instanceof player_1.default && !this.owner.client?.isActive)
            send = false;
        if (count < 1)
            return;
        this.items[id] ??= 0;
        if (id === item_type_1.ItemType.BAG) {
            this.maxSize = 16;
            if (this.owner instanceof player_1.default)
                this.owner.updateInfo();
            if (send) {
                this.owner.client.sendBinary(cached_packets_1.CachedPackets.get(packets_1.ClientPackets.GET_BAG));
            }
        }
        else if (this.contains(id)) {
            this.items[id] += count;
            if (send) {
                const writer = new binary_writer_1.BinaryWriter();
                writer.writeUInt16(packets_1.ClientPackets.GATHER);
                if (count > 65535) {
                    for (let i = 0; i < count; i += 65535) {
                        if (i > 16777216)
                            break;
                        writer.writeUInt16(id);
                        writer.writeUInt16(Math.min(count - i, 65535));
                    }
                }
                else {
                    writer.writeUInt16(id);
                    writer.writeUInt16(count);
                }
                this.owner.client.sendBinary(writer.toBuffer());
            }
        }
        else if (this.size < this.maxSize) {
            this.items[id] = count;
            this.size++;
            if (send) {
                const writer = new binary_writer_1.BinaryWriter();
                writer.writeUInt16(packets_1.ClientPackets.GATHER);
                if (count > 65535) {
                    for (let i = 0; i < count; i += 65535) {
                        if (i > 16777216)
                            break;
                        writer.writeUInt16(id);
                        writer.writeUInt16(Math.min(count - i, 65535));
                    }
                }
                else {
                    writer.writeUInt16(id);
                    writer.writeUInt16(count);
                }
                this.owner.client.sendBinary(writer.toBuffer());
            }
        }
        else {
            if (send) {
                this.owner.client.sendBinary(cached_packets_1.CachedPackets.get(packets_1.ClientPackets.INV_FULL));
            }
        }
    }
    /**
     * Decreases an item in the inventory
     */
    decrease(id, count = 1, send = false) {
        if (send && this.owner instanceof player_1.default && !this.owner.client?.isActive)
            send = false;
        this.items[id] ??= 0;
        const itemCount = this.count(id);
        if (itemCount < 1)
            return;
        if (count >= itemCount) {
            return this.delete(id, send);
        }
        else if (count > 0 && count < 256) {
            this.items[id] -= count;
            if (send) {
                const writer = new binary_writer_1.BinaryWriter();
                writer.writeUInt8(packets_1.ClientPackets.DECREASE_ITEM);
                writer.writeUInt8(id);
                writer.writeUInt8(count);
                this.owner.client.sendBinary(writer.toBuffer());
            }
        }
        else if (count > 0) {
            this.items[id] -= count;
            if (send) {
                const writer = new binary_writer_1.BinaryWriter();
                writer.writeUInt8(packets_1.ClientPackets.DECREASE_ITEM_2);
                writer.writeUInt8(id);
                writer.writeUInt8(count >> 8);
                writer.writeUInt8(count % 256);
                this.owner.client.sendBinary(writer.toBuffer());
            }
        }
    }
    /**
     * Removes an item from the inventory
     */
    delete(id, send = false) {
        if (send && this.owner instanceof player_1.default && !this.owner.client?.isActive)
            send = false;
        this.items[id] = 0;
        this.size--;
        if (this.owner instanceof player_1.default)
            this.owner.unEquipItem(id);
        if (send) {
            const writer = new binary_writer_1.BinaryWriter();
            writer.writeUInt8(packets_1.ClientPackets.DELETE_INV_OK);
            writer.writeUInt8(id);
            this.owner.client.sendBinary(writer.toBuffer());
        }
    }
    /**
     * Clears the inventory
     */
    clear(send = false) {
        if (send && this.owner instanceof player_1.default && !this.owner.client?.isActive)
            send = false;
        this.items = [];
        this.size = 0;
        if (send) {
            this.owner.client.sendBinary(cached_packets_1.CachedPackets.get(packets_1.ClientPackets.CLEAN_INVENTORY));
            this.owner.unEquipInventory();
        }
    }
    /**
     * Checks if the inventory is full
     */
    isFull() {
        return this.size >= this.maxSize;
    }
    /**
     * Serializes the inventory
     */
    serialize() {
        return Array.from(this.items.entries()).filter(([id, count]) => count > 0);
    }
    /**
     * Merges two inventories
     */
    concate(inventory, bound = Infinity, send = false) {
        if (send && this.owner instanceof player_1.default && !this.owner.client?.isActive)
            send = false;
        if (this.isFull() && send) {
            this.owner.client.sendBinary(cached_packets_1.CachedPackets.get(packets_1.ClientPackets.INV_FULL));
        }
        const writer = new binary_writer_1.BinaryWriter();
        let isFull = false;
        writer.writeUInt16(packets_1.ClientPackets.GATHER);
        for (let i = 0; i < inventory.items.length; i++) {
            if (this.isFull() && !this.contains(i)) {
                isFull = true;
                continue;
            }
            const count = Math.min(bound, inventory.count(i));
            if (!count)
                continue;
            if (!this.items[i]) {
                this.items[i] = count;
                this.size++;
            }
            else
                this.items[i] += count;
            for (let j = 0; j < count; j += 65535) {
                if (j > 16777216)
                    break;
                writer.writeUInt16(i);
                writer.writeUInt16(Math.min(count - j, 65535));
            }
        }
        if (send) {
            this.owner.client.sendBinary(writer.toBuffer());
            if (isFull)
                this.owner.client.sendBinary(cached_packets_1.CachedPackets.get(packets_1.ClientPackets.INV_FULL));
        }
    }
}
exports.default = Inventory;
