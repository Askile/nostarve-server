import msgpack from "msgpack-lite";
import Player from "../entities/player";

export class PacketUtils {
    public static decode(player: Player, buffer: ArrayBuffer) {
        const raw = msgpack.decode(new Uint8Array(buffer));
        const key = raw.pop();
        let packet = [];

        for (let i = 0; i < raw.length; i++) {
            packet.push(
                raw[i] ^
                key ^
                (player && player.alive ? player.id : 0) ^
                raw.length
            );
        }


        return msgpack.decode(new Uint8Array(packet));
    }

}