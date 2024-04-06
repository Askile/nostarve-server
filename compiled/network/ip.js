"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IP = void 0;
class IP {
    address;
    connectionAmount;
    jps;
    connectedThisTime;
    packetsQty;
    banTime;
    attempts;
    constructor(address) {
        this.address = address;
        this.jps = 0;
        this.connectionAmount = 0;
        this.connectedThisTime = 0;
        this.packetsQty = [];
        this.attempts = 5;
        this.banTime = 0;
    }
}
exports.IP = IP;
