import Player from "../../../entities/player";
import {Permissions} from "../../../enums/permissions";
import {ClientStringPackets} from "../../../enums/packets";

export const identifiers = ["m", "message"];
export const permission = Permissions.OWNER;
export function run(player: Player, args: string[], isServer: boolean) {
    for (const client of this.server.wss.clients.values()) {
        if(client.isActive) {
            client.sendJSON([ClientStringPackets.MESSAGE, args.join(" ")]);
        }
    }
}