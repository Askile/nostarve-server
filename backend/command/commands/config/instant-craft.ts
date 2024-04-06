import Player from "../../../entities/player";
import {Permissions} from "../../../enums/permissions";
import {RECIPES} from "../../../default/default.recipes";
import CraftSystem from "../../../craft/craft.system";

export const identifiers = ["instant-craft"];
export const permission = Permissions.OWNER;
export function run(player: Player, args: string[], isServer: boolean) {
    this.server.config.instant_craft = this.server.config.instant_craft === 1 ? 0 : 1

    for (let i = 0; i < this.server.craftSystem.crafts.length; i++) {
        const craft = this.server.craftSystem.crafts[i];
        if(!craft) continue;

        craft.time = this.server.config.instant_craft === 1 ? 0 : RECIPES[i].time;
    }

    return [true, "Instant craft " + (this.server.config.instant_craft === 1 ? "enabled" : "disabled")];
}