import Player from "../../../entities/player";
import {Permissions} from "../../../enums/permissions";

export const identifiers = ["tps"];
export const permission = Permissions.PLAYER;
export function run(player: Player, args: string[], isServer: boolean) {
    return [true, player.server.ticker.tps.toString()];
}