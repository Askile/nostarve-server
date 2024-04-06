import Player from "../../../entities/player";
import {Permissions} from "../../../enums/permissions";
import HealthSystem from "../../../attributes/health.system";
import {ActionType} from "../../../enums/types/action.type";
import {StateType} from "../../../enums/types/state.type";

export const identifiers = ["kill"];
export const permission = Permissions.OWNER;
export function run(player: Player, args: string[], isServer: boolean) {
    const id = Number(args[0]);
    const target = this.server.players[id - 1];

    if(!target) {
        return [false, "kill <id>"];
    }

    target.removeState(StateType.GOD_MODE);
    target.inventory.clear(true);
    HealthSystem.damage(target, 200, ActionType.HURT);

    return [true, `${target.nickname} killed ${target.nickname}`];
}