import { IndexRange } from '../../IndexRange';
import { BaseOperandNode } from './operand/BaseOperandNode';

// Conditions
export abstract class ConditionNode extends BaseOperandNode {
    private connector: string | null;

    constructor(line: string[], range: IndexRange) {
        super(line, range, "Boolean", "");
        this.connector = null;
    }

    abstract isConstrained(): boolean;

    public getConnector(): string | null {
        return this.connector;
    }
}
