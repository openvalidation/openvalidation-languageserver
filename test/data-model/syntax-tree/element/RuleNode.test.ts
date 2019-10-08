import 'jest';
import { Position } from 'vscode-languageserver-types';
import { ActionErrorNode } from '../../../../src/data-model/syntax-tree/element/ActionErrorNode';
import {
    ConnectedOperationNode
} from '../../../../src/data-model/syntax-tree/element/operation/ConnectedOperationNode';
import { OperandNode } from '../../../../src/data-model/syntax-tree/element/operation/operand/OperandNode';
import { OperatorNode } from '../../../../src/data-model/syntax-tree/element/operation/operand/OperatorNode';
import { OperationNode } from '../../../../src/data-model/syntax-tree/element/operation/OperationNode';
import { RuleNode } from '../../../../src/data-model/syntax-tree/element/RuleNode';
import { IndexRange } from '../../../../src/data-model/syntax-tree/IndexRange';
import { ConnectionTransition } from '../../../../src/provider/code-completion/states/ConnectionTransition';
import { EmptyTransition } from '../../../../src/provider/code-completion/states/EmptyTransition';
import { OperandTransition } from '../../../../src/provider/code-completion/states/OperandTransition';
import { StateTransition } from '../../../../src/provider/code-completion/states/StateTransition';
import { ThenKeywordTransition } from '../../../../src/provider/code-completion/states/ThenKeywordTransition';

