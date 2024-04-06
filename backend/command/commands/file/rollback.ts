import Player from "../../../entities/player";
import {Permissions} from "../../../enums/permissions";

export const identifiers = ["rollback"];
export const permission = Permissions.OWNER;

export function run(player: Player, args: string[], isServer: boolean) {
    const idx = Number(args[0]);

    if(isNaN(idx)) {
        return [false, "Invalid index"];
    } else {
        this.server.saveSystem.load(idx);
        this.server.logger.log(`[Rollback] Rolling back to ${args[0]}`);
        return [true, "Rollbacked to " + args[0]];
    }
}