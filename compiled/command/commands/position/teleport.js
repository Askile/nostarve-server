"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.permission = exports.identifiers = void 0;
const permissions_1 = require("../../../enums/permissions");
exports.identifiers = ["tp", "teleport"];
exports.permission = permissions_1.Permissions.OWNER;
function run(player, args, isServer) {
    if (args.length < 2)
        return [false, "tp [id] <x> <y>"];
    if (args.length === 2) {
        const x = Number(args[0]) || undefined;
        const y = Number(args[1]) || undefined;
        if (x !== undefined && y !== undefined) {
            player.position.x = x * 100 + 50;
            player.position.y = y * 100 + 50;
            player.realPosition.set(player.position);
            return [true, "Teleported to " + x + ", " + y];
        }
    }
    else if (args.length === 3) {
        const id = Number(args[0]) || undefined;
        const x = Number(args[1]) || undefined;
        const y = Number(args[2]) || undefined;
        if (id !== undefined && x !== undefined && y !== undefined) {
            const p = player.server.players[id - 1];
            if (p) {
                p.position.x = x * 100 + 50;
                p.position.y = y * 100 + 50;
                p.realPosition.set(p.position);
                return [true, "Teleported player " + p.nickname + " to " + x + ", " + y];
            }
        }
    }
}
exports.run = run;
