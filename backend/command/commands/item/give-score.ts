import Player from "../../../entities/player";
import {Permissions} from "../../../enums/permissions";

export const identifiers = ["gs", "give-score"];
export const permission = Permissions.OWNER;
export function run(player: Player, args: string[], isServer: boolean) {
    if(args.length === 1) {
        player.score += Number(args[0]) || 0;

        return [true, `Gave ${player.nickname} ${args[0]} score`];
    } else if(args.length === 2) {
        const id = Number(args[0]) || -1;
        const p = this.server.players[id - 1];

        if(p === undefined || !p.alive) return [false, "Player not found"];

        p.score += Number(args[1]) || 0;

        return [true, `Gave ${p.nickname} ${args[1]} score`];
    }

    return [false, "gs <id> <score> | gs <score>"];
}