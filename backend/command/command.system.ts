import fs from "fs";
import path from "path";
import Player from "../entities/player";
import {Command} from "./command";
import {Server} from "../server";
import PacketSender from "../network/packet.sender";


export default class CommandSystem {
    public server: Server;
    public commands: Map<string, Command>;
    constructor(server: Server) {
        this.server = server;
        this.commands = new Map<string, Command>();

        this.readCommands();
    }

    private readCommands(folderPath = path.join(__dirname, 'commands')) {
        const items = fs.readdirSync(folderPath);
        for (const item of items) {
            const itemPath = path.join(folderPath, item);
            const stats = fs.statSync(itemPath);
            if (stats.isDirectory()) {
                this.readCommands(itemPath);
            } else if (stats.isFile() && item.endsWith('.js')) {
                const command = require(itemPath) as Command;
                if(command.identifiers?.length && typeof command.run === "function") {
                    this.registerCommand(command);
                } else {
                    this.server.logger.error("[CommandSystem] Invalid command from path: " + itemPath);
                }
            }
        }
    }
    public registerCommand(command: Command) {
        // this.server.logger.log("[CommandSystem] Registered command: " + command.identifiers.join(" "));
        for (const id of command.identifiers) {
            this.commands.set(id, command);
        }
    }
    public handleCommand(player: Player, rawCommand: string) {
        const command = this.replace(player, rawCommand);
        const args = command.split(" ");

        if(args.length < 1) return;

        const type = args.shift();

        if(this.commands.has(type)) {
            const cmd = this.commands.get(type);
            if(player.permission < cmd.permission) return;

            const response = cmd
                .run
                .bind(this)(player, args, false);

            this.server.logger.log(`[Command] ${player.nickname} issued command: ${command}`);
            if(response) {
                PacketSender.command(player, response[1], response[0], type);
            }
        }
    }

    public handleServerCommand(rawCommand: string, player?: Player) {
        const command = this.replace(player, rawCommand);
        const args = command.split(" ");

        if(args.length < 1) return;

        const type = args.shift();

        if(this.commands.has(type)) {
            const cmd = this.commands.get(type);

            cmd.run.bind(this)(player, args, true);
        }
    }

    private replace(player: Player, rawCommand: string) {
        if(!this.server.alivePlayers.length) return rawCommand;

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

        if(player) {
            result = result.replace(/\$id/g, player.id.toString())
                .replace(/\$score/g, player.score.toString())
                .replace(/\$kills/g, player.kills.toString())
                .replace(/\$day/g, player.time.toString())
                .replace(/\$name/g, player.nickname)
        }

        const matches = result.match(/\$rand\[(.*?)]/g);

        if(matches) {
            for (const match of matches) {
                try {
                    const array = JSON.parse(match.slice(5));
                    result = result.replace(match, array[Math.floor(Math.random() * array.length)]);
                } catch {}
            }
        }

        return result;
    }
}