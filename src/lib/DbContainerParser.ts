import * as Models from './Models';
import {BufferReader} from './BufferReader';

export class DbContainerParser {
    constructor(public buffer: Buffer) {

    }

    public parse() {
        let reader = new BufferReader(this.buffer);

        reader.skip(263);
        
        return undefined;
    }
}