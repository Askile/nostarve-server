import Player from "../../../entities/player";
import {Permissions} from "../../../enums/permissions";
import Building from "../../../building/building";
import {EntityType} from "../../../enums/types/entity.type";
import {Vector} from "../../../modules/vector";

export const identifiers = ["fsb", "force-spawn-building"];
export const permission = Permissions.OWNER;
export function run(player: Player, args: string[], isServer: boolean) {
    const type = Number(args[0]) || EntityType[args[0].toUpperCase()];
    const x = Number(args[1]);
    const y = Number(args[2]);

    if(isNaN(type) || isNaN(x) || isNaN(y)) {
        return [false, "fsb <type> <x> <y>"];
    }

    const building = new Building(type as any, player, this.server);
    building.position.set(x * 100, y * 100);
    building.realPosition.set(x * 100, y * 100);
    building.onPlaced();

    return [true, `Spawned ${EntityType[type]} to ${x}:${y}`];
}