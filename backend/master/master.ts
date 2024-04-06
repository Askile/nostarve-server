import {Server} from "../server";
import Player from "../entities/player";

export default class Master {
    /**
     * Get the master url
     */
    private static getUrl(server: Server) {
        return `http${server.settings.production ? "s" : ""}://${server.settings.production ? server.settings.account_domain : "localhost"}/`;
    }
    /**
     * Send the player count
     */
    public static sendPlayerCount(server: Server) {
        try {
            fetch(Master.getUrl(server) + "updatePlayerCount", {
                method: "PUT",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({
                    c: server.alivePlayers.length,
                    d: server.settings.production ? (server.settings.subdomain + "." + server.settings.domain) : "localhost",
                    p: server.settings.master_password
                })
            });
        } catch {}
    }

    /**
     * Send the player with account session result to the master
     */
    public static async sendPlayingResult(server: Server, player: Player) {
        try {
            fetch(Master.getUrl(server) + "updateAccountData", {
                method: "PUT",
                headers: {"Content-type": "application/json"},
                body: JSON.stringify({
                    l: player.account.name,
                    p: server.settings.master_password,
                    e: server.settings.experience_factor,
                    s: player.score,
                    k: player.kills,
                    t: player.time
                })
            });
        } catch {}
    }

    public static async getAccount(server: Server, login: string, password: string) {
        return new Promise<any>(async(resolve: any, reject: any) => {
            try {
                const response = await fetch(Master.getUrl(server) + "login", {
                    body: JSON.stringify({login, password}),
                    headers: {
                        "Content-type": "application/json"
                    },
                    method: "POST"
                });

                const json = await response.json();
                resolve(json);
            } catch {
                resolve(false);
            }
        });
    }

}