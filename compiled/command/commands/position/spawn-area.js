"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.permission = exports.identifiers = void 0;
const permissions_1 = require("../../../enums/permissions");
const vector_1 = require("../../../modules/vector");
exports.identifiers = ["spawn-area"];
exports.permission = permissions_1.Permissions.OWNER;
function run(player, args, isServer) {
    const x = Number(args[0]) || undefined;
    const y = Number(args[1]) || undefined;
    if (x === undefined || y === undefined)
        return [false, "spawn-area <x> <y>"];
    this.server.spawner.spawnPoint = new vector_1.Vector(x * 100 + 50, y * 100 + 50);
    for (const player of this.server.players) {
        if (!player.alive) {
            player.realPosition.set(this.server.spawner.spawnPoint);
            player.position.set(this.server.spawner.spawnPoint);
        }
    }
}
exports.run = run;
