"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionSystem = void 0;
const item_type_1 = require("../enums/types/item.type");
const item_1 = require("../entities/item");
class InteractionSystem {
    server;
    items;
    constructor(server) {
        this.server = server;
        this.items = [];
        for (let i = 0; i < Object.values(item_type_1.ItemType).length / 2 + 10; i++) {
            this.items[i] = new item_1.Item(i, server.configSystem);
        }
    }
    request(player, id) {
        const item = this.items[id];
        const canWeapon = Date.now() - player.timestamps.get("weapon") >= this.server.config.weapon_delay;
        const canEquip = Date.now() - player.timestamps.get("helmet") >= this.server.config.helmet_delay;
        if (item.id !== item_type_1.ItemType.HAND && (!item || !player.inventory.contains(id, 1)))
            return;
        if (item.isHat()) {
            if ((item.isCooldown() || player.helmet.isCooldown()) && !canEquip)
                return;
            if (player.helmet.id !== id) {
                player.helmet = item;
                if (item.isCooldown())
                    player.timestamps.set("helmet", Date.now());
            }
            else
                player.helmet = this.items[item_type_1.ItemType.HAND];
        }
        else if (item.isFood()) {
            if (item.id === item_type_1.ItemType.BANDAGE && player.gauges.bandage === player.server.config.bandage_stack_limit)
                return;
            if (item.id === item_type_1.ItemType.BOTTLE_FULL) {
                player.inventory.increase(item_type_1.ItemType.BOTTLE_EMPTY, 1, true);
            }
            player.gauges.hunger += item.food;
            player.gauges.thirst += item.water;
            player.gauges.bandage += item.heal;
            player.gauges.cold -= item.cold;
            player.inventory.decrease(item.id, 1, true);
            player.gauges.clamp();
            player.gauges.updateClientGauges();
        }
        else if (item.isVehicle()) {
            if (player.speed > 0.035 && player.vehicle.id)
                return;
            if (player.vehicle.id === item.id) {
                player.vehicle = this.items[item_type_1.ItemType.HAND];
                player.vehicleSpeed = 0;
            }
            else {
                player.vehicle = item;
                player.updateSpeed();
                player.speed = 0.03;
            }
        }
        else if (item.isEquipment()) {
            if ((item.isEquipment() || player.right.isSlowDown()) && !canWeapon)
                return;
            player.right = item;
            if (item.isSlowDown())
                player.timestamps.set("weapon", Date.now());
        }
        else if (item.id === item_type_1.ItemType.HAND && canWeapon) {
            player.right = this.items[item_type_1.ItemType.HAND];
        }
        player.updateInfo();
    }
}
exports.InteractionSystem = InteractionSystem;
