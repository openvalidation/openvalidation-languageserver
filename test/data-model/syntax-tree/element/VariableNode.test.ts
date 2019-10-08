import 'jest';
import { Position } from 'vscode-languageserver';
import {
    ConnectedOperationNode
} from '../../../../src/data-model/syntax-tree/element/operation/ConnectedOperationNode';
import { OperandNode } from '../../../../src/data-model/syntax-tree/element/operation/operand/OperandNode';
import { OperatorNode } from '../../../../src/data-model/syntax-tree/element/operation/operand/OperatorNode';
import { OperationNode } from '../../../../src/data-model/syntax-tree/element/operation/OperationNode';
import { VariableNameNode } from '../../../../src/data-model/syntax-tree/element/VariableNameNode';
import { VariableNode } from '../../../../src/data-model/syntax-tree/element/VariableNode';
import { IndexRange } from '../../../../src/data-model/syntax-tree/IndexRange';
import { EmptyTransition } from '../../../../src/provider/code-completion/states/EmptyTransition';
import { OperandTransition } from '../../../../src/provider/code-completion/states/OperandTransition';
import { OperatorTransition } from '../../../../src/provider/code-completion/states/OperatorTransition';
import { StateTransition } from '../../../../src/provider/code-completion/states/StateTransition';

describe('VariableNode Tests', () => {
    beforeEach(() => {
    });

    test('getCompletionContainer with empty VariableNode, expected OperandMissing', () => {
        const variableNameNode: VariableNameNode = new VariableNameNode(['Als Test'], IndexRange.create(0, 1, 0, 9), 'Test');
        const variable: VariableNode = new VariableNode(variableNameNode, null, [], IndexRange.create(0, 1, 0, 9));

        const positionParameter = Position.create(0, 0);

        const actual: StateTransition[] = variable.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(OperandTransition);
    });

    test('getCompletionContainer with VariableNode and OperandNode, expected Operand', () => {
        const variableNameNode: VariableNameNode = new VariableNameNode(['Als Test'], IndexRange.create(0, 7, 0, 15), 'Test');

        const leftOperand: OperandNode = new OperandNode(['Alter'], IndexRange.create(0, 0, 0, 5), 'Decimal', 'Alter');
        const variable: VariableNode =
            new VariableNode(variableNameNode, leftOperand, ['Alter  Als Test'], IndexRange.create(0, 0, 0, 'Alter  Als Test'.length));

        const positionParameter = Position.create(0, 6);

        const actual: StateTransition[] = variable.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(OperatorTransition);
    });

    test('getCompletionContainer with VariableNode and OperandNode and position after variable, expected Empty', () => {
        const variableNameNode: VariableNameNode = new VariableNameNode(['Als Test'], IndexRange.create(0, 6, 0, 14), 'Test');

        const leftOperand: OperandNode = new OperandNode(['Alter'], IndexRange.create(0, 0, 0, 5), 'Decimal', 'Alter');
        const variable: VariableNode =
            new VariableNode(variableNameNode, leftOperand, ['Alter  Als Test'], IndexRange.create(0, 0, 0, 'Alter  Als Test'.length));

        const positionParameter = Position.create(0, 15);

        const actual: StateTransition[] = variable.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(EmptyTransition);
    });

    test('getCompletionContainer with VariableNode and ConnectedOperationNode and half full OperationNode, expected Operator', () => {
        const variableNameNode: VariableNameNode = new VariableNameNode(['Als Test'], IndexRange.create(0, 14, 0, 22), 'Test');

        const leftOperand: OperandNode = new OperandNode(['Alter'], IndexRange.create(0, 0, 0, 5), 'Decimal', 'Alter');
        const operator: OperatorNode = new OperatorNode(['gleich'], IndexRange.create(0, 6, 0, 12), 'Boolean', 'EQUALS', 'Object');
        const operation = new OperationNode(leftOperand, operator, null, [], IndexRange.create(0, 0, 0, 12));
        const connectOperation: ConnectedOperationNode =
            new ConnectedOperationNode([operation], ['Alter gleich'], IndexRange.create(0, 0, 0, 12));

        const variable: VariableNode =
            new VariableNode(variableNameNode, connectOperation, ['Alter gleich  Als Test'], IndexRange.create(0, 0, 0, 'Alter gleich  Als Test'.length));

        const positionParameter = Position.create(0, 13);

        const actual: StateTransition[] = variable.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(OperandTransition);
    });

    test('getCompletionContainer with VariableNode and ConnectedOperationNode and half full OperationNode and position after variable, expected Empty', () => {
        const variableNameNode: VariableNameNode = new VariableNameNode(['Als Test'], IndexRange.create(0, 14, 0, 22), 'Test');

        const leftOperand: OperandNode = new OperandNode(['Alter'], IndexRange.create(0, 0, 0, 5), 'Decimal', 'Alter');
        const operator: OperatorNode = new OperatorNode(['gleich'], IndexRange.create(0, 6, 0, 12), 'Boolean', 'EQUALS', 'Object');
        const operation = new OperationNode(leftOperand, operator, null, [], IndexRange.create(0, 0, 0, 12));
        const connectOperation: ConnectedOperationNode =
            new ConnectedOperationNode([operation], ['Alter gleich'], IndexRange.create(0, 0, 0, 12));

        const variable: VariableNode =
            new VariableNode(variableNameNode, connectOperation, ['Alter gleich  Als Test'], IndexRange.create(0, 0, 0, 'Alter gleich  Als Test'.length));

        const positionParameter = Position.create(0, 23);

        const actual: StateTransition[] = variable.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(EmptyTransition);
    });

    test('getCompletionContainer with VariableNode and ConnectedOperationNode and half full OperationNode, expected empty', () => {
        const leftOperand: OperandNode = new OperandNode(['Alter'], IndexRange.create(0, 0, 0, 5), 'Decimal', 'Alter');
        const operator: OperatorNode = new OperatorNode(['gleich'], IndexRange.create(0, 6, 0, 12), 'Boolean', 'EQUALS', 'Object');
        const firstOperation =
            new OperationNode(leftOperand, operator, null, ['Alter gleich 18'], IndexRange.create(0, 0, 0, 15));

        const secleftOperand: OperandNode = new OperandNode(['Alter'], IndexRange.create(0, 19, 0, 25), 'Decimal', 'Alter');
        const secoperator: OperatorNode = new OperatorNode(['gleich'], IndexRange.create(0, 26, 0, 32), 'Boolean', 'EQUALS', 'Object');
        const secrightOperand: OperandNode =
            new OperandNode(['18'], IndexRange.create(0, 33, 0, 35), 'Decimal', '18.0');
        const secondOperation =
            new OperationNode(
                secleftOperand, secoperator, secrightOperand, ['UND  Alter gleich 18'], IndexRange.create(0, 17, 0, 35)
            );

        const connectOperation: ConnectedOperationNode = new ConnectedOperationNode([firstOperation, secondOperation], ['Alter gleich 18 UND  Alter gleich 18'], IndexRange.create(0, 0, 0, 35));

        const variableNameNode: VariableNameNode = new VariableNameNode(['Als Test'], IndexRange.create(0, 37, 0, 44), 'Test');
        const variable: VariableNode =
            new VariableNode(
                variableNameNode, connectOperation, ['Alter gleich  Als Test'], IndexRange.create(0, 0, 0, 44));

        const positionParameter = Position.create(0, 16);

        const actual: StateTransition[] = variable.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(OperandTransition);
    });

    test('getCompletionContainer with VariableNode and ConnectedOperationNode and half full OperationNode and position after variable, expected Operator', () => {
        const leftOperand: OperandNode = new OperandNode(['Alter'], IndexRange.create(0, 0, 0, 5), 'Decimal', 'Alter');
        const operator: OperatorNode = new OperatorNode(['gleich'], IndexRange.create(0, 6, 0, 12), 'Boolean', 'EQUALS', 'Object');
        const firstOperation =
            new OperationNode(leftOperand, operator, null, ['Alter gleich 18'], IndexRange.create(0, 0, 0, 15));

        const secleftOperand: OperandNode = new OperandNode(['Alter'], IndexRange.create(0, 19, 0, 25), 'Decimal', 'Alter');
        const secoperator: OperatorNode = new OperatorNode(['gleich'], IndexRange.create(0, 26, 0, 32), 'Boolean', 'EQUALS', 'Object');
        const secrightOperand: OperandNode =
            new OperandNode(['18'], IndexRange.create(0, 33, 0, 35), 'Decimal', '18.0');
        const secondOperation =
            new OperationNode(
                secleftOperand, secoperator, secrightOperand, ['UND  Alter gleich 18'], IndexRange.create(0, 16, 0, 35)
            );

        const connectOperation: ConnectedOperationNode = new ConnectedOperationNode([firstOperation, secondOperation], ['Alter gleich 18 UND  Alter gleich 18'], IndexRange.create(0, 0, 0, 35));

        const variableNameNode: VariableNameNode = new VariableNameNode(['Als Test'], IndexRange.create(0, 36, 0, 44), 'Test');
        const variable: VariableNode =
            new VariableNode(
                variableNameNode, connectOperation, ['Alter gleich  Als Test'], IndexRange.create(0, 0, 0, 44));

        const positionParameter = Position.create(0, 45);

        const actual: StateTransition[] = variable.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(EmptyTransition);
    });

});
