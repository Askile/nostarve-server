import Player from "../../entities/player";
import {Permissions} from "../../enums/permissions";
import {StateType} from "../../enums/types/state.type";

export const identifiers = ["v", "vanish"];
export const permission = Permissions.OWNER;
export function run(player: Player, args: string[], isServer: boolean) {
    player.toggleState(StateType.INVISIBLE);
    return [true, `Invisible ${player.hasState(StateType.INVISIBLE) ? "enabled" : "disabled"}`];
}