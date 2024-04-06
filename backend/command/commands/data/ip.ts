import Player from "../../../entities/player";
import {Permissions} from "../../../enums/permissions";

export const identifiers = ["ip"];
export const permission = Permissions.PLAYER;

export function run(player: Player, args: string[], isServer: boolean) {
    return [true, "Ur ip: " + player?.client?.ip?.address];
}