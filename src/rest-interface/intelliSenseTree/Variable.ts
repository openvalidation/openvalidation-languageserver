export class Variable {
    private name: string;
    private dataType: string;

    constructor() {
        this.name = "";
        this.dataType = "";
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