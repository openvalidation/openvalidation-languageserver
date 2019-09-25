import { StateTransition } from "./StateTransition";
import { StateTransitionEnum } from "./StateTransitionEnum";

export class OperandTransition extends StateTransition {
    private datatype: string | undefined;
    private nameFilter: string | undefined | null;

    constructor(datatype?: string, nameFilter?: string | null, prependingText?: string) {
        super(StateTransitionEnum.Operand, prependingText);

        this.datatype = datatype;
        this.nameFilter = nameFilter;
    }

    public getDataType(): string | undefined {
        return this.datatype;
    }

    public getNameFilter(): string | undefined | null {
        return this.nameFilter;
    }
}