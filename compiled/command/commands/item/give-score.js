"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.permission = exports.identifiers = void 0;
const permissions_1 = require("../../../enums/permissions");
exports.identifiers = ["gs", "give-score"];
exports.permission = permissions_1.Permissions.OWNER;
function run(player, args, isServer) {
    if (args.length === 1) {
        player.score += Number(args[0]) || 0;
        return [true, `Gave ${player.nickname} ${args[0]} score`];
    }
    else if (args.length === 2) {
        const id = Number(args[0]) || -1;
        const p = this.server.players[id - 1];
        if (p === undefined || !p.alive)
            return [false, "Player not found"];
        p.score += Number(args[1]) || 0;
        return [true, `Gave ${p.nickname} ${args[1]} score`];
    }
    return [false, "gs <id> <score> | gs <score>"];
}
exports.run = run;
