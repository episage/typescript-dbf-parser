import * as Models from './Models';
import {BufferReader} from './BufferReader';

export class RecordsParser {
    constructor(public reader: BufferReader, public columns: Models.Column[], public encoding: string) {

    }

    public parse() {
        let records = [];
        while (this.reader.hasByteAvailable()) {
            let record = this.parseRecord();
            records.push(record);
        }

        return records;
    }

    public parseRecord() {
        let isDeleted = this.reader.readBoolean();
        let returnObject = {};

        for (let i = 0; i < this.columns.length; i++) {
            let column = this.columns[i];
            let fieldValue = undefined;
            switch (column.type) {
                case 'C':
                    {
                        fieldValue = this.reader.readString(column.length, this.encoding).trim(); // uses 0x20 for empty spaces
                        break;
                    }
                case 'M':
                    {
                        let memoPointerString = this.reader.readString(column.length, this.encoding).trim();
                        let memoPointer = parseInt(memoPointerString);
                        fieldValue = new Models.MemoField(memoPointer);
                        break;
                    }
                                    case 'N':
                    {
                        let numberString = this.reader.readString(column.length, this.encoding).trim();
                        let number = parseInt(numberString);
                        fieldValue = number;
                        break;
                    }
                default: {
                    this.reader.skip(column.length);
                    break;
                }
            }
            returnObject[column.name] = fieldValue;
        }

        return returnObject;
    }
}