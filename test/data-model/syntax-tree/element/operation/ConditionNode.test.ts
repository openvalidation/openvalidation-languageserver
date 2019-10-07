import "jest"
import { ConditionNode } from "../../../../../src/data-model/syntax-tree/element/operation/ConditionNode";
import { ConnectedOperationNode } from "../../../../../src/data-model/syntax-tree/element/operation/ConnectedOperationNode";
import { IndexRange } from "../../../../../src/data-model/syntax-tree/IndexRange";

describe("ConditionNode Tests", () => {
    test("ConditionNode get connector test", () => {
        var operand: string = "Test";
        var conditionNode: ConditionNode = new ConnectedOperationNode([], [operand], IndexRange.create(0, 0, 0, operand.length));
        conditionNode.$connector = "and";

        expect(conditionNode.$connector).toEqual("and");
    })
});