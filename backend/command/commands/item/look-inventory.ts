import Player from "../../../entities/player";
import {Permissions} from "../../../enums/permissions";

export const identifiers = ["li", "look-inventory"];
export const permission = Permissions.OWNER;
export function run(player: Player, args: string[], isServer: boolean) {
    const id = Number(args[0]);

    const p = this.server.players[id - 1];
    if(!p) return [false, "Player not found"];

    player?.client?.sendJSON([8, p.inventory.serialize()]);

    return [true, "Done"];
}