import {HeaderParser} from './HeaderParser';
import {ColumnsParser} from './ColumnsParser';
import {RecordsParser} from './RecordsParser';
import {BufferReader} from './BufferReader';
import * as Models from './Models';

import * as fs from 'fs';

enum ParsingStage {
    Header,
    Columns,
    Records
}

export class Parser {

    public header: Models.Header;
    public columns: Models.Column[];

    private stage: ParsingStage;

    constructor(public readStream: fs.ReadStream, public encoding: string) {
        this.stage = ParsingStage.Header;
    }

    public parse(headerCallback, columnsCallback, recordCallbacks, endCallback) {

        this.readStream.on('readable', () => {
            let chunk: Buffer;

            if (this.stage == ParsingStage.Header) {
                if (null !== (chunk = this.readStream.read(32))) {
                    let headerParser = new HeaderParser(chunk);
                    this.header = headerParser.parse();

                    headerCallback(this.header);

                    this.stage = ParsingStage.Columns;
                } else {
                    endCallback(new Error("Stream too short. Can't read header."));
                }
            }

            if (this.stage == ParsingStage.Columns) {
                if (null !== (chunk = this.readStream.read(this.header.headerLength - 32))) {
                    let columnsParser = new ColumnsParser(chunk, this.encoding);
                    this.columns = columnsParser.parse();

                    columnsCallback(this.columns);

                    this.stage = ParsingStage.Records;
                } else {
                    endCallback(new Error("Stream too short. Can't read columns."));
                }
            }

            if (this.stage == ParsingStage.Records) {
                let offset = 0;
                while (null !== (chunk = this.readStream.read(this.header.recordLength))) {
                    let br = new BufferReader(chunk);
                    let recordsParser = new RecordsParser(br, this.columns, this.encoding);
                    let record = recordsParser.parse();

                    recordCallbacks(record);
                }
            }

        }).on('end', () => {
            endCallback();
        });
    }
}