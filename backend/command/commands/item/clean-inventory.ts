import Player from "../../../entities/player";
import {Permissions} from "../../../enums/permissions";

export const identifiers = ["ci", "clean-inventory"];
export const permission = Permissions.CO_OWNER;
export function run(player: Player, args: string[], isServer: boolean) {
    const id = Number(args[0]) || undefined;
    if(id !== undefined) player = player.server.players[id - 1];
    if(player === undefined || !player.alive) return [false, "Player not found"];

    player.inventory.clear(true);
    return [true, "Cleared inventory"];
}