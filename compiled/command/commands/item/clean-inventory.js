"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.permission = exports.identifiers = void 0;
const permissions_1 = require("../../../enums/permissions");
exports.identifiers = ["ci", "clean-inventory"];
exports.permission = permissions_1.Permissions.CO_OWNER;
function run(player, args, isServer) {
    const id = Number(args[0]) || undefined;
    if (id !== undefined)
        player = player.server.players[id - 1];
    if (player === undefined || !player.alive)
        return [false, "Player not found"];
    player.inventory.clear(true);
    return [true, "Cleared inventory"];
}
exports.run = run;
