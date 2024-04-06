import Player from "../../entities/player";
import {Permissions} from "../../enums/permissions";

export const identifiers = ["save"];
export const permission = Permissions.OWNER;
export function run(player: Player, args: string[], isServer: boolean) {
    this.server.saveSystem.save();
}