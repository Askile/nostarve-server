import Player from "../../../entities/player";
import {Permissions} from "../../../enums/permissions";

export const identifiers = ["teleport-to", "tpt"];
export const permission = Permissions.OWNER;
export function run(player: Player, args: string[], isServer: boolean) {
    const id = Number(args[0]);

    if(!isNaN(id)) {
        const p = this.server.players[id - 1];

        if(!p) return [false, "Player not found."];
        if(p) {
            player.position.set(p.realPosition);
            player.realPosition.set(p.realPosition);
            return [true, "Teleported to " + p.nickname];
        }
    }
}