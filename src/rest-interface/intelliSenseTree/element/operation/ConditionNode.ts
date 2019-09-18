import { HoverContent } from '../../../../helper/HoverContent';
import { GenericNode } from '../../GenericNode';
import { IndexRange } from '../../IndexRange';
import { OperandNode } from './operand/OperandNode';

// Conditions
export abstract class ConditionNode extends OperandNode {
    constructor(line: string[], range: IndexRange) {
        super(line, range, "Boolean", null);
    }

    abstract getChildren(): GenericNode[];
    abstract getHoverContent(): HoverContent | null;
}
