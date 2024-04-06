"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.permission = exports.identifiers = void 0;
const permissions_1 = require("../../../enums/permissions");
exports.identifiers = ["unban-ip"];
exports.permission = permissions_1.Permissions.OWNER;
function run(player, args, isServer) {
    const ip = args[0];
    if (!ip) {
        return [false, "unban-ip [ip]"];
    }
    else {
        const ip = Array.from(this.server.wss.ips.values()).find((ip) => ip.address === ip);
        if (ip) {
            if (ip) {
                ip.banTime = 0;
            }
            return [false, `Player ${ip} unbanned.`];
        }
        else {
            return [false, `Player ${ip} not found.`];
        }
    }
}
exports.run = run;
