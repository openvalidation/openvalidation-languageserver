import { IndexRange } from '../../IndexRange';
import { BaseOperandNode } from './operand/BaseOperandNode';

// Conditions
export abstract class ConditionNode extends BaseOperandNode {
    constructor(line: string[], range: IndexRange) {
        super(line, range, "Boolean", null);
    }

    abstract isConstrained(): boolean;
}
