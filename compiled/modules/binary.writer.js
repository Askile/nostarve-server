"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinaryWriter = void 0;
class BinaryWriter {
    _buffer;
    _length;
    constructor(size) {
        if (!size || size <= 0) {
            size = Buffer.poolSize / 2;
        }
        this._buffer = Buffer.alloc(size);
        this._length = 0;
    }
    writeUInt8(...values) {
        for (const value of values) {
            this.checkAlloc(1);
            this._buffer[this._length++] = value;
        }
    }
    writeUInt16(...values) {
        for (const value of values) {
            this.checkAlloc(2);
            this._buffer[this._length++] = value;
            this._buffer[this._length++] = value >> 8;
        }
    }
    writeUInt32(...values) {
        for (const value of values) {
            this.checkAlloc(4);
            this._buffer[this._length++] = value;
            this._buffer[this._length++] = value >> 8;
            this._buffer[this._length++] = value >> 16;
            this._buffer[this._length++] = value >> 24;
        }
    }
    writeFloat(value) {
        this.checkAlloc(4);
        this._buffer.writeFloatLE(value, this._length);
        this._length += 4;
    }
    writeDouble(value) {
        this.checkAlloc(8);
        this._buffer.writeDoubleLE(value, this._length);
        this._length += 8;
    }
    writeBytes(data) {
        this.checkAlloc(data.length);
        data.copy(this._buffer, this._length, 0, data.length);
        this._length += data.length;
    }
    writeStringUtf8(value) {
        const length = Buffer.byteLength(value, "utf8");
        this.checkAlloc(length);
        this._buffer.write(value, this._length, "utf8");
        this._length += length;
    }
    writeStringUnicode(value) {
        const length = Buffer.byteLength(value, "ucs2");
        this.checkAlloc(length);
        this._buffer.write(value, this._length, "ucs2");
        this._length += length;
    }
    writeStringZeroUtf8(value) {
        this.writeStringUtf8(value);
        this.writeUInt8(0);
    }
    writeStringZeroUnicode(value) {
        this.writeStringUnicode(value);
        this.writeUInt16(0);
    }
    getLength() {
        return this._length;
    }
    reset() {
        this._length = 0;
    }
    toBuffer() {
        return Buffer.concat([this._buffer.slice(0, this._length)]);
    }
    checkAlloc(size) {
        const needed = this._length + size;
        if (this._buffer.length >= needed)
            return;
        const chunk = Math.max(Buffer.poolSize / 2, 1024);
        let chunkCount = (needed / chunk) >>> 0;
        if (needed % chunk > 0) {
            chunkCount += 1;
        }
        const buffer = Buffer.alloc(chunkCount * chunk);
        this._buffer.copy(buffer, 0, 0, this._length);
        this._buffer = buffer;
    }
}
exports.BinaryWriter = BinaryWriter;
