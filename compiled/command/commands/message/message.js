"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.permission = exports.identifiers = void 0;
const permissions_1 = require("../../../enums/permissions");
const packets_1 = require("../../../enums/packets");
exports.identifiers = ["m", "message"];
exports.permission = permissions_1.Permissions.OWNER;
function run(player, args, isServer) {
    for (const client of this.server.wss.clients.values()) {
        if (client.isActive) {
            client.sendJSON([packets_1.ClientStringPackets.MESSAGE, args.join(" ")]);
        }
    }
}
exports.run = run;
