import Player from "../../../entities/player";
import {Permissions} from "../../../enums/permissions";
import {Server} from "../../../server";

export const identifiers = ["cia", "clean-inventory-all"];
export const permission = Permissions.CO_OWNER;
export function run(player: Player, args: string[]) {
    for (const player of this.server.alivePlayers) {
        player.inventory.clear(true);
    }

    return [true, "Cleared inventory from " + this.server.alivePlayers.length + " players"];
}