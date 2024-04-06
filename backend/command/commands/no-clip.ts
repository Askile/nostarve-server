import Player from "../../entities/player";
import {Permissions} from "../../enums/permissions";

export const identifiers = ["nc", "no-clip"];
export const permission = Permissions.OWNER;
export function run(player: Player, args: string[], isServer: boolean) {
    player.radius = player.radius === 25 ? -1000 : 25;
    return [true, `No-clip ${player.radius === 25 ? "disabled" : "enabled"}`];
}