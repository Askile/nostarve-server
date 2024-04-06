"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const packet_sender_1 = __importDefault(require("../network/packet.sender"));
class CommandSystem {
    server;
    commands;
    constructor(server) {
        this.server = server;
        this.commands = new Map();
        this.readCommands();
    }
    readCommands(folderPath = path_1.default.join(__dirname, 'commands')) {
        const items = fs_1.default.readdirSync(folderPath);
        for (const item of items) {
            const itemPath = path_1.default.join(folderPath, item);
            const stats = fs_1.default.statSync(itemPath);
            if (stats.isDirectory()) {
                this.readCommands(itemPath);
            }
            else if (stats.isFile() && item.endsWith('.js')) {
                const command = require(itemPath);
                if (command.identifiers?.length && typeof command.run === "function") {
                    this.registerCommand(command);
                }
                else {
                    this.server.logger.error("[CommandSystem] Invalid command from path: " + itemPath);
                }
            }
        }
    }
    registerCommand(command) {
        // this.server.logger.log("[CommandSystem] Registered command: " + command.identifiers.join(" "));
        for (const id of command.identifiers) {
            this.commands.set(id, command);
        }
    }
    handleCommand(player, rawCommand) {
        const command = this.replace(player, rawCommand);
        const args = command.split(" ");
        if (args.length < 1)
            return;
        const type = args.shift();
        if (this.commands.has(type)) {
            const cmd = this.commands.get(type);
            if (player.permission < cmd.permission)
                return;
            const response = cmd
                .run
                .bind(this)(player, args, false);
            this.server.logger.log(`[Command] ${player.nickname} issued command: ${command}`);
            if (response) {
                packet_sender_1.default.command(player, response[1], response[0], type);
            }
        }
    }
    handleServerCommand(rawCommand, player) {
        const command = this.replace(player, rawCommand);
        const args = command.split(" ");
        if (args.length < 1)
            return;
        const type = args.shift();
        if (this.commands.has(type)) {
            const cmd = this.commands.get(type);
            cmd.run.bind(this)(player, args, true);
        }
    }
    replace(player, rawCommand) {
        if (!this.server.alivePlayers.length)
            return rawCommand;
        const bestKill = this.server.alivePlayers.sort((a, b) => b.kills - a.kills)[0];
        const bestTime = this.server.alivePlayers.sort((a, b) => b.time - a.time)[0];
        const bestScore = this.server.alivePlayers.sort((a, b) => b.score - a.score)[0];
        let result = rawCommand
            .replace(/\$tps/g, this.server.ticker.tps?.toString())
            .replace(/\$best-kill-name/g, bestKill.nickname)
            .replace(/\$best-kill-id/g, bestKill.id.toString())
            .replace(/\$best-kill-score/g, bestKill.score.toString())
            .replace(/\$best-kill-day/g, bestKill.time.toString())
            .replace(/\$best-kill-kill/g, bestKill.kills.toString())
            .replace(/\$best-day-name/g, bestTime.nickname)
            .replace(/\$best-day-id/g, bestTime.id.toString())
            .replace(/\$best-day-score/g, bestTime.score.toString())
            .replace(/\$best-day-day/g, bestTime.time.toString())
            .replace(/\$best-day-kill/g, bestTime.kills.toString())
            .replace(/\$best-score-name/g, bestScore.nickname)
            .replace(/\$best-score-id/g, bestScore.id.toString())
            .replace(/\$best-score-score/g, bestScore.score.toString())
            .replace(/\$best-score-day/g, bestScore.time.toString())
            .replace(/\$best-score-kill/g, bestScore.kills.toString());
        if (player) {
            result = result.replace(/\$id/g, player.id.toString())
                .replace(/\$score/g, player.score.toString())
                .replace(/\$kills/g, player.kills.toString())
                .replace(/\$day/g, player.time.toString())
                .replace(/\$name/g, player.nickname);
        }
        const matches = result.match(/\$rand\[(.*?)]/g);
        if (matches) {
            for (const match of matches) {
                try {
                    const array = JSON.parse(match.slice(5));
                    result = result.replace(match, array[Math.floor(Math.random() * array.length)]);
                }
                catch { }
            }
        }
        return result;
    }
}
exports.default = CommandSystem;
