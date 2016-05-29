import * as Models from './Models';
import {BufferReader} from './BufferReader';

export class HeaderParser {
    constructor(public buffer: Buffer) {

    }

    public parse() {
        let reader = new BufferReader(this.buffer);

        let version = this.parseDBaseVersion(reader.readByte());

        let dateOfLastUpdate = reader.readDate();

        let numberOfRecords = reader.read32bitUInt();

        let headerLength = reader.read16bUInt();

        let recordLength = reader.read16bUInt();

        let reserved0Ch = reader.readBytes(2);

        let incompleteTransaction = reader.readBoolean();

        let isEncrypted = reader.readBoolean();

        let reserved10h = reader.readBytes(4);

        let reserved14h = reader.readBytes(8);

        let isMdx = reader.readBoolean();
        let languageDriver = this.parseLanguageDriver(reader.readByte());
        let reserved1Eh = reader.readBytes(2);

        var header = new Models.Header(
            version,
            dateOfLastUpdate,
            numberOfRecords,
            headerLength,
            recordLength,
            reserved0Ch,
            incompleteTransaction,
            isEncrypted,
            reserved10h,
            reserved14h,
            isMdx,
            languageDriver,
            reserved1Eh
        );

        return header;
    }

    private parseLanguageDriver(byte: number) {

        let codePageDescription = undefined;
        let codePage = undefined;

        switch (byte) {
            case 0x01:
                codePage = "437";
                codePageDescription = "DOS USA";
                break;
            case 0x02:
                codePage = "850";
                codePageDescription = "DOS Multilingual";
                break;
            case 0x03:
                codePage = "Windows ANSI";
                codePageDescription = "1252";
                break;
            case 0x04:
                codePage = "";
                codePageDescription = "Standard Macintosh";
                break
            case 0x64:
                codePage = "852";
                codePageDescription = "EE MS-DOS";
                break
            case 0x65:
                codePage = "865";
                codePageDescription = "Nordic MS-DOS";
                break
            case 0x66:
                codePage = "866";
                codePageDescription = "Russian MS-MOD";
                break;
            case 0x67:
                codePage = "";
                codePageDescription = "Icelandic MS-DOS";
                break;
            case 0x68:
                codePage = "";
                codePageDescription = "Kamenicky (Czech) MS-DOS";
                break;
            case 0x69:
                codePage = "";
                codePageDescription = "Mazovia (Polish) MS-DOS";
                break;
            case 0x6A:
                codePage = "";
                codePageDescription = "Greek MS-DOS (437G)";
                break;
            case 0x6B:
                codePage = "";
                codePageDescription = "Turkish MS-DOS";
                break;
            case 0x96:
                codePage = "";
                codePageDescription = "Russian Macintosh";
                break;
            case 0x97:
                codePage = "";
                codePageDescription = "Eastern European Macintosh";
                break;
            case 0x98:
                codePage = "";
                codePageDescription = "Greek Macintosh";
                break;
            case 0xC8:
                codePage = "1250";
                codePageDescription = "Windows EE";
                break;
            case 0xC9:
                codePage = "";
                codePageDescription = "Russian Windows";
                break;
            case 0xCA:
                codePage = "";
                codePageDescription = "Turkish Windows";
                break;
            case 0xCB:
                codePage = "";
                codePageDescription = "Greek Windows";
                break;
            default:
                codePage = undefined;
                codePageDescription = undefined;
                break;
        }

        let codePageNumber = parseInt(codePage) ;

        var languageDriver = new Models.LanguageDriver(
            byte,
            codePageNumber,
            codePageDescription
        );

        return languageDriver;
    }

    private parseDBaseVersion(byte: number): Models.Version {
        var versionNumber = byte & parseInt("00000111", 2);
        var isMemoFilePresent = (byte & parseInt("00001000", 2)) > 0;
        var isSqlTablePresent = (byte & parseInt("01110000", 2)) > 0;
        var isDbtFilePresent = (byte & parseInt("10000000", 2)) > 0;

        var versionDescription = undefined;

        switch (byte) {
            case 0x02:
                versionDescription = "FoxBase";
                break;
            case 0x03:
                versionDescription = "File without DBT";
                break;
            case 0x04:
                versionDescription = "dBASE IV w/o memo file";
                break;
            case 0x05:
                versionDescription = "dBASE V w/o memo file"
                break
            case 0x07:
                versionDescription = "VISUAL OBJECTS (first 1.0 versions) for the Dbase III files w/o memo file"
                break
            case 0x30:
                versionDescription = "Visual FoxPro";
                break
            case 0x31:
                versionDescription = "Visual FoxPro w. AutoIncrement field";
                break;
            case 0x43:
                versionDescription = ".dbv memo var size (Flagship)";
                break;
            case 0x7B:
                versionDescription = "dBASE IV with memo";
                break;
            case 0x83:
                versionDescription = "File with DBT";
                break;
            case 0x83:
                versionDescription = "dBASE III+ with memo file";
                break;
            case 0x87:
                versionDescription = "VISUAL OBJECTS (first 1.0 versions) for the Dbase III files (NTX clipper driver) with memo file";
                break;
            case 0x8B:
                versionDescription = "dBASE IV w. memo";
                break;
            case 0x8E:
                versionDescription = "dBASE IV w. SQL table";
                break;
            case 0xB3:
                versionDescription = ".dbv and .dbt memo (Flagship)";
                break;
            case 0xE5:
                versionDescription = "Clipper SIX driver w. SMT memo file.";
                break;
            case 0xF5:
                versionDescription = "FoxPro w. memo file";
                break;
            case 0xFB:
                versionDescription = "FoxPro ???";
                break;
            default:
                versionDescription = undefined;
                break;
        }

        if (!versionDescription) {
            if ((byte & parseInt("110", 2)) > 0) {
                versionDescription = "Clipper SIX driver encrypted database.";
            }
        }

        let version = new Models.Version(
            byte,
            versionNumber,
            versionDescription,
            isMemoFilePresent,
            isSqlTablePresent,
            isDbtFilePresent
        );

        return version;
    }

}