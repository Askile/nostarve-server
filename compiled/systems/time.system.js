"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeSystem = void 0;
const binary_writer_1 = require("../modules/binary.writer");
const world_time_1 = require("../enums/world.time");
const packets_1 = require("../enums/packets");
class TimeSystem {
    CYCLE = 8 * 60 * 1000;
    server;
    time;
    sent = false;
    clock = Date.now();
    constructor(server) {
        this.server = server;
        this.time = 0;
    }
    tick() {
        const time = this.getGameTime();
        if (time > this.CYCLE / 2 && !this.sent) {
            this.time = world_time_1.WorldTime.NIGHT;
            this.sent = true;
            this.send();
        }
        if (time > this.CYCLE) {
            this.time = world_time_1.WorldTime.DAY;
            this.sent = false;
            this.clock = Date.now();
            this.send();
        }
    }
    getGameTime() {
        return Date.now() - this.clock;
    }
    send() {
        const writer = new binary_writer_1.BinaryWriter(2);
        writer.writeUInt8(packets_1.ClientPackets.GET_TIME);
        writer.writeUInt8(this.time);
        this.server.broadcast(writer.toBuffer(), true);
    }
}
exports.TimeSystem = TimeSystem;
