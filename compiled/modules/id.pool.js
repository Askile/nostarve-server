"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdPool = void 0;
class IdPool {
    startId;
    used;
    constructor(startId) {
        this.startId = startId;
        this.used = [];
    }
    generate() {
        let i = this.startId;
        while (this.used[++i] === true) { }
        this.used[i] = true;
        return i;
    }
    free(id) {
        this.used[id] = false;
    }
}
exports.IdPool = IdPool;
