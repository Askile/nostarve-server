"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.permission = exports.identifiers = void 0;
const permissions_1 = require("../../../enums/permissions");
exports.identifiers = ["ip"];
exports.permission = permissions_1.Permissions.PLAYER;
function run(player, args, isServer) {
    return [true, "Ur ip: " + player?.client?.ip?.address];
}
exports.run = run;
