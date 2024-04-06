"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.permission = exports.identifiers = void 0;
const permissions_1 = require("../../../enums/permissions");
const item_type_1 = require("../../../enums/types/item.type");
exports.identifiers = ["ri", "remove-item"];
exports.permission = permissions_1.Permissions.OWNER;
function run(player, args, isServer) {
    if (args.length < 2)
        return [false, "ri <id> <item> [count]"];
    const id = Number(args[0]) || undefined;
    const itemId = Number(args[1]) || Number(item_type_1.ItemType[args[1].toUpperCase()]) || undefined;
    const count = Number(args[2]) || 1;
    const p = this.server.players[id - 1];
    if (!p || !p.alive) {
        return [false, "Player not found"];
    }
    if (itemId === undefined ||
        id === undefined) {
        return [false, "give <id> <item> [count]"];
    }
    p.inventory.decrease(itemId, count, true);
    return [true, `Added ${count}x ${item_type_1.ItemType[itemId]} to ${p.nickname}`];
}
exports.run = run;
