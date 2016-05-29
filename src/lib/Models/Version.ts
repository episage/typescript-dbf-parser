export class Version {
    public constructor(
        public byte: number,
        public versionNumber: number,
        public versionDescription: string,
        public isMemoFilePresent: boolean,
        public isSqlTablePresent: boolean,
        public isDbtFilePresent: boolean
    ) { }
}