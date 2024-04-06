import Player from "../../../entities/player";
import {Permissions} from "../../../enums/permissions";

export const identifiers = ["ban"];
export const permission = Permissions.OWNER;

export function run(player: Player, args: string[], isServer: boolean) {
    const id = Number(args[0]);
    const time = Number(args[1]);

    if(isNaN(id) || isNaN(time)) {
        return [false, "ban <id> <time>"]
    }

    const p = this.server.players[id - 1];
    if(!p) {
        return [false, `Player ${id} not found`];
    }

    p.client.ban(time * 1000);
    return [true, `Player ${p.nickname} banned for ${time}s`];
}