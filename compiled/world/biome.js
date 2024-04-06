"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Biome = void 0;
class Biome {
    position;
    endPosition;
    size;
    meta;
    type;
    constructor(type, position, size, meta) {
        this.type = type;
        this.position = position;
        this.size = size;
        this.endPosition = this.position.add(this.size);
        this.meta = meta ?? 0;
    }
}
exports.Biome = Biome;
