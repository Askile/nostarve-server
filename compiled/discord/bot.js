"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const canvas_1 = require("canvas");
const discord_js_1 = require("discord.js");
const server_1 = require("../server");
const utils_1 = require("../modules/utils");
const entity_type_1 = require("../enums/types/entity.type");
const sprite_manager_1 = __importDefault(require("../sprite/sprite.manager"));
const leaderboard_utils_1 = __importDefault(require("../leaderboard/leaderboard.utils"));
const item_type_1 = require("../enums/types/item.type");
(0, canvas_1.registerFont)("./BalooPaaji2-ExtraBold.ttf", {
    family: "Baloo Paaji 2"
});
sprite_manager_1.default.init();
class DiscordBot {
    startedAt;
    server;
    client;
    data;
    constructor(server) {
        this.server = server;
        this.client = new discord_js_1.Client({
            intents: [
                discord_js_1.GatewayIntentBits.Guilds,
                discord_js_1.GatewayIntentBits.GuildMessages,
                discord_js_1.GatewayIntentBits.MessageContent
            ]
        });
        this.startedAt = Date.now() - 3_600_000 * 2;
        this.data = new Map();
        this.start();
    }
    hasRole(name, member) {
        return member.roles.cache.some(role => role.name === name);
    }
    start() {
        this.client.on("messageCreate", async (message) => {
            try {
                if (message.author.bot)
                    return;
                const isAdmin = message.member.user.id === "563325554170789898";
                const words = message.content.trim().split(" ");
                if (message.content.startsWith(server_1.discordConfig.prefix)) {
                    const command = words[0].substring(server_1.discordConfig.prefix.length);
                    const args = words.slice(1);
                    switch (command) {
                        /**
                         * !exec command
                         */
                        case "exec":
                            if (!isAdmin)
                                break;
                            this.server.commandSystem.handleServerCommand(args.join(" "));
                            await message.channel.send("Executed command");
                            break;
                        case "playerCount":
                            await message.channel.send(this.server.alivePlayers.length.toString());
                            break;
                        case "tps":
                            await message.channel.send(this.server.ticker.tps.toFixed(1));
                            break;
                        case "screenshot":
                            if (!isAdmin)
                                break;
                            const id = Number(args[0]);
                            if (isNaN(id)) {
                                break;
                            }
                            const p = this.server.players[id - 1];
                            if (!p || !p.alive)
                                break;
                            const canvas = (0, canvas_1.createCanvas)(p.camera.width, p.camera.height);
                            const ctx = canvas.getContext("2d");
                            const body = sprite_manager_1.default.sprites.get("body");
                            const hand = sprite_manager_1.default.sprites.get("hand");
                            const bag = sprite_manager_1.default.sprites.get("bag");
                            const chest = sprite_manager_1.default.sprites.get("chest");
                            const plot = sprite_manager_1.default.sprites.get("plot");
                            const crate = sprite_manager_1.default.sprites.get("crate");
                            const players = this.server.alivePlayers.filter(player => p.position.isVectorInsideRectangle(player.position, p.camera.width, p.camera.height));
                            ctx.fillStyle = "#133a2b";
                            ctx.fillRect(0, 0, p.camera.width, p.camera.height);
                            for (const entity of Object.values(this.server.entities)) {
                                if (entity.type === entity_type_1.EntityType.PLAYER)
                                    continue;
                                ctx.save();
                                ctx.beginPath();
                                const angle = utils_1.Utils.convertUintToAngle(entity.angle) - Math.PI / 2;
                                ctx.translate(entity.realPosition.x - p.realPosition.x + p.camera.width / 2, entity.realPosition.y - p.realPosition.y + p.camera.height / 2);
                                ctx.fillStyle = "white";
                                ctx.textAlign = "center";
                                ctx.textBaseline = "middle";
                                ctx.font = "20px Baloo Paaji 2";
                                ctx.rotate(angle);
                                if (entity.type === entity_type_1.EntityType.PLOT) {
                                    ctx.drawImage(plot, -50, -50, 100, 100);
                                }
                                else if (entity.type === entity_type_1.EntityType.CHEST) {
                                    ctx.drawImage(chest, -chest.width / 4, -chest.height / 4, chest.width / 2, chest.height / 2);
                                    ctx.rotate(-angle);
                                    ctx.fillText(`${item_type_1.ItemType[entity.extra - 1]} x${entity.info}`, 0, 0);
                                    ctx.rotate(angle);
                                }
                                else if (entity.type === entity_type_1.EntityType.CRATE) {
                                    ctx.drawImage(crate, -crate.width / 4, -crate.height / 4, crate.width / 2, crate.height / 2);
                                }
                                else
                                    ctx.arc(0, 0, 25, 0, 2 * Math.PI);
                                ctx.fill();
                                ctx.rotate(-angle);
                                ctx.restore();
                            }
                            for (const player of players) {
                                ctx.save();
                                const angle = utils_1.Utils.convertUintToAngle(player.angle) - Math.PI;
                                ctx.translate(player.realPosition.x - p.realPosition.x + p.camera.width / 2, player.realPosition.y - p.realPosition.y + p.camera.height / 2);
                                ctx.rotate(angle);
                                if (player.inventory.maxSize > 15)
                                    ctx.drawImage(bag, -body.width / 4, -body.height / 4 - 40, body.width / 2, body.height / 2);
                                ctx.drawImage(body, -body.width / 4, -body.height / 4, body.width / 2, body.height / 2);
                                ctx.drawImage(hand, -hand.width / 4 - 50, -hand.height / 4 + 10, hand.width / 2, hand.height / 2);
                                ctx.drawImage(hand, -hand.width / 4 + 50, -hand.height / 4 + 10, hand.width / 2, hand.height / 2);
                                ctx.rotate(-angle);
                                ctx.font = "30px Baloo Paaji 2";
                                ctx.fillStyle = "#fff";
                                ctx.textAlign = "center";
                                ctx.fillText(player.nickname, 0, -50);
                                ctx.restore();
                            }
                            for (const tile of this.server.world.tiles) {
                                switch (tile.type) {
                                    case "a":
                                        {
                                            const img = sprite_manager_1.default.sprites.get("amethyst" + tile.subtype);
                                            ctx.save();
                                            ctx.translate(tile.realPosition.x - p.realPosition.x + p.camera.width / 2, tile.realPosition.y - p.realPosition.y + p.camera.height / 2);
                                            ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);
                                            ctx.restore();
                                        }
                                        break;
                                    case "s":
                                        {
                                            const img = sprite_manager_1.default.sprites.get("stone" + tile.subtype);
                                            ctx.save();
                                            ctx.translate(tile.realPosition.x - p.realPosition.x + p.camera.width / 2, tile.realPosition.y - p.realPosition.y + p.camera.height / 2);
                                            ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);
                                            ctx.restore();
                                        }
                                        break;
                                    case "cs":
                                        {
                                            const img = sprite_manager_1.default.sprites.get("cavestone" + tile.subtype);
                                            ctx.save();
                                            ctx.translate(tile.realPosition.x - p.realPosition.x + p.camera.width / 2, tile.realPosition.y - p.realPosition.y + p.camera.height / 2);
                                            ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);
                                            ctx.restore();
                                        }
                                        break;
                                    case "c":
                                        {
                                            const img = sprite_manager_1.default.sprites.get("cactus" + tile.subtype);
                                            ctx.save();
                                            ctx.translate(tile.realPosition.x - p.realPosition.x + p.camera.width / 2, tile.realPosition.y - p.realPosition.y + p.camera.height / 2);
                                            ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);
                                            ctx.restore();
                                        }
                                        break;
                                    case "g":
                                        {
                                            const img = sprite_manager_1.default.sprites.get("gold" + tile.subtype);
                                            ctx.save();
                                            ctx.translate(tile.realPosition.x - p.realPosition.x + p.camera.width / 2, tile.realPosition.y - p.realPosition.y + p.camera.height / 2);
                                            ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);
                                            ctx.restore();
                                        }
                                        break;
                                    case "d":
                                        {
                                            const img = sprite_manager_1.default.sprites.get("diamond" + tile.subtype);
                                            ctx.save();
                                            ctx.translate(tile.realPosition.x - p.realPosition.x + p.camera.width / 2, tile.realPosition.y - p.realPosition.y + p.camera.height / 2);
                                            ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);
                                            ctx.restore();
                                        }
                                        break;
                                    case "e":
                                        {
                                            const img = sprite_manager_1.default.sprites.get("emerald" + tile.subtype);
                                            ctx.save();
                                            ctx.translate(tile.realPosition.x - p.realPosition.x + p.camera.width / 2, tile.realPosition.y - p.realPosition.y + p.camera.height / 2);
                                            ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);
                                            ctx.restore();
                                        }
                                        break;
                                    case "re":
                                        {
                                            const img = sprite_manager_1.default.sprites.get("reidite" + tile.subtype);
                                            ctx.save();
                                            ctx.translate(tile.realPosition.x - p.realPosition.x + p.camera.width / 2, tile.realPosition.y - p.realPosition.y + p.camera.height / 2);
                                            ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);
                                            ctx.restore();
                                        }
                                        break;
                                    case "f":
                                        {
                                            const img = sprite_manager_1.default.sprites.get("fir" + tile.subtype);
                                            ctx.save();
                                            ctx.translate(tile.realPosition.x - p.realPosition.x + p.camera.width / 2, tile.realPosition.y - p.realPosition.y + p.camera.height / 2);
                                            ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);
                                            ctx.restore();
                                        }
                                        break;
                                    case "plm":
                                        {
                                            const img = sprite_manager_1.default.sprites.get("palm" + tile.subtype);
                                            ctx.save();
                                            ctx.translate(tile.realPosition.x - p.realPosition.x + p.camera.width / 2, tile.realPosition.y - p.realPosition.y + p.camera.height / 2);
                                            ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);
                                            ctx.restore();
                                        }
                                        break;
                                    default: {
                                    }
                                }
                            }
                            const leaderboard = this.server.alivePlayers
                                .sort((a, b) => b.score - a.score)
                                .slice(0, 10);
                            ctx.save();
                            ctx.translate(p.camera.width - 210, 10);
                            ctx.fillStyle = "#1D6055";
                            ctx.globalAlpha = 0.5;
                            ctx.roundRect(0, 0, 200, 270, 8);
                            ctx.fill();
                            ctx.globalAlpha = 1;
                            ctx.font = "20px Baloo Paaji 2";
                            ctx.fillStyle = "white";
                            ctx.textAlign = "left";
                            ctx.fillText("Leaderboard", 50, 25);
                            ctx.textAlign = "left";
                            for (let i = 0; i < leaderboard.length; i++) {
                                ctx.fillText(`${i + 1}  ${leaderboard[i].nickname}`, 0, 25 * (i + 2));
                                ctx.fillText(leaderboard_utils_1.default.simplifyNumber(leaderboard[i].score), 150, 25 * (i + 2));
                            }
                            ctx.restore();
                            const attachment = new discord_js_1.AttachmentBuilder(await canvas.toBuffer(), { name: 'profile-image.png' });
                            await message.channel.send({ files: [attachment] });
                            break;
                        case "kit":
                            {
                                const kit = args[0];
                                const id = Number(args[1]);
                                if (isNaN(id) || !kit) {
                                    break;
                                }
                                const player = this.server.players[id - 1];
                                if (!player || !player.alive)
                                    break;
                                switch (kit) {
                                    case "booster":
                                        if (!this.hasRole("Server Booster", message.member) && !isAdmin) {
                                            await message.channel.send(`You don't have permission to use this command`);
                                            return;
                                        }
                                        if (!this.data.has(message.member.id))
                                            this.data.set(message.member.id, this.startedAt);
                                        if (Date.now() - this.data.get(message.member.id) < 3_600_000 * 3) {
                                            await message.channel.send(`You can't use booster kit until <t:${Math.round((this.data.get(message.member.id) + 3_600_000 * 3) / 1000)}>`);
                                            return;
                                        }
                                        this.data.set(message.member.id, Date.now());
                                        this.server.kitSystem.discordGainKit(player, "booster");
                                        await message.channel.send(`Player with name ${player.nickname} gain booster kit`);
                                        break;
                                    // case "vip":
                                    //     if (this.hasRole("Vip", message.member) || isAdmin) {
                                    //         this.server.kitSystem.discordGainKit(player, "vip");
                                    //         await message.reply(`Player with name ${player.nickname} gain vip kit`);
                                    //     } else await message.reply(`You don't have permission to use this command`);
                                    //     break;
                                    // case "premium":
                                    //     if (this.hasRole("Premium", message.member) || isAdmin) {
                                    //         this.server.kitSystem.discordGainKit(player, "vip");
                                    //         await message.reply(`Player with name ${player.nickname} gain premium kit`);
                                    //     } else await message.reply(`You don't have permission to use this command`);
                                    //     break;
                                }
                            }
                            break;
                    }
                }
            }
            catch (e) {
                console.log(e);
            }
        });
        this.client.once("ready", () => {
            this.server.logger.log("[Discord] Ready!");
        });
        this.client.login(this.server.settings.production ? server_1.discordConfig.prodToken : server_1.discordConfig.devToken);
    }
}
exports.default = DiscordBot;
