import 'jest';
import { Position } from 'vscode-languageserver';
import {
    ConnectedOperationNode
} from '../../../../src/data-model/syntax-tree/element/operation/ConnectedOperationNode';
import { ArrayOperandNode } from '../../../../src/data-model/syntax-tree/element/operation/operand/ArrayOperandNode';
import { OperandNode } from '../../../../src/data-model/syntax-tree/element/operation/operand/OperandNode';
import { OperatorNode } from '../../../../src/data-model/syntax-tree/element/operation/operand/OperatorNode';
import { OperationNode } from '../../../../src/data-model/syntax-tree/element/operation/OperationNode';
import { UnkownNode } from '../../../../src/data-model/syntax-tree/element/UnkownNode';
import { GenericNode } from '../../../../src/data-model/syntax-tree/GenericNode';
import { IndexRange } from '../../../../src/data-model/syntax-tree/IndexRange';
import { AsKeywordTransition } from '../../../../src/provider/code-completion/states/AsKeywordTransition';
import { ConnectionTransition } from '../../../../src/provider/code-completion/states/ConnectionTransition';
import { OperandTransition } from '../../../../src/provider/code-completion/states/OperandTransition';
import { OperatorTransition } from '../../../../src/provider/code-completion/states/OperatorTransition';
import { StateTransition } from '../../../../src/provider/code-completion/states/StateTransition';
import { ThenKeywordTransition } from '../../../../src/provider/code-completion/states/ThenKeywordTransition';
import { TestInitializer } from '../../../Testinitializer';

