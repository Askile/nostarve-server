import Player from "../../../entities/player";
import {Permissions} from "../../../enums/permissions";
import {ItemType} from "../../../enums/types/item.type";

export const identifiers = ["ri", "remove-item"];
export const permission = Permissions.OWNER;
export function run(player: Player, args: string[], isServer: boolean) {
    if(args.length < 2) return [false, "ri <id> <item> [count]"];

    const id = Number(args[0]) || undefined;
    const itemId = Number(args[1]) || Number(ItemType[args[1].toUpperCase()]) || undefined;
    const count = Number(args[2]) || 1;

    const p = this.server.players[id - 1];
    if(!p || !p.alive) {
        return [false, "Player not found"];
    }

    if(
        itemId === undefined ||
        id === undefined
    ) {
        return [false, "give <id> <item> [count]"];
    }

    p.inventory.decrease(itemId, count, true);
    return [true, `Added ${count}x ${ItemType[itemId]} to ${p.nickname}`];
}