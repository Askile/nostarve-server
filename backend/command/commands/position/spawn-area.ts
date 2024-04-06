import Player from "../../../entities/player";
import {Permissions} from "../../../enums/permissions";
import {Vector} from "../../../modules/vector";

export const identifiers = ["spawn-area"];
export const permission = Permissions.OWNER;
export function run(player: Player, args: string[], isServer: boolean) {
    const x = Number(args[0]) || undefined;
    const y = Number(args[1]) || undefined;

    if(x === undefined || y === undefined) return [false, "spawn-area <x> <y>"];

    this.server.spawner.spawnPoint = new Vector(x * 100 + 50, y * 100 + 50);
    for (const player of this.server.players) {
        if(!player.alive) {
            player.realPosition.set(this.server.spawner.spawnPoint);
            player.position.set(this.server.spawner.spawnPoint);
        }
    }
}