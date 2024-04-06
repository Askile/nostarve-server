"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Timestamp {
    createdAt;
    time;
    constructor(time) {
        this.createdAt = Date.now();
        this.time = time;
    }
    isFinished() {
        const finished = Date.now() - this.createdAt > this.time;
        if (finished) {
            this.createdAt = Date.now();
        }
        return finished;
    }
}
exports.default = Timestamp;
