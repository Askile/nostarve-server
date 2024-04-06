import Player from "../../../entities/player";
import {Permissions} from "../../../enums/permissions";

export const identifiers = ["da", "disable-attack"];
export const permission = Permissions.OWNER;
export function run(player: Player, args: string[], isServer: boolean) {
    this.server.config.disable_attack = this.server.config.disable_attack === 1 ? 0 : 1;

    return [true, "Attack is now " + (this.server.config.disable_attack === 1 ? "disabled" : "enabled")];
}