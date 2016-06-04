import {HeaderParser} from '../lib/HeaderParser';
import {ColumnsParser} from '../lib/ColumnsParser';
import {RecordsParser} from '../lib/RecordsParser';
import {BufferReader} from '../lib/BufferReader';
import {Parser} from '../lib/Parser';
import {assert} from 'chai';

import * as fs from 'fs';
describe('parser', () => {
    it('should parse', function (done) {
        this.timeout(1000000);

        try {
            let filePath = "/Users/epi/Projects/santelab/santelab_dane_2016_05_03/WYNIKI.dbf";
            let rs = fs.createReadStream(filePath);
            let parser = new Parser(rs, '852');

            let c = 0;
            parser.parse((header) => {
                console.log(header);
            }, (columns) => {
                console.log(columns);
            }, (record) => {
                process.stdout.write(c.toString() + "\r");
                c++;
                // console.log(record);
            }, (error) => {
                console.log(error);
                done(error);
            });

        } catch (error) {
            done(error);
        }
    });
});
