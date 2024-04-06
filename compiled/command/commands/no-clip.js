"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.permission = exports.identifiers = void 0;
const permissions_1 = require("../../enums/permissions");
exports.identifiers = ["nc", "no-clip"];
exports.permission = permissions_1.Permissions.OWNER;
function run(player, args, isServer) {
    player.radius = player.radius === 25 ? -1000 : 25;
    return [true, `No-clip ${player.radius === 25 ? "disabled" : "enabled"}`];
}
exports.run = run;
