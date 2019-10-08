import 'jest';
import { Position } from 'vscode-languageserver';
import { OperandNode } from '../../src/data-model/syntax-tree/element/operation/operand/OperandNode';
import { OperatorNode } from '../../src/data-model/syntax-tree/element/operation/operand/OperatorNode';
import { OperationNode } from '../../src/data-model/syntax-tree/element/operation/OperationNode';
import { GenericNode } from '../../src/data-model/syntax-tree/GenericNode';
import { IndexRange } from '../../src/data-model/syntax-tree/IndexRange';
import { TreeTraversal } from '../../src/helper/TreeTraversal';

describe('TreeTraversal Tests', () => {
    let traversal: TreeTraversal;

    beforeEach(() => {
        traversal = new TreeTraversal();
    });

    test('traverseTree with empty list, expect empty list', () => {
        const input: GenericNode[] = [];
        const position: Position = Position.create(0, 0);

        const expected: GenericNode | null = null;
        const actual: GenericNode | null = traversal.traverseTree(input, position);

        expect(actual).toEqual(expected);
    });

    test('getOperations with empty list, expect empty list', () => {
        const input: GenericNode[] = [];

        const expected: GenericNode[] = [];
        const actual: GenericNode[] = traversal.getOperations(input);

        expect(actual).toEqual(expected);
    });

    test('getOperations with one operation, expect operation list', () => {
        const operand: string = 'Test';
        const left: OperandNode =
            new OperandNode([operand], IndexRange.create(0, 0, 0, operand.length), 'String', operand);
        const operator: OperatorNode =
            new OperatorNode(['kleiner'], IndexRange.create(0, 0, 0, 0), 'Boolean', 'kleiner', 'Decimal');
        const right: OperandNode =
            new OperandNode([operand], IndexRange.create(0, 0, 0, operand.length), 'String', operand);
        const operationNode: OperationNode =
            new OperationNode(left, operator, right, ['Test kleiner Test'], IndexRange.create(0, 0, 0, 'Test kleiner Test'.length));

        const input: GenericNode[] = [operationNode];
        const expected: GenericNode[] = [operationNode];
        const actual: GenericNode[] = traversal.getOperations(input);

        expect(actual).toEqual(expected);
    });

    test('getLonelyOperands with empty list, expect empty list', () => {
        const input: GenericNode[] = [];

        const expected: GenericNode[] = [];
        const actual: GenericNode[] = traversal.getLonelyOperands(input);

        expect(actual).toEqual(expected);
    });

    test('getLonelyOperands with one operand, expect empty list', () => {
        const operandText: string = 'Test';
        const operand: OperandNode = new OperandNode([operandText], IndexRange.create(0, 0, 0, operandText.length), 'String', operandText);

        const input: GenericNode[] = [operand];

        const expected: GenericNode[] = [operand];
        const actual: GenericNode[] = traversal.getLonelyOperands(input);

        expect(actual).toEqual(expected);
    });

    test('getLonelyOperands with one operand and operation, expect empty list', () => {
        const operandText: string = 'Test';
        const operand: OperandNode = new OperandNode([operandText], IndexRange.create(0, 0, 0, operandText.length), 'String', operandText);

        const left: OperandNode = new OperandNode([operandText], IndexRange.create(0, 0, 0, operandText.length), 'String', operandText);
        const operator: OperatorNode =
            new OperatorNode(['kleiner'], IndexRange.create(0, 0, 0, 0), 'Boolean', 'kleiner', 'Decimal');
        const right: OperandNode = new OperandNode([operandText], IndexRange.create(0, 0, 0, operandText.length), 'String', operandText);
        const operationNode: OperationNode =
            new OperationNode(left, operator, right, ['Test kleiner Test'], IndexRange.create(0, 0, 0, 'Test kleiner Test'.length));

        const input: GenericNode[] = [operand, operationNode];

        const expected: GenericNode[] = [operand];
        const actual: GenericNode[] = traversal.getLonelyOperands(input);

        expect(actual).toEqual(expected);
    });
});
