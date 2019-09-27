export class Variable {
    private _name: string;
    private _dataType: string;

    constructor(name: string, datatype: string) {
        this._name = name;
        this._dataType = datatype;
    }

    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }
    public get dataType(): string {
        return this._dataType;
    }
    public set dataType(value: string) {
        this._dataType = value;
    }
}