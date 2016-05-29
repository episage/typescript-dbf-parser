export class MemoFileHeader {
    constructor(
        public nextBlockNumber: number,
        public sizeOfBlocks: number,
        public dbfFileNameWithoutExtension: string,
        public blockLength: number
        // public version:number
    ) { }
}