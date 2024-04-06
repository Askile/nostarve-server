import Player from "../../../entities/player";
import {Permissions} from "../../../enums/permissions";
import {EntityType} from "../../../enums/types/entity.type";
import HealthSystem from "../../../attributes/health.system";

export const identifiers = ["heal"];
export const permission = Permissions.OWNER;
export function run(player: Player, args: string[], isServer: boolean) {
    if(args.length === 0) {
        HealthSystem.heal(player, 100);
        return [true, `${player.nickname} healed`];
    } else if(args.length === 1) {
        const id = Number(args[0]);
        const p = player.server.players[id - 1];

        if(!p) {
            return [false, "heal <id>"];
        }

        HealthSystem.heal(p, 100);

        return [true, `${p.nickname} healed`];
    } else if(args.length === 2) {
        const id = Number(args[0]);
        const amount = Number(args[1]);

        const p = player.server.players[id - 1];

        if(!p || isNaN(amount)) {
            return [false, "heal <id> <amount>"];
        }

        HealthSystem.heal(p, amount);
    }
    HealthSystem.heal(player, 100);
}