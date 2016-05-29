import * as Models from './Models';
import {BufferReader} from './BufferReader';

export class ColumnsParser {
    constructor(public buffer: Buffer, public encoding: string) {

    }

    public parse(): Models.Column[] {
        let reader = new BufferReader(this.buffer);

        let columns: Models.Column[] = [];

        while (reader.readByte() != 0x0D) {
            reader.skip(-1);
            let column = this.parseColumn(reader);
            columns.push(column);
        }

        return columns;
    }

    private parseColumn(reader: BufferReader) {
        let name = reader.readStringSkipZeros(11, this.encoding);
        let fieldType = reader.readAsciiChar();
        reader.skip(4);
        let fieldLength = reader.read16bUInt(); //chyba
        reader.skip(13);
        let isKeyPresent = reader.readBoolean();

        let column = new Models.Column(
            name,
            fieldType,
            fieldLength,
            isKeyPresent
        );

        return column;
    }
}