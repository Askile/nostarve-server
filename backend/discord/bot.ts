import {createCanvas, registerFont} from "canvas";
import {AttachmentBuilder, Client, GatewayIntentBits, PermissionsBitField} from "discord.js";
import {discordConfig, Server} from "../server";
import {Utils} from "../modules/utils";
import {Vector} from "../modules/vector";
import {EntityType} from "../enums/types/entity.type";
import SpriteManager from "../sprite/sprite.manager";
import LeaderboardUtils from "../leaderboard/leaderboard.utils";
import {ItemType} from "../enums/types/item.type";

registerFont("./BalooPaaji2-ExtraBold.ttf", {
    family: "Baloo Paaji 2"
});

SpriteManager.init();
export default class DiscordBot {
    public startedAt: number;
    public server: Server;
    public client: Client;
    public data: Map<string, number>;
    constructor(server: Server) {
        this.server = server;
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
        });

        this.startedAt = Date.now() - 3_600_000 * 2;
        this.data = new Map();

        this.start();
    }

    private hasRole(name: string, member: any) {
        return member.roles.cache.some(role => role.name === name);
    }

    public start() {
        this.client.on("messageCreate", async message => {
            try {
                if(message.author.bot) return;

                const isAdmin = message.member.user.id === "563325554170789898";
                const words = message.content.trim().split(" ");

                if(message.content.startsWith(discordConfig.prefix)) {
                    const command = words[0].substring(discordConfig.prefix.length);
                    const args = words.slice(1);

                    switch(command) {
                        /**
                         * !exec command
                         */
                        case "exec":
                            if(!isAdmin) break;
                            this.server.commandSystem.handleServerCommand(args.join(" "));
                            await message.channel.send("Executed command");
                            break;
                        case "playerCount":
                            await message.channel.send(this.server.alivePlayers.length.toString());
                            break;
                        case "tps":
                            await message.channel.send(this.server.ticker.tps.toFixed(1));
                            break;
                        case "kit": {
                            const kit = args[0];
                            const id = Number(args[1]);

                            if (isNaN(id) || !kit) {
                                break;
                            }

                            const player = this.server.players[id - 1];

                            if (!player || !player.alive) break;

                            switch (kit) {
                                case "booster":
                                    if(!this.hasRole("Server Booster", message.member) && !isAdmin) {
                                        await message.channel.send(`You don't have permission to use this command`);
                                        return;
                                    }

                                    if(!this.data.has(message.member.id)) this.data.set(message.member.id, this.startedAt);

                                    if(Date.now() - this.data.get(message.member.id) < 3_600_000 * 3) {
                                        await message.channel.send(`You can't use booster kit until <t:${Math.round((this.data.get(message.member.id) + 3_600_000 * 3) / 1000)}>`);
                                        return;
                                    }

                                    this.data.set(message.member.id, Date.now());
                                    this.server.kitSystem.discordGainKit(player, "booster");
                                    await message.channel.send(`Player with name ${player.nickname} gain booster kit`);
                                break;
                            }
                        } break;
                    }
                }
            } catch(e) {
                console.log(e);
            }
        })

        this.client.once("ready", () => {
            this.server.logger.log("[Discord] Ready!");
        })

        this.client.login(this.server.settings.production ? discordConfig.prodToken : discordConfig.devToken);

    }

}