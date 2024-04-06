"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Leaderboard = void 0;
const packets_1 = require("../enums/packets");
const leaderboard_utils_1 = __importDefault(require("./leaderboard.utils"));
class Leaderboard {
    server;
    constructor(server) {
        this.server = server;
    }
    tick() {
        const leaderboard = this.server.alivePlayers
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);
        const packet = [];
        for (const player of leaderboard) {
            packet.push(player.id, leaderboard_utils_1.default.restoreNumber(Math.floor(player.score)));
        }
        for (const client of this.server.wss.clients.values()) {
            if (!client.player)
                continue;
            client.sendBinary(new Uint16Array([packets_1.ClientPackets.LEADERBOARD, leaderboard_utils_1.default.restoreNumber(Math.floor(client.player.score)), ...packet]));
        }
    }
}
exports.Leaderboard = Leaderboard;
