import Player from "../../../entities/player";
import {Permissions} from "../../../enums/permissions";
import {StateType} from "../../../enums/types/state.type";

export const identifiers = ["gm", "godmode"];
export const permission = Permissions.OWNER;
export function run(player: Player, args: string[], isServer: boolean) {
    player.toggleState(StateType.GOD_MODE);
    return [true, `God mode ${player.hasState(StateType.GOD_MODE) ? "enabled" : "disabled"}`];
}