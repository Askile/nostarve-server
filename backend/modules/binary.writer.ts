export class BinaryWriter {
    private _buffer: Buffer;
    private _length: number;

    constructor(size?: number) {
        if (!size || size <= 0) {
            size = Buffer.poolSize / 2;
        }
        this._buffer = Buffer.alloc(size);
        this._length = 0;
    }

    public writeUInt8(...values: number[]): void {
        for (const value of values) {
            this.checkAlloc(1);
            this._buffer[this._length++] = value;
        }
    }

    public writeUInt16(...values: number[]): void {
        for (const value of values) {
            this.checkAlloc(2);
            this._buffer[this._length++] = value;
            this._buffer[this._length++] = value >> 8;
        }
    }

    public writeUInt32(...values: number[]): void {
        for (const value of values) {
            this.checkAlloc(4);
            this._buffer[this._length++] = value;
            this._buffer[this._length++] = value >> 8;
            this._buffer[this._length++] = value >> 16;
            this._buffer[this._length++] = value >> 24;
        }
    }

    public writeFloat(value: number): void {
        this.checkAlloc(4);
        this._buffer.writeFloatLE(value, this._length);
        this._length += 4;
    }

    public writeDouble(value: number): void {
        this.checkAlloc(8);
        this._buffer.writeDoubleLE(value, this._length);
        this._length += 8;
    }

    public writeBytes(data: Buffer): void {
        this.checkAlloc(data.length);
        data.copy(this._buffer, this._length, 0, data.length);
        this._length += data.length;
    }

    public writeStringUtf8(value: string): void {
        const length = Buffer.byteLength(value, "utf8");
        this.checkAlloc(length);
        this._buffer.write(value, this._length, "utf8");
        this._length += length;
    }

    public writeStringUnicode(value: string): void {
        const length = Buffer.byteLength(value, "ucs2");
        this.checkAlloc(length);
        this._buffer.write(value, this._length, "ucs2");
        this._length += length;
    }

    public writeStringZeroUtf8(value: string): void {
        this.writeStringUtf8(value);
        this.writeUInt8(0);
    }

    public writeStringZeroUnicode(value: string): void {
        this.writeStringUnicode(value);
        this.writeUInt16(0);
    }

    public getLength(): number {
        return this._length;
    }

    public reset(): void {
        this._length = 0;
    }

    public toBuffer(): Buffer {
        return Buffer.concat([this._buffer.slice(0, this._length)]);
    }

    private checkAlloc(size: number): void {
        const needed = this._length + size;
        if (this._buffer.length >= needed) return;
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
