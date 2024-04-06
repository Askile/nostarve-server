import Player from "../../../entities/player";
import {Permissions} from "../../../enums/permissions";
import {ItemType} from "../../../enums/types/item.type";

export const identifiers = ["ria", "remove-item-all"];
export const permission = Permissions.OWNER;
export function run(player: Player, args: string[], isServer: boolean) {
    const id = Number(args[0]) || ItemType[args[0].toUpperCase()] || undefined;
    const count = Number(args[1]) || undefined;

    if(id === undefined || count === undefined) {
        return [false, "ria <id> <count>"];
    }

    let playersWithItem = 0;
    for (const player of this.server.alivePlayers) {

        if(player.inventory.contains(id)) {
            playersWithItem++;
        }

        player.inventory.decrease(id, count, true);
    }

    return [true, `Removed x${count} ${ItemType[id]} from ${playersWithItem} players`];
}