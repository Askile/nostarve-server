import {Vector} from "../modules/vector";

export class Biome {
    public position: Vector;
    public endPosition: Vector;
    public size: Vector;
    public meta: number;
    public type: string;
    constructor(type: string, position: Vector, size: Vector, meta?: number) {
        this.type = type;
        this.position = position;
        this.size = size;
        this.endPosition = this.position.add(this.size);
        this.meta = meta ?? 0;
    }
}
