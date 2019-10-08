import 'jest';
import { Position } from 'vscode-languageserver';
import { ConnectedOperationNode } from '../../../../../src/data-model/syntax-tree/element/operation/ConnectedOperationNode';
import { OperandNode } from '../../../../../src/data-model/syntax-tree/element/operation/operand/OperandNode';
import { OperatorNode } from '../../../../../src/data-model/syntax-tree/element/operation/operand/OperatorNode';
import { OperationNode } from '../../../../../src/data-model/syntax-tree/element/operation/OperationNode';
import { IndexRange } from '../../../../../src/data-model/syntax-tree/IndexRange';
import { ConnectionTransition } from '../../../../../src/provider/code-completion/states/ConnectionTransition';
import { EmptyTransition } from '../../../../../src/provider/code-completion/states/EmptyTransition';
import { OperandTransition } from '../../../../../src/provider/code-completion/states/OperandTransition';
import { OperatorTransition } from '../../../../../src/provider/code-completion/states/OperatorTransition';
import { StateTransition } from '../../../../../src/provider/code-completion/states/StateTransition';

describe('ConnectedOperationNode Tests', () => {
    beforeEach(() => {
    });

    test('getCompletionContainer with empty ConnectedOperationNode, expected Empty', () => {
        // var operation: OperationNode = new OperationNode(null, null, null, [], IndexRange.create(0, 0, 0, 0));
        const connectOperation: ConnectedOperationNode =
            new ConnectedOperationNode([], [], IndexRange.create(0, 0, 0, 0));

        const positionParameter = Position.create(0, 0);

        const actual: StateTransition[] = connectOperation.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(OperandTransition);
    });

    test('getCompletionContainer with empty OperationNode and an empty OperationNode, expected Empty', () => {
        const operation: OperationNode = new OperationNode(null, null, null, [], IndexRange.create(0, 0, 0, 0));
        const connectOperation: ConnectedOperationNode =
            new ConnectedOperationNode([operation], [], IndexRange.create(0, 0, 0, 0));

        const positionParameter = Position.create(0, 0);

        const actual: StateTransition[] = connectOperation.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(OperandTransition);
    });

    // tslint:disable-next-line: max-line-length
    test('getCompletionContainer with ConnectedOperationNode and OperationNode with only an Operand, expected Operator', () => {
        const leftOperand: OperandNode = new OperandNode(['Alter'], IndexRange.create(0, 0, 0, 5), 'Decimal', 'Alter');
        const operation = new OperationNode(leftOperand, null, null, [], IndexRange.create(0, 0, 0, 12));
        const connectOperation: ConnectedOperationNode =
            new ConnectedOperationNode([operation], [], IndexRange.create(0, 0, 0, 12));

        const positionParameter = Position.create(0, 13);

        const actual: StateTransition[] = connectOperation.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(OperatorTransition);
    });

    test('getCompletionContainer with ConnectedOperationNode and half full OperationNode, expected Operator', () => {
        const leftOperand: OperandNode = new OperandNode(['Alter'], IndexRange.create(0, 0, 0, 5), 'Decimal', 'Alter');
        const operator: OperatorNode = new OperatorNode(['gleich'], IndexRange.create(0, 6, 0, 12), 'Boolean', 'EQUALS', 'Object');
        const operation = new OperationNode(leftOperand, operator, null, [], IndexRange.create(0, 0, 0, 12));
        const connectOperation: ConnectedOperationNode =
            new ConnectedOperationNode([operation], [], IndexRange.create(0, 0, 0, 12));

        const positionParameter = Position.create(0, 13);

        const actual: StateTransition[] = connectOperation.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(OperandTransition);
    });

    // tslint:disable-next-line: max-line-length
    test('getCompletionContainer with ConnectedOperationNode and full OperationNode, expected ConnectedOperation', () => {
        const leftOperand: OperandNode = new OperandNode(['Alter'], IndexRange.create(0, 0, 0, 5), 'Decimal', 'Alter');
        const operator: OperatorNode = new OperatorNode(['gleich'], IndexRange.create(0, 6, 0, 12), 'Boolean', 'EQUALS', 'Object');
        const rightOperand: OperandNode = new OperandNode(['18'], IndexRange.create(0, 13, 0, 15), 'Decimal', '18.0');
        const operation =
            new OperationNode(leftOperand, operator, rightOperand, ['Alter gleich 18'], IndexRange.create(0, 0, 0, 15));

        const connectOperation: ConnectedOperationNode =
            new ConnectedOperationNode([operation], [], IndexRange.create(0, 0, 0, 15));

        const positionParameter = Position.create(0, 16);

        const actual: StateTransition[] = connectOperation.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(ConnectionTransition);
    });

    test('getCompletionContainer with ConnectedOperationNode and 2 OperationNodes and position after ConnectedOperation, expected ConnectedOperation', () => {
        const leftOperand: OperandNode = new OperandNode(['Alter'], IndexRange.create(0, 0, 0, 5), 'Decimal', 'Alter');
        const operator: OperatorNode = new OperatorNode(['gleich'], IndexRange.create(0, 6, 0, 12), 'Boolean', 'EQUALS', 'Object');
        const rightOperand: OperandNode = new OperandNode(['18'], IndexRange.create(0, 13, 0, 15), 'Decimal', '18.0');
        const firstOperation =
            new OperationNode(leftOperand, operator, rightOperand, ['Alter gleich 18'], IndexRange.create(0, 0, 0, 15));

        const secleftOperand: OperandNode = new OperandNode(['Alter'], IndexRange.create(0, 19, 0, 25), 'Decimal', 'Alter');
        const secoperator: OperatorNode = new OperatorNode(['gleich'], IndexRange.create(0, 26, 0, 32), 'Boolean', 'EQUALS', 'Object');
        const secrightOperand: OperandNode =
            new OperandNode(['18'], IndexRange.create(0, 33, 0, 35), 'Decimal', '18.0');
        const secondOperation =
            new OperationNode(
                secleftOperand, secoperator, secrightOperand, ['UND  Alter gleich 18'], IndexRange.create(0, 16, 0, 35)
            );

        const connectOperation: ConnectedOperationNode =
            new ConnectedOperationNode([firstOperation, secondOperation], [], IndexRange.create(0, 0, 0, 35));

        const positionParameter = Position.create(0, 36);

        const actual: StateTransition[] = connectOperation.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(ConnectionTransition);
    });

    test('getCompletionContainer with ConnectedOperationNode and 2 OperationNodes and position inside first Operation, expected Empty', () => {
        const leftOperand: OperandNode = new OperandNode(['Alter'], IndexRange.create(0, 0, 0, 5), 'Decimal', 'Alter');
        const operator: OperatorNode = new OperatorNode(['gleich'], IndexRange.create(0, 6, 0, 12), 'Boolean', 'EQUALS', 'Object');
        const rightOperand: OperandNode = new OperandNode(['18'], IndexRange.create(0, 13, 0, 15), 'Decimal', '18.0');
        const firstOperation =
            new OperationNode(leftOperand, operator, rightOperand, ['Alter gleich 18'], IndexRange.create(0, 0, 0, 15));

        const secleftOperand: OperandNode = new OperandNode(['Alter'], IndexRange.create(0, 19, 0, 25), 'Decimal', 'Alter');
        const secoperator: OperatorNode = new OperatorNode(['gleich'], IndexRange.create(0, 26, 0, 32), 'Boolean', 'EQUALS', 'Object');
        const secrightOperand: OperandNode =
            new OperandNode(['18'], IndexRange.create(0, 33, 0, 35), 'Decimal', '18.0');
        const secondOperation =
            new OperationNode(
                secleftOperand, secoperator, secrightOperand, ['UND  Alter gleich 18'], IndexRange.create(0, 16, 0, 35)
            );

        const connectOperation: ConnectedOperationNode =
            new ConnectedOperationNode([firstOperation, secondOperation], [], IndexRange.create(0, 0, 0, 35));

        const positionParameter = Position.create(0, 6);

        const actual: StateTransition[] = connectOperation.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(EmptyTransition);
    });

    test('getCompletionContainer with ConnectedOperationNode and 2 OperationNodes and position inside second Operation, expected Empty', () => {
        const leftOperand: OperandNode = new OperandNode(['Alter'], IndexRange.create(0, 0, 0, 5), 'Decimal', 'Alter');
        const operator: OperatorNode = new OperatorNode(['gleich'], IndexRange.create(0, 6, 0, 12), 'Boolean', 'EQUALS', 'Object');
        const rightOperand: OperandNode = new OperandNode(['18'], IndexRange.create(0, 13, 0, 15), 'Decimal', '18.0');
        const firstOperation =
            new OperationNode(leftOperand, operator, rightOperand, ['Alter gleich 18'], IndexRange.create(0, 0, 0, 15));

        const secleftOperand: OperandNode = new OperandNode(['Alter'], IndexRange.create(0, 19, 0, 25), 'Decimal', 'Alter');
        const secoperator: OperatorNode = new OperatorNode(['gleich'], IndexRange.create(0, 26, 0, 32), 'Boolean', 'EQUALS', 'Object');
        const secrightOperand: OperandNode =
            new OperandNode(['18'], IndexRange.create(0, 33, 0, 35), 'Decimal', '18.0');
        const secondOperation =
            new OperationNode(
                secleftOperand, secoperator, secrightOperand, ['UND  Alter gleich 18'], IndexRange.create(0, 16, 0, 35)
            );

        const connectOperation: ConnectedOperationNode =
            new ConnectedOperationNode([firstOperation, secondOperation], [], IndexRange.create(0, 0, 0, 35));

        const positionParameter = Position.create(0, 32);

        const actual: StateTransition[] = connectOperation.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(EmptyTransition);
    });

    test('getCompletionContainer with ConnectedOperationNode and 2 OperationNodes and one falsy OperationNode and position inside second Operation, expected Empty', () => {
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

        const connectOperation: ConnectedOperationNode =
            new ConnectedOperationNode([firstOperation, secondOperation], [], IndexRange.create(0, 0, 0, 35));

        const positionParameter = Position.create(0, 32);

        const actual: StateTransition[] = connectOperation.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(EmptyTransition);
    });

    test('getCompletionContainer with ConnectedOperationNode and 2 OperationNodes and one falsy OperationNode and position after second Operation, expected Empty', () => {
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

        const connectOperation: ConnectedOperationNode =
            new ConnectedOperationNode([firstOperation, secondOperation], [], IndexRange.create(0, 0, 0, 35));

        const positionParameter = Position.create(0, 36);

        const actual: StateTransition[] = connectOperation.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(ConnectionTransition);
    });

    test('getCompletionContainer with ConnectedOperationNode and 2 OperationNodes and one falsy OperationNode and position before second Operation, expected Empty', () => {
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

        const connectOperation: ConnectedOperationNode =
            new ConnectedOperationNode([firstOperation, secondOperation], [], IndexRange.create(0, 0, 0, 35));

        const positionParameter = Position.create(0, 16);

        const actual: StateTransition[] = connectOperation.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(OperandTransition);
    });

    test('getCompletionContainer with ConnectedOperationNode and 2 OperationNodes and one falsy OperationNode and position after second Operation, expected Operator', () => {
        const leftOperand: OperandNode = new OperandNode(['Alter'], IndexRange.create(0, 0, 0, 5), 'Decimal', 'Alter');
        const operator: OperatorNode = new OperatorNode(['gleich'], IndexRange.create(0, 6, 0, 12), 'Boolean', 'EQUALS', 'Object');
        const rightOperand: OperandNode = new OperandNode(['18'], IndexRange.create(0, 13, 0, 15), 'Decimal', '18.0');
        const firstOperation =
            new OperationNode(leftOperand, operator, rightOperand, ['Alter gleich 18'], IndexRange.create(0, 0, 0, 15));

        const secleftOperand: OperandNode = new OperandNode(['Alter'], IndexRange.create(0, 19, 0, 25), 'Decimal', 'Alter');
        const secoperator: OperatorNode = new OperatorNode(['gleich'], IndexRange.create(0, 26, 0, 32), 'Boolean', 'EQUALS', 'Object');
        const secondOperation =
            new OperationNode(
                secleftOperand, secoperator, null, ['UND  Alter gleich 18'], IndexRange.create(0, 17, 0, 35)
            );

        const connectOperation: ConnectedOperationNode =
            new ConnectedOperationNode([firstOperation, secondOperation], [], IndexRange.create(0, 0, 0, 35));

        const positionParameter = Position.create(0, 36);

        const actual: StateTransition[] = connectOperation.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(OperandTransition);
    });

    test('getCompletionContainer with ConnectedOperationNode and 2 OperationNodes and one falsy OperationNode and position after second Operation, expected Operator', () => {
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

        const positionParameter = Position.create(0, 36);

        const actual: StateTransition[] = connectOperation.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(OperatorTransition);
    });
});
