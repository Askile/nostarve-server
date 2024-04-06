import Player from "../../../entities/player";
import {Permissions} from "../../../enums/permissions";
import Building from "../../../building/building";
import {EntityType} from "../../../enums/types/entity.type";
import {Vector} from "../../../modules/vector";

export const identifiers = ["ffb", "force-fill-building"];
export const permission = Permissions.OWNER;
export function run(player: Player, args: string[], isServer: boolean) {
    const type = Number(args[0]) || EntityType[args[0].toUpperCase()] || undefined;
    const sx = Number(args[1]) || undefined;
    const sy = Number(args[2]) || undefined;
    const ex = Number(args[3]) || undefined;
    const ey = Number(args[4]) || undefined;

    if(type === undefined || sx === undefined || sy === undefined || ex === undefined || ey === undefined) {
        return [false, "ffb <type> <sx> <sy> <ex> <ey>"];
    }

    for(let x = sx; x < ex + 1; x++) {
        for(let y = sy; y < ey + 1; y++) {
            const building = new Building(type as any, player, this.server);

            building.position.set(x * 100 + 50, y * 100 + 50);
            building.onPlaced();
        }
    }

    return [true, `Spawned ${EntityType[type]} from ${sx}:${sy} to ${ex}:${ey}`];
}