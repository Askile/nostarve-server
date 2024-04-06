import Player from "../../../entities/player";
import {Permissions} from "../../../enums/permissions";

export const identifiers = ["id"];
export const permission = Permissions.PLAYER;
export function run(player: Player, args: string[], isServer: boolean) {
    return [true, player.id.toString()];
}