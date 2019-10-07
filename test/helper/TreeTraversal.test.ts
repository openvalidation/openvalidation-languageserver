import "jest"
import { TreeTraversal } from "../../src/helper/TreeTraversal";
import { GenericNode } from "../../src/data-model/syntax-tree/GenericNode";
import { Position } from "vscode-languageserver";
import { OperandNode } from "../../src/data-model/syntax-tree/element/operation/operand/OperandNode";
import { IndexRange } from "../../src/data-model/syntax-tree/IndexRange";
import { OperatorNode } from "../../src/data-model/syntax-tree/element/operation/operand/OperatorNode";
import { OperationNode } from "../../src/data-model/syntax-tree/element/operation/OperationNode";

describe("TreeTraversal Tests", () => {
    var traversal: TreeTraversal;

    beforeEach(() => {
        traversal = new TreeTraversal();
    });

    test("traverseTree with empty list, expect empty list", () => {
        var input: GenericNode[] = [];
        var position: Position = Position.create(0, 0);

        var expected: GenericNode | null = null;
        var actual: GenericNode | null = traversal.traverseTree(input, position);

        expect(actual).toEqual(expected);
    });

    test("getOperations with empty list, expect empty list", () => {
        var input: GenericNode[] = [];

        var expected: GenericNode[] = [];
        var actual: GenericNode[] = traversal.getOperations(input);

        expect(actual).toEqual(expected);
    });

    test("getOperations with one operation, expect operation list", () => {
        var operand: string = "Test";
        var left: OperandNode = new OperandNode([operand], IndexRange.create(0, 0, 0, operand.length), "String", operand);
        var operator: OperatorNode = new OperatorNode(["kleiner"], IndexRange.create(0, 0, 0, 0), "Boolean", "kleiner", "Decimal");
        var right: OperandNode = new OperandNode([operand], IndexRange.create(0, 0, 0, operand.length), "String", operand);
        var operationNode: OperationNode = new OperationNode(left, operator, right, ["Test kleiner Test"], IndexRange.create(0, 0, 0, "Test kleiner Test".length));

        var input: GenericNode[] = [operationNode];
        var expected: GenericNode[] = [operationNode];
        var actual: GenericNode[] = traversal.getOperations(input);

        expect(actual).toEqual(expected);
    });

    test("getLonelyOperands with empty list, expect empty list", () => {
        var input: GenericNode[] = [];

        var expected: GenericNode[] = [];
        var actual: GenericNode[] = traversal.getLonelyOperands(input);

        expect(actual).toEqual(expected);
    });

    test("getLonelyOperands with one operand, expect empty list", () => {
        var operandText: string = "Test";
        var operand: OperandNode = new OperandNode([operandText], IndexRange.create(0, 0, 0, operandText.length), "String", operandText);

        var input: GenericNode[] = [operand];

        var expected: GenericNode[] = [operand];
        var actual: GenericNode[] = traversal.getLonelyOperands(input);

        expect(actual).toEqual(expected);
    });

    test("getLonelyOperands with one operand and operation, expect empty list", () => {
        var operandText: string = "Test";
        var operand: OperandNode = new OperandNode([operandText], IndexRange.create(0, 0, 0, operandText.length), "String", operandText);
        
        var left: OperandNode = new OperandNode([operandText], IndexRange.create(0, 0, 0, operandText.length), "String", operandText);
        var operator: OperatorNode = new OperatorNode(["kleiner"], IndexRange.create(0, 0, 0, 0), "Boolean", "kleiner", "Decimal");
        var right: OperandNode = new OperandNode([operandText], IndexRange.create(0, 0, 0, operandText.length), "String", operandText);
        var operationNode: OperationNode = new OperationNode(left, operator, right, ["Test kleiner Test"], IndexRange.create(0, 0, 0, "Test kleiner Test".length));

        var input: GenericNode[] = [operand, operationNode];

        var expected: GenericNode[] = [operand];
        var actual: GenericNode[] = traversal.getLonelyOperands(input);

        expect(actual).toEqual(expected);
    });
});