"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Master {
    /**
     * Get the master url
     */
    static getUrl(server) {
        return `http${server.settings.production ? "s" : ""}://${server.settings.production ? server.settings.account_domain : "localhost"}/`;
    }
    /**
     * Send the player count
     */
    static sendPlayerCount(server) {
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
        }
        catch { }
    }
    /**
     * Send the player with account session result to the master
     */
    static async sendPlayingResult(server, player) {
        try {
            fetch(Master.getUrl(server) + "updateAccountData", {
                method: "PUT",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({
                    l: player.account.name,
                    p: server.settings.master_password,
                    e: server.settings.experience_factor,
                    s: player.score,
                    k: player.kills,
                    t: player.time
                })
            });
        }
        catch { }
    }
    static async getAccount(server, login, password) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(Master.getUrl(server) + "login", {
                    body: JSON.stringify({ login, password }),
                    headers: {
                        "Content-type": "application/json"
                    },
                    method: "POST"
                });
                const json = await response.json();
                resolve(json);
            }
            catch {
                resolve(false);
            }
        });
    }
}
exports.default = Master;
