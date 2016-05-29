export class Column {
    public constructor(
        public name:string,
        public type:string,
        public length:number,
        public isIndexed:boolean
    ) { }
}