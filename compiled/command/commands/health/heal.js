"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.permission = exports.identifiers = void 0;
const permissions_1 = require("../../../enums/permissions");
const health_system_1 = __importDefault(require("../../../attributes/health.system"));
exports.identifiers = ["heal"];
exports.permission = permissions_1.Permissions.OWNER;
function run(player, args, isServer) {
    if (args.length === 0) {
        health_system_1.default.heal(player, 100);
        return [true, `${player.nickname} healed`];
    }
    else if (args.length === 1) {
        const id = Number(args[0]);
        const p = player.server.players[id - 1];
        if (!p) {
            return [false, "heal <id>"];
        }
        health_system_1.default.heal(p, 100);
        return [true, `${p.nickname} healed`];
    }
    else if (args.length === 2) {
        const id = Number(args[0]);
        const amount = Number(args[1]);
        const p = player.server.players[id - 1];
        if (!p || isNaN(amount)) {
            return [false, "heal <id> <amount>"];
        }
        health_system_1.default.heal(p, amount);
    }
    health_system_1.default.heal(player, 100);
}
exports.run = run;
