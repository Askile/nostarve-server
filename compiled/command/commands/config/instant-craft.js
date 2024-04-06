"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.permission = exports.identifiers = void 0;
const permissions_1 = require("../../../enums/permissions");
const default_recipes_1 = require("../../../default/default.recipes");
exports.identifiers = ["instant-craft"];
exports.permission = permissions_1.Permissions.OWNER;
function run(player, args, isServer) {
    this.server.config.instant_craft = this.server.config.instant_craft === 1 ? 0 : 1;
    for (let i = 0; i < this.server.craftSystem.crafts.length; i++) {
        const craft = this.server.craftSystem.crafts[i];
        if (!craft)
            continue;
        craft.time = this.server.config.instant_craft === 1 ? 0 : default_recipes_1.RECIPES[i].time;
    }
    return [true, "Instant craft " + (this.server.config.instant_craft === 1 ? "enabled" : "disabled")];
}
exports.run = run;
