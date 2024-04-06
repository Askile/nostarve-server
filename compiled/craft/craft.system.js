"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const item_type_1 = require("../enums/types/item.type");
const state_type_1 = require("../enums/types/state.type");
const packets_1 = require("../enums/packets");
const default_recipes_1 = require("../default/default.recipes");
class CraftSystem {
    server;
    processes = new Map();
    crafts;
    constructor(server) {
        this.server = server;
        this.processes = new Map();
        this.crafts = default_recipes_1.RECIPES.slice();
        if (this.server.config.important.recipes) {
            for (let craft of this.server.config.important.recipes) {
                craft.id = item_type_1.ItemType[craft.item.toUpperCase()];
                craft.r = craft.recipe.map((rec) => [item_type_1.ItemType[rec[0].toUpperCase()], rec[1]]);
                craft.w = craft.workbench;
                delete craft.workbench;
                delete craft.item;
                delete craft.recipe;
                this.crafts[craft.id] = craft;
            }
        }
        if (this.server.config.instant_craft === 1) {
            for (const craft of this.crafts) {
                if (!craft)
                    continue;
                craft.time = 0;
            }
        }
    }
    tick() {
        const now = Date.now();
        for (const playerId of this.processes.keys()) {
            const player = this.server.players[playerId];
            if (!player.hasState(state_type_1.StateType.CRAFT))
                continue;
            const proc = this.processes.get(playerId);
            const craft = this.crafts[proc.craftId];
            if (proc.isRecycle) {
                if (proc.endAt < now) {
                    for (const [id, count] of craft.r) {
                        if (count === 1)
                            continue;
                        player.inventory.increase(id, Math.floor(count * 0.8));
                    }
                    player.client.sendBinary(new Uint8Array([packets_1.ClientPackets.RECYCLE_STOP, proc.craftId]));
                    player.removeState(state_type_1.StateType.CRAFT);
                    this.processes.delete(playerId);
                }
            }
            else {
                if (proc.endAt < now) {
                    player.client.sendU8([packets_1.ClientPackets.BUILD_STOP, (proc.craftId === item_type_1.ItemType.BOTTLE_FULL_2 || proc.craftId === item_type_1.ItemType.BOTTLE_FULL_3) ? item_type_1.ItemType.BOTTLE_FULL : proc.craftId]);
                    player.inventory.increase((proc.craftId === item_type_1.ItemType.BOTTLE_FULL_2 || proc.craftId === item_type_1.ItemType.BOTTLE_FULL_3) ? item_type_1.ItemType.BOTTLE_FULL : proc.craftId, 1);
                    for (const [id, count] of craft.r) {
                        player.inventory.decrease(id, count, false);
                    }
                    if (craft.bonus)
                        player.score += craft.bonus;
                    player.removeState(state_type_1.StateType.CRAFT);
                    this.processes.delete(playerId);
                }
            }
        }
    }
    craft(player, id) {
        if (!this.crafts[id] || player.hasState(state_type_1.StateType.CRAFT))
            return;
        const craft = this.crafts[id];
        const endAt = Date.now() + ((player.right.id === item_type_1.ItemType.BOOK ? craft.time / 3 : craft.time) * 1000);
        if (craft.w && !player.hasState(state_type_1.StateType.WORKBENCH) ||
            craft.f && !player.hasState(state_type_1.StateType.FIRE) ||
            craft.o && !player.hasState(state_type_1.StateType.IN_WATER) ||
            craft.e && !player.hasState(state_type_1.StateType.WELL))
            return;
        for (const [id, count] of craft.r) {
            if (!player.inventory.contains(id, count)) {
                return;
            }
        }
        player.addState(state_type_1.StateType.CRAFT);
        player.client.sendU8([packets_1.ClientPackets.BUILD_OK, id]);
        this.processes.set(player.id - 1, {
            isRecycle: false,
            endAt,
            craftId: id
        });
    }
    stop(player) {
        player.removeState(state_type_1.StateType.CRAFT);
        player.client.sendU8([packets_1.ClientPackets.CANCEL_CRAFT]);
    }
    recycle(player, id) {
        if (!this.crafts[id] || player.hasState(state_type_1.StateType.CRAFT))
            return;
        const craft = this.crafts[id];
        const endAt = Date.now() + (player.right.id === item_type_1.ItemType.BOOK ? craft.time / 3 : craft.time);
        if (!player.inventory.contains(id, 1) ||
            craft.w && !player.hasState(state_type_1.StateType.WORKBENCH) ||
            craft.f && !player.hasState(state_type_1.StateType.FIRE) ||
            craft.o && !player.hasState(state_type_1.StateType.IN_WATER) ||
            craft.e && !player.hasState(state_type_1.StateType.WELL))
            return;
        player.addState(state_type_1.StateType.CRAFT);
        player.client.sendU8([packets_1.ClientPackets.RECYCLE_OK, id]);
        player.inventory.decrease(id, 1, true);
        this.processes.set(player.id - 1, {
            isRecycle: true,
            endAt,
            craftId: id
        });
    }
}
exports.default = CraftSystem;
