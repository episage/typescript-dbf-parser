import * as Models from './Models';
import {BufferReader} from './BufferReader';

import * as fs from 'fs';

export class DbtReader {
    constructor(public memoFileDescriptior: any, public encoding: string) {

    }

    private async readMemoFileHeader() {
        try {
            let buffer: Buffer = Buffer.alloc(512, 0, 'binary');

            await fs.read(
                this.memoFileDescriptior,
                buffer,
                0,
                512,
                0);

            return buffer;

        } catch (error) {
            throw error;
        }
    }

    public async parseHeader() {
        try {
            let buffer = await this.readMemoFileHeader();

            var reader = new BufferReader(buffer, 0);

            let nextAvailBlockNumber = reader.read32bitUInt();
            let sizeOfBlocks = reader.read32bitUInt();
            let dbfFilename = reader.readStringSkipZeros(8, this.encoding);
            reader.skip(1);
            reader.skip(3);
            let blockSize = reader.read16bUInt();
            let header = new Models.MemoFileHeader(
                nextAvailBlockNumber,
                sizeOfBlocks,
                dbfFilename,
                blockSize
            );

            return header;
        } catch (error) {
            throw error;
        }
    }

    public async readBlock(blockNumber: number, memoHeader: Models.MemoFileHeader) {
        let offset = blockNumber * memoHeader.blockLength;

        let infoBuffer = Buffer.alloc(8, 0, 'binary');

        await fs.read(this.memoFileDescriptior, infoBuffer, offset, 8, 0);

        var infoReader = new BufferReader(infoBuffer);

        let reserved00h = infoReader.readBytes(4);
        const shouldBe = Buffer.from([0xFF, 0xFF, 0x08, 0x00]);
        if (!reserved00h.equals(shouldBe)) {
            throw "Read buffer ${reserved00h} is not equal to ${shouldBe}.";
        }

        let length = infoReader.read32bitUInt();

        let dataBuffer = Buffer.alloc(length, 0, 'binary');
        await fs.read(this.memoFileDescriptior, dataBuffer, offset + 8, length, 0);
        let dataReader = new BufferReader(dataBuffer);

        let text = dataReader.readString(length, this.encoding);
    }

    // public async fill(memoField: Models.MemoField) {
    //     try {
    //         if (!isNaN(memoField.pointer)) {
    //             await fs.read(this.fileDescriptior, , , , )
    //         }
    //     } catch (error) {
    //         throw error;
    //     }
    // }
}