describe('RuleNode Tests', () => {
    beforeEach(() => {
    });

    test('getCompletionContainer with empty RuleNode, expected RuleStart', () => {
        const rule: RuleNode = new RuleNode(null, null, ['Wenn'], IndexRange.create(0, 0, 0, 4));

        const positionParameter = Position.create(0, 5);

        const actual: StateTransition[] = rule.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(OperandTransition);
    });

    test('getCompletionContainer with empty Operation, expected RuleStart', () => {
        const operation: OperationNode = new OperationNode(null, null, null, [], IndexRange.create(0, 4, 0, 4));
        const rule: RuleNode = new RuleNode(null, operation, ['Wenn'], IndexRange.create(0, 0, 0, 4));

        const positionParameter = Position.create(0, 5);

        const actual: StateTransition[] = rule.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(OperandTransition);
    });

    test('getCompletionContainer with complete Operation but invalid position, expected Empty State', () => {
        const leftOperand: OperandNode = new OperandNode(['Alte'], IndexRange.create(0, 6, 0, 10), 'Decimal', 'Alter');
        const operator: OperatorNode =
            new OperatorNode(['gleich'], IndexRange.create(0, 11, 0, 17), 'Boolean', 'EQUALS', 'Object');
        const rightOperand: OperandNode = new OperandNode(['18'], IndexRange.create(0, 18, 0, 20), 'Decimal', '18.0');
        const operation =
            new OperationNode(leftOperand, operator, rightOperand, ['Alter gleich 18'], IndexRange.create(0, 6, 0, 20));

        const rule: RuleNode = new RuleNode(null, operation, ['Wenn  Alte gleich 18'], IndexRange.create(0, 0, 0, 20));

        const positionParameter = Position.create(0, 5);

        const actual: StateTransition[] = rule.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(EmptyTransition);
    });

    test('getCompletionContainer with complete Operation, expected ConnectedOperation and RuleEnd', () => {
        const leftOperand: OperandNode = new OperandNode(['Alter'], IndexRange.create(0, 5, 0, 10), 'Decimal', 'Alter');
        const operator: OperatorNode =
            new OperatorNode(['gleich'], IndexRange.create(0, 11, 0, 17), 'Boolean', 'EQUALS', 'Object');
        const rightOperand: OperandNode = new OperandNode(['18'], IndexRange.create(0, 18, 0, 20), 'Decimal', '18.0');
        const operation =
            new OperationNode(leftOperand, operator, rightOperand, ['Alter gleich 18'], IndexRange.create(0, 5, 0, 20));

        const rule: RuleNode = new RuleNode(null, operation, ['Wenn Alter gleich 18'], IndexRange.create(0, 0, 0, 20));

        const positionParameter = Position.create(0, 21);

        const actual: StateTransition[] = rule.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(ConnectionTransition);
        expect(actual[1]).toBeInstanceOf(ThenKeywordTransition);
    });

    test('getCompletionContainer with complete Operation and empty message, expected Emptylist', () => {
        const leftOperand: OperandNode = new OperandNode(['Alter'], IndexRange.create(0, 5, 0, 10), 'Decimal', 'Alter');
        const operator: OperatorNode =
            new OperatorNode(['gleich'], IndexRange.create(0, 11, 0, 17), 'Boolean', 'EQUALS', 'Object');
        const rightOperand: OperandNode = new OperandNode(['18'], IndexRange.create(0, 18, 0, 20), 'Decimal', '18.0');
        const operation =
            new OperationNode(leftOperand, operator, rightOperand, ['Alter gleich 18'], IndexRange.create(0, 5, 0, 20));

        const actionNode = new ActionErrorNode(['Dann '], IndexRange.create(0, 0, 0, 21), '');
        const rule: RuleNode =
            new RuleNode(actionNode, operation, ['Wenn Alter gleich 18 Dann '], IndexRange.create(0, 0, 0, 26));

        const positionParameter = Position.create(0, 27);

        const actual: StateTransition[] = rule.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(EmptyTransition);
    });

    test('getCompletionContainer with complete Operation and empty message with position before message, expected ConnectedOperation', () => {
        const leftOperand: OperandNode = new OperandNode(['Alter'], IndexRange.create(0, 5, 0, 10), 'Decimal', 'Alter');
        const operator: OperatorNode =
            new OperatorNode(['gleich'], IndexRange.create(0, 11, 0, 17), 'Boolean', 'EQUALS', 'Object');
        const rightOperand: OperandNode = new OperandNode(['18'], IndexRange.create(0, 18, 0, 20), 'Decimal', '18.0');
        const operation =
            new OperationNode(leftOperand, operator, rightOperand, ['Alter gleich 18'], IndexRange.create(0, 5, 0, 20));

        const actionNode = new ActionErrorNode(['Dann '], IndexRange.create(0, 22, 0, 27), '');
        const rule: RuleNode =
            new RuleNode(actionNode, operation, ['Wenn Alter gleich 18  Dann '], IndexRange.create(0, 0, 0, 27));

        const positionParameter = Position.create(0, 21);

        const actual: StateTransition[] = rule.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(ConnectionTransition);
    });

    // tslint:disable-next-line: max-line-length
    test('getCompletionContainer with complete Operation and with position before condition, expected empty list', () => {
        const leftOperand: OperandNode = new OperandNode(['Alte'], IndexRange.create(0, 6, 0, 10), 'Decimal', 'Alte');
        const operator: OperatorNode =
            new OperatorNode(['gleich'], IndexRange.create(0, 11, 0, 17), 'Boolean', 'EQUALS', 'Object');
        const rightOperand: OperandNode = new OperandNode(['18'], IndexRange.create(0, 18, 0, 20), 'Decimal', '18.0');
        const operation =
            new OperationNode(leftOperand, operator, rightOperand, ['Alter gleich 18'], IndexRange.create(0, 5, 0, 20));

        const actionNode = new ActionErrorNode(['Dann '], IndexRange.create(0, 22, 0, 27), '');
        const rule: RuleNode =
            new RuleNode(actionNode, operation, ['Wenn  Alte gleich 18  Dann '], IndexRange.create(0, 0, 0, 27));

        const positionParameter = Position.create(0, 5);

        const actual: StateTransition[] = rule.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(EmptyTransition);
    });

    test('getCompletionContainer with ConnectedOperation and with position after action, expected empty list', () => {
        const leftOperand: OperandNode = new OperandNode(['Alter'], IndexRange.create(0, 5, 0, 10), 'Decimal', 'Alter');
        const operator: OperatorNode =
            new OperatorNode(['gleich'], IndexRange.create(0, 11, 0, 17), 'Boolean', 'EQUALS', 'Object');
        const rightOperand: OperandNode = new OperandNode(['18'], IndexRange.create(0, 18, 0, 20), 'Decimal', '18.0');
        const firstOperation =
            new OperationNode(leftOperand, operator, rightOperand, ['Alter gleich 18'], IndexRange.create(0, 5, 0, 20));

        const secleftOperand: OperandNode = new OperandNode(['Alter'], IndexRange.create(0, 24, 0, 30), 'Decimal', 'Alter');
        const secoperator: OperatorNode = new OperatorNode(['gleich'], IndexRange.create(0, 31, 0, 37), 'Boolean', 'EQUALS', 'Object');
        const secrightOperand: OperandNode =
            new OperandNode(['18'], IndexRange.create(0, 38, 0, 40), 'Decimal', '18.0');
        const secondOperation =
            new OperationNode(
                secleftOperand, secoperator, secrightOperand, ['UND  Alter gleich 18'], IndexRange.create(0, 21, 0, 40)
            );

        const connectOperation: ConnectedOperationNode = new ConnectedOperationNode([firstOperation, secondOperation], ['Alter gleich 18 UND Alter gleich 18'], IndexRange.create(0, 5, 0, 40));

        const actionNode = new ActionErrorNode(['Dann '], IndexRange.create(0, 41, 0, 46), '');
        const rule: RuleNode = new RuleNode(actionNode, connectOperation, ['Wenn Alter gleich 18 UND Alter gleich 18 Dann '], IndexRange.create(0, 0, 0, 46));

        const positionParameter = Position.create(0, 47);

        const actual: StateTransition[] = rule.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(EmptyTransition);
    });

    test('getCompletionContainer with ConnectedOperation and with position before action, expected empty list', () => {
        const leftOperand: OperandNode = new OperandNode(['Alter'], IndexRange.create(0, 5, 0, 10), 'Decimal', 'Alter');
        const operator: OperatorNode =
            new OperatorNode(['gleich'], IndexRange.create(0, 11, 0, 17), 'Boolean', 'EQUALS', 'Object');
        const rightOperand: OperandNode = new OperandNode(['18'], IndexRange.create(0, 18, 0, 20), 'Decimal', '18.0');
        const firstOperation =
            new OperationNode(leftOperand, operator, rightOperand, ['Alter gleich 18'], IndexRange.create(0, 5, 0, 20));

        const secleftOperand: OperandNode = new OperandNode(['Alter'], IndexRange.create(0, 24, 0, 30), 'Decimal', 'Alter');
        const secoperator: OperatorNode = new OperatorNode(['gleich'], IndexRange.create(0, 31, 0, 37), 'Boolean', 'EQUALS', 'Object');
        const secrightOperand: OperandNode =
            new OperandNode(['18'], IndexRange.create(0, 38, 0, 40), 'Decimal', '18.0');
        const secondOperation =
            new OperationNode(
                secleftOperand, secoperator, secrightOperand, ['UND  Alter gleich 18'], IndexRange.create(0, 21, 0, 40)
            );

        const connectOperation: ConnectedOperationNode = new ConnectedOperationNode([firstOperation, secondOperation], ['Alter gleich 18 UND Alter gleich 18 '], IndexRange.create(0, 5, 0, 40));

        const actionNode = new ActionErrorNode(['Dann '], IndexRange.create(0, 42, 0, 46), '');
        const rule: RuleNode = new RuleNode(actionNode, connectOperation, ['Wenn Alter gleich 18 UND Alter gleich 18 Dann '], IndexRange.create(0, 0, 0, 46));

        const positionParameter = Position.create(0, 41);

        const actual: StateTransition[] = rule.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(ConnectionTransition);
    });

    // tslint:disable-next-line: max-line-length
    test('getCompletionContainer with ConnectedOperation and with position before second operation, expected empty list', () => {
        const leftOperand: OperandNode = new OperandNode(['Alter'], IndexRange.create(0, 5, 0, 10), 'Decimal', 'Alter');
        const operator: OperatorNode =
            new OperatorNode(['gleich'], IndexRange.create(0, 11, 0, 17), 'Boolean', 'EQUALS', 'Object');
        const rightOperand: OperandNode = new OperandNode(['18'], IndexRange.create(0, 18, 0, 20), 'Decimal', '18.0');
        const firstOperation =
            new OperationNode(leftOperand, operator, rightOperand, ['Alter gleich 18'], IndexRange.create(0, 5, 0, 20));

        const secleftOperand: OperandNode = new OperandNode(['Alter'], IndexRange.create(0, 24, 0, 30), 'Decimal', 'Alter');
        const secoperator: OperatorNode = new OperatorNode(['gleich'], IndexRange.create(0, 31, 0, 37), 'Boolean', 'EQUALS', 'Object');
        const secrightOperand: OperandNode =
            new OperandNode(['18'], IndexRange.create(0, 38, 0, 40), 'Decimal', '18.0');
        const secondOperation =
            new OperationNode(
                secleftOperand, secoperator, secrightOperand, ['UND  Alter gleich 18'], IndexRange.create(0, 22, 0, 40)
            );

        const connectOperation: ConnectedOperationNode = new ConnectedOperationNode([firstOperation, secondOperation], ['Alter gleich 18 UND Alter gleich 18 '], IndexRange.create(0, 5, 0, 40));

        const actionNode = new ActionErrorNode(['Dann '], IndexRange.create(0, 42, 0, 46), '');
        const rule: RuleNode = new RuleNode(actionNode, connectOperation, ['Wenn Alter gleich 18 UND Alter gleich 18 Dann '], IndexRange.create(0, 0, 0, 46));

        const positionParameter = Position.create(0, 21);

        const actual: StateTransition[] = rule.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(ConnectionTransition);
    });

    test('getCompletionContainer with ConnectedOperation and with position right after connector of second operation, expected empty list', () => {
        const leftOperand: OperandNode = new OperandNode(['Alter'], IndexRange.create(0, 5, 0, 10), 'Decimal', 'Alter');
        const operator: OperatorNode =
            new OperatorNode(['gleich'], IndexRange.create(0, 11, 0, 17), 'Boolean', 'EQUALS', 'Object');
        const rightOperand: OperandNode = new OperandNode(['18'], IndexRange.create(0, 18, 0, 20), 'Decimal', '18.0');
        const firstOperation =
            new OperationNode(leftOperand, operator, rightOperand, ['Alter gleich 18'], IndexRange.create(0, 5, 0, 20));

        const secleftOperand: OperandNode = new OperandNode(['Alter'], IndexRange.create(0, 27, 0, 30), 'Decimal', 'Alter');
        const secoperator: OperatorNode = new OperatorNode(['gleich'], IndexRange.create(0, 31, 0, 37), 'Boolean', 'EQUALS', 'Object');
        const secrightOperand: OperandNode =
            new OperandNode(['18'], IndexRange.create(0, 38, 0, 40), 'Decimal', '18.0');
        const secondOperation =
            new OperationNode(
                secleftOperand, secoperator, secrightOperand, ['UND  Alter gleich 18'], IndexRange.create(0, 22, 0, 40)
            );

        const connectOperation: ConnectedOperationNode = new ConnectedOperationNode([firstOperation, secondOperation], ['Alter gleich 18 UND Alter gleich 18 '], IndexRange.create(0, 5, 0, 40));

        const actionNode = new ActionErrorNode(['Dann '], IndexRange.create(0, 42, 0, 46), '');
        const rule: RuleNode = new RuleNode(actionNode, connectOperation, ['Wenn Alter gleich 18 UND  Alter gleich 18 Dann '], IndexRange.create(0, 0, 0, 46));

        const positionParameter = Position.create(0, 26);

        const actual: StateTransition[] = rule.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(EmptyTransition);
    });

});
