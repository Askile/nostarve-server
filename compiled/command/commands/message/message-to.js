"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.permission = exports.identifiers = void 0;
const permissions_1 = require("../../../enums/permissions");
const packet_sender_1 = __importDefault(require("../../../network/packet.sender"));
exports.identifiers = ["mt", "message-to"];
exports.permission = permissions_1.Permissions.OWNER;
function run(player, args, isServer) {
    const id = Number(args[0]) || undefined;
    if (id === undefined)
        return;
    const p = this.server.players[id - 1];
    if (p && p.alive) {
        packet_sender_1.default.message(player, args.slice(1).join(" "));
    }
}
exports.run = run;
