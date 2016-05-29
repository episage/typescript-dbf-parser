import {Version} from './Version';
import {LanguageDriver} from './LanguageDriver';

export class Header {
    public constructor(
        public version: Version,
        public dateOfLastUpdate: Date,
        public numberOfRecords: number,
        public headerLength: number,
        public recordLength: number,
        public reserved0Ch: Buffer,
        public isTransactionPending: boolean,
        public isEncrypted: boolean,
        public reserved10h: Buffer,
        public reserved14h: Buffer,
        public isMdx: boolean,
        public languageDriver: LanguageDriver,
        public reserved1Eh: Buffer
    ) { }
}