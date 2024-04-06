"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.permission = exports.identifiers = void 0;
const permissions_1 = require("../../../enums/permissions");
exports.identifiers = ["unban-ip"];
exports.permission = permissions_1.Permissions.OWNER;
function run(player, args, isServer) {
    const ip = args[0];
    const time = Number(args[1]);
    if (!ip || isNaN(time)) {
        return [false, "ban-ip [ip] [time]"];
    }
    else {
        const client = Array.from(this.server.wss.ips.values()).find((ip) => ip.address === ip);
        if (client) {
            client.ban(time * 1000);
            return [false, `Player ${ip} banned for ${time}s.`];
        }
        else {
            return [false, `Player ${ip} not found.`];
        }
    }
}
exports.run = run;
