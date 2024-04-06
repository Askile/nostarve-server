"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vector = void 0;
class Vector {
    x;
    y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    distance(v) {
        return Math.hypot(this.x - v.x, this.y - v.y);
    }
    isVectorInsideRectangle(v, rectangleWidth, rectangleHeight) {
        const minX = this.x;
        const maxX = this.x + rectangleWidth;
        const minY = this.y;
        const maxY = this.y + rectangleHeight;
        const x = v.x + rectangleWidth / 2;
        const y = v.y + rectangleHeight / 2;
        return (x >= minX &&
            x <= maxX &&
            y >= minY &&
            y <= maxY);
    }
    angle(v) {
        return Math.atan2(this.y - v.y, this.x - v.x);
    }
    add(v) {
        return new Vector(this.x + v.x, this.y + v.y);
    }
    subtract(v) {
        return new Vector(this.x - v.x, this.y - v.y);
    }
    divide(divisor) {
        return new Vector(this.x / divisor, this.y / divisor);
    }
    multiply(scalar) {
        return new Vector(this.x * scalar, this.y * scalar);
    }
    equal(v) {
        return this.x === v.x && this.y === v.y;
    }
    build(delta, angle) {
        return new Vector(Math.cos(angle) * delta, Math.sin(angle) * delta);
    }
    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    normalize() {
        const length = this.magnitude();
        if (length === 0) {
            return new Vector(0, 0);
        }
        return new Vector(this.x / length, this.y / length);
    }
    clamp(minX, minY, maxX, maxY) {
        return new Vector(Math.max(minX, Math.min(maxX, this.x)), Math.max(minY, Math.min(maxY, this.y)));
    }
    floor() {
        return new Vector(Math.floor(this.x), Math.floor(this.y));
    }
    clone() {
        return new Vector(this.x, this.y);
    }
    set(v, y) {
        if (typeof v === "number") {
            this.x = v;
            this.y = y;
        }
        else {
            this.x = v.x;
            this.y = v.y;
        }
    }
    sign(n) {
        if (n < 0)
            return -1;
        else
            return 1;
    }
    scalar_product(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y;
    }
    cross_product(v1, v2) {
        return v1.x * v2.y - v1.y * v2.x;
    }
    get_angle(v1, v2) {
        return Math.acos(this.scalar_product(v1, v2) / (v1.magnitude() * v2.magnitude())) * this.sign(this.cross_product(v1, v2));
    }
    static get_angle(v1, v2) {
        return Math.acos(v1.scalar_product(v1, v2) / (v1.magnitude() * v2.magnitude())) * v1.sign(v2.cross_product(v1, v2));
    }
    getStandardAngle(v) {
        return Vector.get_angle(new Vector(1, 0), this.subtract(v));
    }
    static zero() {
        return new Vector(0, 0);
    }
}
exports.Vector = Vector;
