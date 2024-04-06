import Player from "../../../entities/player";
import {Permissions} from "../../../enums/permissions";

export const identifiers = ["dch", "disable-chat"];
export const permission = Permissions.OWNER;
export function run(player: Player, args: string[], isServer: boolean) {
    this.server.config.disable_chat = this.server.config.disable_chat === 1 ? 0 : 1;

    return [true, "Chat is now " + (this.server.config.disable_chat === 1 ? "disabled" : "enabled")];
}