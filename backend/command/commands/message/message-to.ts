import Player from "../../../entities/player";
import {Permissions} from "../../../enums/permissions";
import {ClientStringPackets} from "../../../enums/packets";
import PacketSender from "../../../network/packet.sender";

export const identifiers = ["mt", "message-to"];
export const permission = Permissions.OWNER;
export function run(player: Player, args: string[], isServer: boolean) {
    const id = Number(args[0]) || undefined;

    if(id === undefined) return;

    const p = this.server.players[id - 1];

    if(p && p.alive) {
        PacketSender.message(player, args.slice(1).join(" "))
    }
}