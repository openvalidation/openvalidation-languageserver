import { StateTransition } from "./StateTransition";
import { StateTransitionEnum } from "./StateTransitionEnum";

export class OperandTransition extends StateTransition {
    private _datatype: string | undefined;
    private _nameFilter: string | undefined | null;

    constructor(datatype?: string, nameFilter?: string | null, prependingText?: string) {
        super(StateTransitionEnum.Operand, prependingText);

        this._datatype = datatype;
        this._nameFilter = nameFilter;
    }

    public get dataType(): string | undefined {
        return this._datatype;
    }

    public get nameFilter(): string[] | undefined | null {
        if (!this._nameFilter) return null;

        var filter: string[] = [this._nameFilter];
        var complexChild: string[] = this._nameFilter.split('.');
        if (complexChild.length > 1) {
            filter.push(complexChild[complexChild.length - 1]);
        }

        return filter;
    }

    public isValid(name: string, datatype: string): boolean {
        return (!!datatype && !! this.nameFilter && datatype == this.dataType && !this.nameFilter.includes(name) ||
                (!this.nameFilter && !this.dataType));
    }
}