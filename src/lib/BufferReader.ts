// export to gh as typescript-buffer-reader

import * as iconv from 'iconv-lite';

export class BufferReader {
    constructor(public buffer: Buffer, public startOffset = 0) {
    }
    
    public hasByteAvailable():boolean{
        return (this.startOffset + 1) < this.buffer.length;
    }

    private checkForAvailableBytes(count: number) {
        if ((this.startOffset + count) > this.buffer.length) {
            let exceedCount = this.buffer.length - (this.startOffset + count);
            let error = new Error(`Buffer has length of ${this.buffer.length} bytes and I was asked to read ${count} bytes at offset ${this.startOffset}. I can't do that since it is beyond the buffer.`);
            throw error;
        }
    }

    public readAsciiChar() {
        this.checkForAvailableBytes(1);
        let charBuffer = this.buffer.slice(this.startOffset, this.startOffset + 1);
        let returnValue = iconv.decode(charBuffer, 'ascii');
        this.startOffset += 1;
        return returnValue;
    }

    public skip(count: number) {
        this.checkForAvailableBytes(count);
        this.startOffset += count;
    }
    
    public seek(offset: number){
        this.startOffset = offset;
    }

    public readStringZeroTerminated(encoding: string): string {
        let charCount = this.findZeroOffset();
        let returnValue = this.readString(charCount, encoding);
        this.startOffset++;

        return returnValue;
    }

    private findZeroOffset(): number {
        // Count characters
        let workingOffset = this.startOffset;
        while (this.buffer[workingOffset] != 0) {
            workingOffset++;
        }

        return workingOffset;
    }

    public readString(length: number, encoding: string) {
        let stringBuffer = this.buffer.slice(this.startOffset, this.startOffset + length);
        let returnValue = iconv.decode(stringBuffer, encoding);
        this.startOffset += length;

        return returnValue;
    }

    public readStringSkipZeros(length: number, encoding: string) {
        let zeroOffset = this.findZeroOffset();
        let stringBuffer = this.buffer.slice(this.startOffset, zeroOffset);
        let returnValue = iconv.decode(stringBuffer, encoding);
        this.startOffset += length;

        return returnValue;
    }

    public readBoolean() {
        this.checkForAvailableBytes(1);
        let returnValue = this.buffer[this.startOffset] != 0;
        this.startOffset += 1;
        return returnValue;
    }

    public readByte() {
        this.checkForAvailableBytes(1);
        let returnValue = this.buffer[this.startOffset];
        this.startOffset += 1;
        return returnValue;
    }

    public readBytes(count: number): Buffer {
        this.checkForAvailableBytes(count);
        let returnValue = this.buffer.slice(this.startOffset, count);
        this.startOffset += count;
        return returnValue;
    }

    public read32bitUInt() {
        this.checkForAvailableBytes(4);
        let returnValue = this.buffer.readUInt32LE(this.startOffset, true);
        this.startOffset += 4;
        return returnValue;
    };

    public read16bUInt() {
        this.checkForAvailableBytes(2);
        let returnValue = this.buffer.readUInt16LE(this.startOffset, true);
        this.startOffset += 2;
        return returnValue;
    };

    public readDate() {
        this.checkForAvailableBytes(3);
        let year = 1900 + this.buffer[this.startOffset];
        let month = this.buffer[this.startOffset + 1] - 1;
        let day = this.buffer[this.startOffset + 2];
        this.startOffset += 3;

        let date = new Date(year, month, day);
        return date;
    };
} 