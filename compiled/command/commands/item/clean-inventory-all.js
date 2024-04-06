"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.permission = exports.identifiers = void 0;
const permissions_1 = require("../../../enums/permissions");
exports.identifiers = ["cia", "clean-inventory-all"];
exports.permission = permissions_1.Permissions.CO_OWNER;
function run(player, args) {
    for (const player of this.server.alivePlayers) {
        player.inventory.clear(true);
    }
    return [true, "Cleared inventory from " + this.server.alivePlayers.length + " players"];
}
exports.run = run;
