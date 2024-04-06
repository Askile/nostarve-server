import {Server} from "../server";
import Player from "../entities/player";
import {ItemType} from "../enums/types/item.type";
import {Item} from "../entities/item";
import {StateType} from "../enums/types/state.type";

export class InteractionSystem {
    private server: Server;
    public items: Item[];
    constructor(server: Server) {
        this.server = server;
        this.items = [];

        for (let i = 0; i < Object.values(ItemType).length / 2 + 10; i++) {
            this.items[i] = new Item(i, server.configSystem);
        }
    }

    public request(player: Player, id: number) {
        const item = this.items[id];

        const canWeapon = Date.now() - player.timestamps.get("weapon") >= this.server.config.weapon_delay;
        const canEquip = Date.now() - player.timestamps.get("helmet") >= this.server.config.helmet_delay;

        if(item.id !== ItemType.HAND && (!item || !player.inventory.contains(id, 1))) return;

        if(item.isHat()) {
            if ((item.isCooldown() || player.helmet.isCooldown()) && !canEquip) return;
            if(player.helmet.id !== id) {
                player.helmet = item;
                if(item.isCooldown()) player.timestamps.set("helmet", Date.now());
            } else player.helmet = this.items[ItemType.HAND];
        } else if(item.isFood()) {
            if (item.id === ItemType.BANDAGE && player.gauges.bandage === player.server.config.bandage_stack_limit) return;

            if (item.id === ItemType.BOTTLE_FULL) {
                player.inventory.increase(ItemType.BOTTLE_EMPTY, 1, true);
            }

            player.gauges.hunger += item.food;
            player.gauges.thirst += item.water;
            player.gauges.bandage += item.heal;
            player.gauges.cold -= item.cold;
            
            player.inventory.decrease(item.id, 1, true);
            
            player.gauges.clamp();
            player.gauges.updateClientGauges();
        } else if (item.isVehicle()) {
            if(player.speed > 0.035 && player.vehicle.id) return;
            if(player.vehicle.id === item.id) {
                player.vehicle = this.items[ItemType.HAND];
                player.vehicleSpeed = 0;
            } else {
                player.vehicle = item;
                player.updateSpeed();
                player.speed = 0.03;
            }
        } else if (item.isEquipment()) {
            if((item.isEquipment() || player.right.isSlowDown()) && !canWeapon) return;
            player.right = item;
            if (item.isSlowDown()) player.timestamps.set("weapon", Date.now());
        } else if (item.id === ItemType.HAND && canWeapon) {
            player.right = this.items[ItemType.HAND];
        }

        player.updateInfo();
    }
}