import {HeaderParser} from '../lib/HeaderParser';
import {ColumnsParser} from '../lib/ColumnsParser';
import {RecordsParser} from '../lib/RecordsParser';
import {BufferReader} from '../lib/BufferReader';
import {Parser} from '../lib/Parser';
import {DbtReader} from '../lib/DbtReader';
import {assert} from 'chai';

import * as fs from 'fs';

describe('reader', () => {
    it('should read', async function (done) {
        this.timeout(1000000);

        try {
            let filePath = "/Users/epi/Projects/santelab/santelab_dane_2016_05_03/WYNIKI.dbt";
            fs.open(filePath, 'r', async function (rs) {
                console.log('opnd')
                let reader = new DbtReader(rs, '852');
                console.log('opnd2')
                // let parser = new Parser(rs, '852');

                let h = await reader.parseHeader();
                console.log('HHHH')
                console.log(h);
                for (let i = 0; i < 10; i++) {
                    let b = await reader.readBlock(i, h);
                    console.log(b);
                }
            });


        } catch (error) {
            done(error);
        }
    });
});
