"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PacketUtils = void 0;
const msgpack_lite_1 = __importDefault(require("msgpack-lite"));
class PacketUtils {
    static decode(player, buffer) {
        const raw = msgpack_lite_1.default.decode(new Uint8Array(buffer));
        const key = raw.pop();
        let packet = [];
        for (let i = 0; i < raw.length; i++) {
            packet.push(raw[i] ^
                key ^
                (player && player.alive ? player.id : 0) ^
                raw.length);
        }
        return msgpack_lite_1.default.decode(new Uint8Array(packet));
    }
}
exports.PacketUtils = PacketUtils;