describe('UnkownNode Tests', () => {
    let initializer: TestInitializer;

    beforeEach(() => {
        initializer = new TestInitializer(true);
    });

    test('getCompletionContainer with empty UnkownNode, expected OperandMissing', () => {
        const unkown: UnkownNode = new UnkownNode(null, [], IndexRange.create(0, 0, 0, 0));

        const positionParameter = Position.create(0, 0);

        const actual: StateTransition[] = unkown.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(OperandTransition);
    });

    test('getCompletionContainer with OperandNode, expected Operand', () => {
        const operand: OperandNode = new OperandNode(['Alter'], IndexRange.create(0, 0, 0, 5), 'Decimal', 'Alter');
        const unkown: UnkownNode = new UnkownNode(operand, [], IndexRange.create(0, 0, 0, 5));

        const positionParameter = Position.create(0, 6);

        const actual: StateTransition[] = unkown.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(OperatorTransition);
        expect(actual[1]).toBeInstanceOf(AsKeywordTransition);

    });

    test('getCompletionContainer with half-full OperationNode, expected Operator', () => {
        const leftOperand: OperandNode = new OperandNode(['Alter'], IndexRange.create(0, 0, 0, 5), 'Decimal', 'Alter');
        const operator: OperatorNode = new OperatorNode(['gleich'], IndexRange.create(0, 6, 0, 12), 'Boolean', 'EQUALS', 'Object');
        const operation = new OperationNode(leftOperand, operator, null, [], IndexRange.create(0, 0, 0, 12));
        const unkown: UnkownNode = new UnkownNode(operation, [], IndexRange.create(0, 0, 0, 12));

        const positionParameter = Position.create(0, 13);

        const actual: StateTransition[] = unkown.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(OperandTransition);
    });

    test('getCompletionContainer with full OperationNode,  expected RuleEnd and Variable', () => {
        const leftOperand: OperandNode = new OperandNode(['Alter'], IndexRange.create(0, 0, 0, 5), 'Decimal', 'Alter');
        const operator: OperatorNode = new OperatorNode(['gleich'], IndexRange.create(0, 6, 0, 12), 'Boolean', 'EQUALS', 'Object');
        const rightOperand: OperandNode = new OperandNode(['18'], IndexRange.create(0, 13, 0, 15), 'Decimal', '18.0');
        const operation =
            new OperationNode(leftOperand, operator, rightOperand, ['Alter gleich 18'], IndexRange.create(0, 0, 0, 15));

        const unkown: UnkownNode = new UnkownNode(operation, [], IndexRange.create(0, 0, 0, 15));

        const positionParameter = Position.create(0, 16);

        const actual: StateTransition[] = unkown.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(ConnectionTransition);
        expect(actual[1]).toBeInstanceOf(ThenKeywordTransition);
        expect(actual[2]).toBeInstanceOf(AsKeywordTransition);
    });

    test('getCompletionContainer with full OperationNode, expected RuleEnd and Variable', () => {
        const leftOperand: OperandNode = new OperandNode(['Alter'], IndexRange.create(0, 0, 0, 5), 'Decimal', 'Alter');
        const operator: OperatorNode = new OperatorNode(['gleich'], IndexRange.create(0, 6, 0, 12), 'Boolean', 'EQUALS', 'Object');
        const rightOperand: OperandNode = new OperandNode(['18'], IndexRange.create(0, 13, 0, 15), 'Decimal', '18.0');
        const operation =
            new OperationNode(leftOperand, operator, rightOperand, ['Alter gleich 18'], IndexRange.create(0, 0, 0, 15));

        const unkown: UnkownNode = new UnkownNode(operation, [], IndexRange.create(0, 0, 0, 15));

        const positionParameter = Position.create(0, 16);

        const actual: StateTransition[] = unkown.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(ConnectionTransition);
        expect(actual[1]).toBeInstanceOf(ThenKeywordTransition);
        expect(actual[2]).toBeInstanceOf(AsKeywordTransition);
    });

    test('getCompletionContainer with full OperationNode, expected RuleEnd and Variable', () => {
        const leftOperand: OperandNode = new OperandNode(['Alter'], IndexRange.create(0, 0, 0, 5), 'Decimal', 'Alter');
        const operator: OperatorNode = new OperatorNode(['gleich'], IndexRange.create(0, 6, 0, 12), 'Boolean', 'EQUALS', 'Object');
        const rightOperand: OperandNode = new OperandNode(['18'], IndexRange.create(0, 13, 0, 15), 'Decimal', '18.0');
        const firstOperation =
            new OperationNode(leftOperand, operator, rightOperand, ['Alter gleich 18'], IndexRange.create(0, 0, 0, 15));

        const secondOperation = new OperationNode(null, null, null, ['UND '], IndexRange.create(0, 17, 0, 21));

        const connectOperation: ConnectedOperationNode =
            new ConnectedOperationNode([firstOperation, secondOperation], [], IndexRange.create(0, 0, 0, 22));

        const unkown: UnkownNode = new UnkownNode(connectOperation, [], IndexRange.create(0, 0, 0, 22));

        const positionParameter = Position.create(0, 22);

        const actual: StateTransition[] = unkown.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(OperandTransition);
    });

    test('getCompletionContainer with ConnectedOperationNode and 2 OperationNodes and one falsy OperationNode and position after second Operation, expected RuleEnd and Variable', () => {
        const leftOperand: OperandNode = new OperandNode(['Alter'], IndexRange.create(0, 0, 0, 5), 'Decimal', 'Alter');
        const operator: OperatorNode = new OperatorNode(['gleich'], IndexRange.create(0, 6, 0, 12), 'Boolean', 'EQUALS', 'Object');
        const rightOperand: OperandNode = new OperandNode(['18'], IndexRange.create(0, 13, 0, 15), 'Decimal', '18.0');
        const firstOperation =
            new OperationNode(leftOperand, operator, rightOperand, ['Alter gleich 18'], IndexRange.create(0, 0, 0, 15));

        const secleftOperand: OperandNode = new OperandNode(['Alter'], IndexRange.create(0, 19, 0, 25), 'Decimal', 'Alter');
        const secondOperation =
            new OperationNode(secleftOperand, null, null, ['UND  Alter gleich 18'], IndexRange.create(0, 17, 0, 35));

        const connectOperation: ConnectedOperationNode =
            new ConnectedOperationNode([firstOperation, secondOperation], [], IndexRange.create(0, 0, 0, 35));

        const unkown: UnkownNode = new UnkownNode(connectOperation, [], IndexRange.create(0, 0, 0, 35));

        const positionParameter = Position.create(0, 36);

        const actual: StateTransition[] = unkown.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(OperatorTransition);
    });

    test('UnkownNode get content test', () => {
        const errorMessage: string = 'This is an error';
        const unkownNode: UnkownNode =
            new UnkownNode(null, [errorMessage], IndexRange.create(0, 0, 0, errorMessage.length));

        expect(unkownNode.$content).toEqual(null);
    });

    test('getChildren without child, expect no children', () => {
        const errorMessage: string = 'This is an error';
        const unkownNode: UnkownNode =
            new UnkownNode(null, [errorMessage], IndexRange.create(0, 0, 0, errorMessage.length));

        const actual: GenericNode[] = unkownNode.getChildren();
        const expected: GenericNode[] = [];

        expect(actual).toEqual(expected);
    });

    test('getChildren with one child, expect one child', () => {
        const operand: string = 'Test';
        const operandNode: OperandNode =
            new OperandNode([operand], IndexRange.create(0, 0, 0, operand.length), 'String', operand);
        const unkownNode: UnkownNode =
            new UnkownNode(operandNode, [operand], IndexRange.create(0, 0, 0, operand.length));

        const actual: GenericNode[] = unkownNode.getChildren();
        const expected: GenericNode[] = [operandNode];

        expect(actual).toEqual(expected);
    });

    test('getHoverContent without content, expect not empty content', () => {
        const errorMessage: string = 'This is an error';
        const unkownNode: UnkownNode =
            new UnkownNode(null, [errorMessage], IndexRange.create(0, 0, 0, errorMessage.length));

        const actual = unkownNode.getHoverContent();

        expect(actual).not.toBeNull();
    });

    test('getHoverContent with content which is incomplete, expect not empty content', () => {
        const operand: string = 'Test';
        const operandNode: OperandNode =
            new OperandNode([operand], IndexRange.create(0, 0, 0, operand.length), 'String', operand);
        const unkownNode: UnkownNode =
            new UnkownNode(operandNode, [operand], IndexRange.create(0, 0, 0, operand.length));

        const actual = unkownNode.getHoverContent();

        expect(actual).not.toBeNull();
    });

    test('getHoverContent with content which is complete, expect not empty content', () => {
        const operand: string = 'Test';
        const operandNode: OperandNode =
            new OperandNode([operand], IndexRange.create(0, 0, 0, operand.length), 'String', operand);
        const arrayOperandNode: ArrayOperandNode =
            new ArrayOperandNode(
                [operandNode], [operand], IndexRange.create(0, 0, 0, operand.length), 'String', operand);
        const unkownNode: UnkownNode =
            new UnkownNode(arrayOperandNode, [operand], IndexRange.create(0, 0, 0, operand.length));

        const actual = unkownNode.getHoverContent();

        expect(actual).not.toBeNull();
    });

    test('getBeautifiedContent without children, expect not empty content', () => {
        const errorMessage: string = 'This is an error';
        const unkownNode: UnkownNode =
            new UnkownNode(null, [errorMessage], IndexRange.create(0, 0, 0, errorMessage.length));

        const actual = unkownNode.getBeautifiedContent(initializer.$server.aliasHelper);

        expect(actual).toEqual(errorMessage);
    });

    test('getBeautifiedContent with children, expect not empty content', () => {
        const operand: string = 'Test';
        const operandNode: OperandNode =
            new OperandNode([operand], IndexRange.create(0, 0, 0, operand.length), 'String', operand);
        const unkownNode: UnkownNode =
            new UnkownNode(operandNode, [operand], IndexRange.create(0, 0, 0, operand.length));

        const actual = unkownNode.getBeautifiedContent(initializer.$server.aliasHelper);

        expect(actual).toEqual(operand);
    });
});
