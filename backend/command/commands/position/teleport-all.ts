import Player from "../../../entities/player";
import {Permissions} from "../../../enums/permissions";

export const identifiers = ["tpa", "teleport-all"];
export const permission = Permissions.OWNER;
export function run(player: Player, args: string[], isServer: boolean) {
    const x = Number(args[0]) || undefined;
    const y = Number(args[1]) || undefined;

    if (x === undefined || y === undefined) {
        return [false, "tpa <x> <y>"];
    }

    for (const p of player.server.alivePlayers) {
        p.position.x = x * 100 + 50;
        p.position.y = y * 100 + 50;
        p.realPosition.set(p.position);
    }

    return [true, `Teleported ${player.server.alivePlayers.length} players to ${x}:${y}`];
}