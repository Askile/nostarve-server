"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.permission = exports.identifiers = void 0;
const permissions_1 = require("../../../enums/permissions");
const item_type_1 = require("../../../enums/types/item.type");
exports.identifiers = ["ria", "remove-item-all"];
exports.permission = permissions_1.Permissions.OWNER;
function run(player, args, isServer) {
    const id = Number(args[0]) || item_type_1.ItemType[args[0].toUpperCase()] || undefined;
    const count = Number(args[1]) || undefined;
    if (id === undefined || count === undefined) {
        return [false, "ria <id> <count>"];
    }
    let playersWithItem = 0;
    for (const player of this.server.alivePlayers) {
        if (player.inventory.contains(id)) {
            playersWithItem++;
        }
        player.inventory.decrease(id, count, true);
    }
    return [true, `Removed x${count} ${item_type_1.ItemType[id]} from ${playersWithItem} players`];
}
exports.run = run;
