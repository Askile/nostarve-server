"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.permission = exports.identifiers = void 0;
const permissions_1 = require("../../../enums/permissions");
exports.identifiers = ["tpa", "teleport-all"];
exports.permission = permissions_1.Permissions.OWNER;
function run(player, args, isServer) {
    const x = Number(args[0]) || undefined;
    const y = Number(args[1]) || undefined;
    if (x === undefined || y === undefined) {
        return [false, "tpa <x> <y>"];
    }
    for (const p of player.server.alivePlayers) {
        p.position.x = x * 100 + 50;
        p.position.y = y * 100 + 50;
        p.realPosition.set(p.position);
    }
    return [true, `Teleported ${player.server.alivePlayers.length} players to ${x}:${y}`];
}
exports.run = run;
