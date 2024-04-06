"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.permission = exports.identifiers = void 0;
const permissions_1 = require("../../../enums/permissions");
exports.identifiers = ["ban"];
exports.permission = permissions_1.Permissions.OWNER;
function run(player, args, isServer) {
    const id = Number(args[0]);
    const time = Number(args[1]);
    if (isNaN(id) || isNaN(time)) {
        return [false, "ban <id> <time>"];
    }
    const p = this.server.players[id - 1];
    if (!p) {
        return [false, `Player ${id} not found`];
    }
    p.client.ban(time * 1000);
    return [true, `Player ${p.nickname} banned for ${time}s`];
}
exports.run = run;
