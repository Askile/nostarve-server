export class Vector {
    public x: number;
    public y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    public distance(v: Vector) {
        return Math.hypot(this.x - v.x , this.y - v.y);
    }

    public isVectorInsideRectangle(v: Vector, rectangleWidth: number, rectangleHeight: number): boolean {
        const minX = this.x;
        const maxX = this.x + rectangleWidth;
        const minY = this.y;
        const maxY = this.y + rectangleHeight;

        const x = v.x + rectangleWidth / 2;
        const y = v.y + rectangleHeight / 2;

        return (
            x >= minX &&
            x <= maxX &&
            y >= minY &&
            y <= maxY
        );
    }

    public angle(v: Vector) {
        return Math.atan2(this.y - v.y, this.x - v.x);
    }

    public add(v: Vector) {
        return new Vector(this.x + v.x, this.y + v.y);
    }
    public subtract(v: Vector) {
        return new Vector(this.x - v.x, this.y - v.y);
    }
    public divide(divisor: number) {
        return new Vector(this.x / divisor, this.y / divisor);
    }
    public multiply(scalar: number) {
        return new Vector(this.x * scalar, this.y * scalar);
    }
    public equal(v: Vector) {
        return this.x === v.x && this.y === v.y;
    }
    public build(delta: number, angle: number) {
        return new Vector(Math.cos(angle) * delta, Math.sin(angle) * delta);
    }
    public magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    public normalize() {
        const length = this.magnitude();
        if(length === 0) {
            return new Vector(0, 0);
        }
        return new Vector(this.x / length, this.y / length);
    }
    public clamp(minX: number, minY: number, maxX: number, maxY: number) {
        return new Vector(Math.max(minX, Math.min(maxX, this.x)), Math.max(minY, Math.min(maxY, this.y)))
    }
    public floor() {
        return new Vector(Math.floor(this.x), Math.floor(this.y));
    }
    public clone() {
        return new Vector(this.x, this.y);
    }
    public set(x: number, y: number): void;
    public set(v: Vector): void;
    public set(v: Vector | number, y?: number) {
        if(typeof v === "number") {
            this.x = v;
            this.y = y!;
        } else {
            this.x = v.x;
            this.y = v.y;
        }
    }
    public sign(n: number) {
        if(n < 0) return -1;
        else return 1;
    }
    public scalar_product(v1: Vector, v2: Vector) {
        return v1.x * v2.x + v1.y * v2.y;
    }
    public cross_product(v1: Vector, v2: Vector) {
        return v1.x * v2.y - v1.y * v2.x;
    }
    public get_angle(v1: Vector, v2: Vector) {
        return Math.acos(this.scalar_product(v1, v2) / (v1.magnitude() * v2.magnitude())) * this.sign(this.cross_product(v1, v2));
    }
    public static get_angle(v1: Vector, v2: Vector) {
        return Math.acos(v1.scalar_product(v1, v2) / (v1.magnitude() * v2.magnitude())) * v1.sign(v2.cross_product(v1, v2));
    }
    public getStandardAngle(v: Vector) {
        return Vector.get_angle(new Vector(1, 0), this.subtract(v));
    }
    public static zero() {
        return new Vector(0, 0);
    }
}