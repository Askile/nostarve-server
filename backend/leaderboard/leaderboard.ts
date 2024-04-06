import {Server} from "../server";
import {ClientPackets} from "../enums/packets";
import LeaderboardUtils from "./leaderboard.utils";

export class Leaderboard {
    private server: Server;
    constructor(server: Server) {
        this.server = server;
    }

    public tick() {
        const leaderboard = this.server.alivePlayers
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);
        const packet = [];

        for (const player of leaderboard) {
            packet.push(player.id, LeaderboardUtils.restoreNumber(Math.floor(player.score)));
        }

        for (const client of this.server.wss.clients.values()) {
            if(!client.player) continue;

            client.sendBinary(new Uint16Array([ClientPackets.LEADERBOARD, LeaderboardUtils.restoreNumber(Math.floor(client.player.score)), ...packet]));
        }
    }
}
