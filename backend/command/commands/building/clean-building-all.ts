import Player from "../../../entities/player";
import {Permissions} from "../../../enums/permissions";
import Building from "../../../building/building";

export const identifiers = ["cba", "clean-building-all"];
export const permission = Permissions.OWNER;
export function run(player: Player, args: string[], isServer: boolean) {
    let count = 0;
    let sx = Number(args[0]);
    let sy = Number(args[1]);
    let ex = Number(args[2]);
    let ey = Number(args[3]);

    if(isNaN(sx) || isNaN(sy) || isNaN(ex) || isNaN(ey)) {
        for (const entity of Object.values(this.server.entities)) {
            if(entity instanceof Building && entity.owner) {
                count++;
                entity.delete();
                entity.onDead();
            }
        }
    } else  {
        sx = Math.floor(sx) * 100 + 50;
        sy = Math.floor(sy) * 100 + 50;
        ex = Math.floor(ex) * 100 + 50;
        ey = Math.floor(ey) * 100 + 50;
        for (const entity of Object.values(this.server.entities)) {
            if(entity instanceof Building && entity.owner && entity.position.x >= sx && entity.position.y >= sy && entity.position.x <= ex && entity.position.y <= ey) {
                count++;
                entity.delete();
                entity.onDead();
            }
        }
    }


    return [true, `Cleaned ${count} buildings`];
}