"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.permission = exports.identifiers = void 0;
const permissions_1 = require("../../../enums/permissions");
exports.identifiers = ["teleport-to", "tpt"];
exports.permission = permissions_1.Permissions.OWNER;
function run(player, args, isServer) {
    const id = Number(args[0]);
    if (!isNaN(id)) {
        const p = this.server.players[id - 1];
        if (!p)
            return [false, "Player not found."];
        if (p) {
            player.position.set(p.realPosition);
            player.realPosition.set(p.realPosition);
            return [true, "Teleported to " + p.nickname];
        }
    }
}
exports.run = run;
