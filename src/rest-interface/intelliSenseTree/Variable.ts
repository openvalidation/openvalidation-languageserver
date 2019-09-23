export class Variable {
    private name: string;
    private dataType: string;

    constructor(name: string, datatype: string) {
        this.name = name;
        this.dataType = datatype;
    }

    public getName(): string {
        return this.name;
    }
    public setName(value: string) {
        this.name = value;
    }
    public getDataType(): string {
        return this.dataType;
    }
    public setDataType(value: string) {
        this.dataType = value;
    }
}