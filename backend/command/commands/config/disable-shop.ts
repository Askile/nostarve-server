import Player from "../../../entities/player";
import {Permissions} from "../../../enums/permissions";

export const identifiers = ["ds", "disable-shop"];
export const permission = Permissions.OWNER;
export function run(player: Player, args: string[], isServer: boolean) {
    this.server.config.disable_shop = this.server.config.disable_shop === 1 ? 0 : 1;

    return [true, "Market is now " + (this.server.config.disable_shop === 1 ? "disabled" : "enabled")];
}