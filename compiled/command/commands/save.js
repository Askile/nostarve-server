"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.permission = exports.identifiers = void 0;
const permissions_1 = require("../../enums/permissions");
exports.identifiers = ["save"];
exports.permission = permissions_1.Permissions.OWNER;
function run(player, args, isServer) {
    this.server.saveSystem.save();
}
exports.run = run;
