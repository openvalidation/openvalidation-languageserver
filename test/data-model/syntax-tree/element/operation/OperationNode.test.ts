import 'jest';
import { Position } from 'vscode-languageserver';
import { ArrayOperandNode } from '../../../../../src/data-model/syntax-tree/element/operation/operand/ArrayOperandNode';
import { FunctionOperandNode } from '../../../../../src/data-model/syntax-tree/element/operation/operand/FunctionOperandNode';
import { OperandNode } from '../../../../../src/data-model/syntax-tree/element/operation/operand/OperandNode';
import { OperatorNode } from '../../../../../src/data-model/syntax-tree/element/operation/operand/OperatorNode';
import { OperationNode } from '../../../../../src/data-model/syntax-tree/element/operation/OperationNode';
import { GenericNode } from '../../../../../src/data-model/syntax-tree/GenericNode';
import { IndexRange } from '../../../../../src/data-model/syntax-tree/IndexRange';
import { ScopeEnum } from '../../../../../src/enums/ScopeEnum';
import { ConnectionTransition } from '../../../../../src/provider/code-completion/states/ConnectionTransition';
import { EmptyTransition } from '../../../../../src/provider/code-completion/states/EmptyTransition';
import { OperandTransition } from '../../../../../src/provider/code-completion/states/OperandTransition';
import { OperatorTransition } from '../../../../../src/provider/code-completion/states/OperatorTransition';
import { StateTransition } from '../../../../../src/provider/code-completion/states/StateTransition';
import { TestInitializer } from '../../../../Testinitializer';

describe('Operation Tests', () => {
    let initializer: TestInitializer;

    beforeEach(() => {
        initializer = new TestInitializer(true);
    });

    test('OperationNode get/set leftOperand/rightOperand/operator test', () => {
        const operation =
            new OperationNode(null, null, null, ['Alter gleich 18'], IndexRange.create(0, 0, 0, 15));

        const leftOperand: OperandNode = new OperandNode(['Alter'], IndexRange.create(0, 0, 0, 5), 'Decimal', 'Alter');
        operation.$leftOperand = leftOperand;

        const operator: OperatorNode = new OperatorNode(['gleich'], IndexRange.create(0, 6, 0, 12), 'Boolean', 'EQUALS', 'Object');
        operation.$operator = operator;

        const rightOperand: OperandNode = new OperandNode(['18'], IndexRange.create(0, 13, 0, 15), 'Decimal', '18.0');
        operation.$rightOperand = rightOperand;

        expect(operation.$leftOperand).toEqual(leftOperand);
        expect(operation.$rightOperand).toEqual(rightOperand);
        expect(operation.$operator).toEqual(operator);
    });

    test('getCompletionContainer with empty OperationNode, expected Empty', () => {
        const operation: OperationNode = new OperationNode(null, null, null, [], IndexRange.create(0, 0, 0, 0));

        const positionParameter = Position.create(0, 0);

        const actual: StateTransition[] = operation.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(OperandTransition);
    });

    test('getCompletionContainer with OperationNode with staticOperand, expected Operands', () => {
        const leftOperand: OperandNode = new OperandNode(['Alter'], IndexRange.create(0, 0, 0, 5), 'Decimal', 'Alter');
        const operation = new OperationNode(leftOperand, null, null, [], IndexRange.create(0, 0, 0, 0));

        const positionParameter = Position.create(0, 6);

        const actual: StateTransition[] = operation.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(OperatorTransition);
    });

    test('getCompletionContainer with OperationNode with staticOperand, expected correct Datatype', () => {
        const leftOperand: OperandNode = new OperandNode(['Alter'], IndexRange.create(0, 0, 0, 5), 'Decimal', 'Alter');
        const operation = new OperationNode(leftOperand, null, null, [], IndexRange.create(0, 0, 0, 0));

        const positionParameter = Position.create(0, 6);

        const expected: string = 'Decimal';
        const actual: string | undefined =
            (operation.getCompletionContainer(positionParameter).$transitions[0] as OperatorTransition)!.$dataType;

        expect(actual).toEqual(expected);
    });

    test('getCompletionContainer with OperationNode with staticArrayOperand, expected Operands', () => {
        const item: OperandNode = new OperandNode(['Alter'], IndexRange.create(0, 0, 0, 5), 'Decimal', 'Alter');
        const leftOperand: ArrayOperandNode = new ArrayOperandNode([item], ['Alter'], IndexRange.create(0, 0, 0, 5), 'Decimal', 'Alter');
        const operation = new OperationNode(leftOperand, null, null, [], IndexRange.create(0, 0, 0, 0));

        const positionParameter = Position.create(0, 6);

        const actual: StateTransition[] = operation.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(OperatorTransition);
    });

    test('getCompletionContainer with OperationNode with staticFunctionOperand, expected Operands', () => {
        const item: OperandNode = new OperandNode(['Alter'], IndexRange.create(0, 0, 0, 5), 'Decimal', 'Alter');
        const leftOperand: FunctionOperandNode =
            new FunctionOperandNode([item], ['Alter'], IndexRange.create(0, 0, 0, 5), 'Decimal', 'Alter', 'Decimal');
        const operation = new OperationNode(leftOperand, null, null, [], IndexRange.create(0, 0, 0, 0));

        const positionParameter = Position.create(0, 6);

        const actual: StateTransition[] = operation.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(OperatorTransition);
    });

    test('getCompletionContainer with OperationNode with staticFunctionOperand, expected correct DataType', () => {
        const item: OperandNode =
            new OperandNode(
                ['Einkaufsliste.Preis'], IndexRange.create(0, 'Summe von'.length + 1, 0, 'Einkaufsliste.Preis'.length), 'Decimal', 'Einkaufsliste.Preis'
            );
        const leftOperand: FunctionOperandNode =
            new FunctionOperandNode([item], ['Summe von Einkaufsliste.Preis'], IndexRange.create(0, 0, 0, 'Summe von Einkaufsliste.Preis'.length), 'Decimal', 'Alter', 'Decimal');
        const operation = new OperationNode(leftOperand, null, null, [], IndexRange.create(0, 0, 0, 'Summe von Einkaufsliste.Preis'.length));

        const positionParameter = Position.create(0, 'Summe von Einkaufsliste.Preis'.length + 1);

        const actual: StateTransition[] = operation.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(OperatorTransition);
    });

    test('getCompletionContainer with OperationNode with Operand and Operation, expected Operator', () => {
        const leftOperand: OperandNode = new OperandNode(['Alter'], IndexRange.create(0, 0, 0, 5), 'Decimal', 'Alter');
        const operator: OperatorNode = new OperatorNode(['gleich'], IndexRange.create(0, 6, 0, 12), 'Boolean', 'EQUALS', 'Object');
        const operation = new OperationNode(leftOperand, operator, null, [], IndexRange.create(0, 0, 0, 12));

        const positionParameter = Position.create(0, 13);

        const actual: StateTransition[] = operation.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(OperandTransition);
    });

    // tslint:disable-next-line: max-line-length
    test('getCompletionContainer with OperationNode with Operand and Operation, expected correct OperatorDatatype', () => {
        const leftOperand: OperandNode = new OperandNode(['Alter'], IndexRange.create(0, 0, 0, 5), 'Decimal', 'Alter');
        const operator: OperatorNode = new OperatorNode(['gleich'], IndexRange.create(0, 6, 0, 12), 'Boolean', 'EQUALS', 'Object');
        const operation = new OperationNode(leftOperand, operator, null, [], IndexRange.create(0, 0, 0, 12));

        const positionParameter = Position.create(0, 13);

        const expected: string = 'Decimal';

        const transition = (operation.getCompletionContainer(positionParameter).$transitions[0] as OperatorTransition);
        const actual: string | null = transition.$dataType;

        expect(actual).toEqual(expected);
    });

    test('getCompletionContainer with complete OperationNode, expected Operands', () => {
        const leftOperand: OperandNode = new OperandNode(['Alter'], IndexRange.create(0, 0, 0, 5), 'Decimal', 'Alter');
        const operator: OperatorNode = new OperatorNode(['gleich'], IndexRange.create(0, 6, 0, 12), 'Boolean', 'EQUALS', 'Object');
        const rightOperand: OperandNode = new OperandNode(['18'], IndexRange.create(0, 13, 0, 15), 'Decimal', '18.0');
        const operation =
            new OperationNode(leftOperand, operator, rightOperand, ['Alter gleich 18'], IndexRange.create(0, 0, 0, 15));

        const positionParameter = Position.create(0, 16);

        const actual: StateTransition[] = operation.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(ConnectionTransition);
    });

    test('getCompletionContainer with OperationNode with staticFunctionOperand, expected FunctionOperand and ConnectedOperation', () => {
        const leftOperand: OperandNode = new OperandNode(['18'], IndexRange.create(0, 0, 0, 2), 'Decimal', '18.0');
        const operator: OperatorNode = new OperatorNode(['gleich'], IndexRange.create(0, 3, 0, 9), 'Boolean', 'EQUALS', 'Object');
        const item: OperandNode = new OperandNode(['Einkaufsliste.Preis'], IndexRange.create(0, 20, 0, 39), 'Decimal', 'Einkaufsliste.Preis');
        const rightOperand: FunctionOperandNode =
            new FunctionOperandNode([item], ['Summe von Einkaufsliste.Preis'], IndexRange.create(0, 10, 0, 39), 'Decimal', 'Alter', 'Decimal');
        const operation =
            new OperationNode(leftOperand, operator, rightOperand, ['Alter'], IndexRange.create(0, 0, 0, 39));

        const positionParameter = Position.create(0, 40);

        const actual: StateTransition[] = operation.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(ConnectionTransition);
    });

    test('getCompletionContainer with OperationNode with staticArrayOperand, expected FunctionOperand and ConnectedOperation', () => {
        const leftOperand: OperandNode = new OperandNode(['18'], IndexRange.create(0, 0, 0, 2), 'Decimal', '18.0');
        const operator: OperatorNode = new OperatorNode(['gleich'], IndexRange.create(0, 3, 0, 9), 'Boolean', 'EQUALS', 'Object');
        const item: OperandNode = new OperandNode(['Alter'], IndexRange.create(0, 10, 0, 15), 'Decimal', 'Alter');
        const rightOperand: ArrayOperandNode = new ArrayOperandNode([item], ['Alter'], IndexRange.create(0, 10, 0, 15), 'Decimal', 'Alter');
        const operation =
            new OperationNode(leftOperand, operator, rightOperand, ['Alter'], IndexRange.create(0, 10, 0, 15));

        const positionParameter = Position.create(0, 16);

        const actual: StateTransition[] = operation.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(ConnectionTransition);
    });

    test('getCompletionContainer with complete OperationNode and position after leftOperand, expected Operands', () => {
        const leftOperand: OperandNode = new OperandNode(['Alter'], IndexRange.create(0, 0, 0, 5), 'Decimal', 'Alter');
        const operator: OperatorNode = new OperatorNode(['gleich'], IndexRange.create(0, 6, 0, 12), 'Boolean', 'EQUALS', 'Object');
        const rightOperand: OperandNode = new OperandNode(['18'], IndexRange.create(0, 13, 0, 15), 'Decimal', '18.0');
        const operation =
            new OperationNode(leftOperand, operator, rightOperand, ['Alter gleich 18'], IndexRange.create(0, 0, 0, 15));

        const positionParameter = Position.create(0, 6);

        const actual: StateTransition[] = operation.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(EmptyTransition);
    });

    test('getCompletionContainer with complete OperationNode and position after operator, expected Operands', () => {
        const leftOperand: OperandNode = new OperandNode(['Alter'], IndexRange.create(0, 0, 0, 5), 'Decimal', 'Alter');
        const operator: OperatorNode = new OperatorNode(['gleich'], IndexRange.create(0, 6, 0, 12), 'Boolean', 'EQUALS', 'Object');
        const rightOperand: OperandNode = new OperandNode(['18'], IndexRange.create(0, 13, 0, 15), 'Decimal', '18.0');
        const operation =
            new OperationNode(leftOperand, operator, rightOperand, ['Alter gleich 18'], IndexRange.create(0, 0, 0, 15));

        const positionParameter = Position.create(0, 13);

        const actual: StateTransition[] = operation.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(EmptyTransition);
    });

    // tslint:disable-next-line: max-line-length
    test('getCompletionContainer with complete OperationNode and position before leftOperand, expected Operands', () => {
        const leftOperand: OperandNode = new OperandNode(['Alte'], IndexRange.create(0, 1, 0, 5), 'Decimal', 'Alte');
        const operator: OperatorNode = new OperatorNode(['gleich'], IndexRange.create(0, 6, 0, 12), 'Boolean', 'EQUALS', 'Object');
        const rightOperand: OperandNode = new OperandNode(['18'], IndexRange.create(0, 13, 0, 15), 'Decimal', '18.0');
        const operation =
            new OperationNode(leftOperand, operator, rightOperand, ['Alter gleich 18'], IndexRange.create(0, 0, 0, 15));

        const positionParameter = Position.create(0, 1);

        const actual: StateTransition[] = operation.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(EmptyTransition);
    });

    // tslint:disable-next-line: max-line-length
    test('getCompletionContainer with complete OperationNode and position after rightOperand, expected Connection', () => {
        const leftOperand: OperandNode = new OperandNode(['Alte'], IndexRange.create(0, 1, 0, 5), 'Decimal', 'Alte');
        const operator: OperatorNode = new OperatorNode(['gleich'], IndexRange.create(0, 6, 0, 12), 'Boolean', 'EQUALS', 'Object');
        const rightOperand: OperandNode = new OperandNode(['18'], IndexRange.create(0, 13, 0, 15), 'Decimal', '18.0');
        const operation =
            new OperationNode(leftOperand, operator, rightOperand, ['Alter gleich 18'], IndexRange.create(0, 0, 0, 15));

        const positionParameter = Position.create(0, 16);

        const actual: StateTransition[] = operation.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(ConnectionTransition);
    });

    test('getCompletionContainer with incomplete OperationNode and invalid position, expected Operands', () => {
        const leftOperand: OperandNode = new OperandNode(['Alte'], IndexRange.create(0, 1, 0, 5), 'Decimal', 'Alte');
        const operator: OperatorNode = new OperatorNode(['gleich'], IndexRange.create(0, 8, 0, 14), 'Boolean', 'EQUALS', 'Object');
        const operation =
            new OperationNode(leftOperand, operator, null, ['Alter gleich 18'], IndexRange.create(0, 0, 0, 15));

        const positionParameter = Position.create(0, 7);

        const actual: StateTransition[] = operation.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(EmptyTransition);
    });

    test('getCompletionContainer with incomplete OperationNode and name-filter, expected Operands', () => {
        const leftOperand: OperandNode = new OperandNode(['Alter'], IndexRange.create(0, 0, 0, 5), 'Decimal', 'Alter');
        const operator: OperatorNode = new OperatorNode(['gleich'], IndexRange.create(0, 8, 0, 14), 'Boolean', 'EQUALS', 'Object');
        const operation =
            new OperationNode(leftOperand, operator, null, ['Alter gleich 18'], IndexRange.create(0, 0, 0, 15));

        const positionParameter = Position.create(0, 15);

        const expected: string[] = ['Alter'];
        const actual: string[] | undefined | null =
            (operation.getCompletionContainer(positionParameter).$transitions[0] as OperandTransition).$nameFilter;
        expect(actual).toEqual(expected);
    });

    test('OperationNode getter test', () => {
        const errorMessage: string = 'This is an error';
        const operationNode: OperationNode =
            new OperationNode(null, null, null, [errorMessage], IndexRange.create(0, 0, 0, errorMessage.length));

        expect(operationNode.$leftOperand).toEqual(null);
        expect(operationNode.$rightOperand).toEqual(null);
        expect(operationNode.$operator).toEqual(null);
    });

    test('getChildren without child, expect no children', () => {
        const errorMessage: string = 'This is an error';
        const operationNode: OperationNode =
            new OperationNode(null, null, null, [errorMessage], IndexRange.create(0, 0, 0, errorMessage.length));

        const actual: GenericNode[] = operationNode.getChildren();
        const expected: GenericNode[] = [];

        expect(actual).toEqual(expected);
    });

    test('getChildren with left operand, expect one child', () => {
        const operand: string = 'Test';
        const operandNode: OperandNode =
            new OperandNode([operand], IndexRange.create(0, 0, 0, operand.length), 'String', operand);
        const operationNode: OperationNode =
            new OperationNode(operandNode, null, null, [operand], IndexRange.create(0, 0, 0, operand.length));

        const actual: GenericNode[] = operationNode.getChildren();
        const expected: GenericNode[] = [operandNode];

        expect(actual).toEqual(expected);
    });

    test('getChildren with left operand, expect one child', () => {
        const operand: string = 'Test';
        const left: OperandNode =
            new OperandNode([operand], IndexRange.create(0, 0, 0, operand.length), 'String', operand);
        const operator: OperatorNode =
            new OperatorNode(['kleiner'], IndexRange.create(0, 0, 0, 0), 'Boolean', 'kleiner', 'Decimal');
        const operationNode: OperationNode =
            new OperationNode(
                left, operator, null, ['Test kleiner'], IndexRange.create(0, 0, 0, 'Test kleiner'.length)
            );

        const actual: GenericNode[] = operationNode.getChildren();
        const expected: GenericNode[] = [left, operator];

        expect(actual).toEqual(expected);
    });

    test('getChildren with left operand, expect one child', () => {
        const operand: string = 'Test';
        const left: OperandNode =
            new OperandNode([operand], IndexRange.create(0, 0, 0, operand.length), 'String', operand);
        const operator: OperatorNode =
            new OperatorNode(['kleiner'], IndexRange.create(0, 0, 0, 0), 'Boolean', 'kleiner', 'Decimal');
        const right: OperandNode =
            new OperandNode([operand], IndexRange.create(0, 0, 0, operand.length), 'String', operand);
        const operationNode: OperationNode =
            new OperationNode(left, operator, right, ['Test kleiner Test'], IndexRange.create(0, 0, 0, 'Test kleiner Test'.length));

        const actual: GenericNode[] = operationNode.getChildren();
        const expected: GenericNode[] = [left, operator, right];

        expect(actual).toEqual(expected);
    });

    test('getHoverContent without content, expect not empty content', () => {
        const errorMessage: string = 'This is an error';
        const operationNode: OperationNode =
            new OperationNode(null, null, null, [errorMessage], IndexRange.create(0, 0, 0, errorMessage.length));

        const actual = operationNode.getHoverContent();

        expect(actual).not.toBeNull();
    });

    test('getHoverContent with content which is incomplete, expect not empty content', () => {
        const operand: string = 'Test';
        const operandNode: OperandNode =
            new OperandNode([operand], IndexRange.create(0, 0, 0, operand.length), 'String', operand);
        const operationNode: OperationNode =
            new OperationNode(operandNode, null, null, [operand], IndexRange.create(0, 0, 0, operand.length));

        const actual = operationNode.getHoverContent();

        expect(actual).not.toBeNull();
    });

    test('getHoverContent with content which is complete, expect not empty content', () => {
        const operand: string = 'Test';
        const operandNode: OperandNode =
            new OperandNode([operand], IndexRange.create(0, 0, 0, operand.length), 'String', operand);
        const arrayOperandNode: ArrayOperandNode =
            new ArrayOperandNode(
                [operandNode], [operand], IndexRange.create(0, 0, 0, operand.length), 'String', operand
            );
        const operationNode: OperationNode =
            new OperationNode(arrayOperandNode, null, null, [operand], IndexRange.create(0, 0, 0, operand.length));

        const actual = operationNode.getHoverContent();

        expect(actual).not.toBeNull();
    });

    test('getBeautifiedContent without children, expect not empty content', () => {
        const errorMessage: string = 'This is an error';
        const operationNode: OperationNode =
            new OperationNode(null, null, null, [errorMessage], IndexRange.create(0, 0, 0, errorMessage.length));

        const actual = operationNode.getBeautifiedContent(initializer.$server.aliasHelper);

        expect(actual).toEqual(errorMessage);
    });

    test('getBeautifiedContent with children, expect not empty content', () => {
        const operand: string = 'Test';
        const operandNode: OperandNode =
            new OperandNode([operand], IndexRange.create(0, 0, 0, operand.length), 'String', operand);
        const operationNode: OperationNode =
            new OperationNode(operandNode, null, null, [operand], IndexRange.create(0, 0, 0, operand.length));

        const actual = operationNode.getBeautifiedContent(initializer.$server.aliasHelper);

        expect(actual).toEqual(operand);
    });

    test('getSemanticalSugarOfOperator with duplicate operator, expect not used operator', () => {
        const operand: string = 'Test';
        const left: OperandNode =
            new OperandNode([operand], IndexRange.create(0, 0, 0, operand.length), 'String', operand);
        const operator: OperatorNode =
            new OperatorNode(['kleiner'], IndexRange.create(0, 0, 0, 0), 'Boolean', 'kleiner', 'Decimal');
        const right: OperandNode =
            new OperandNode([operand], IndexRange.create(0, 0, 0, operand.length), 'String', operand);
        const operationNode: OperationNode =
            new OperationNode(left, operator, right, ['Test ist kleiner Test'], IndexRange.create(0, 0, 0, 'Test kleiner Test'.length));

        const actual: string = operationNode['getSemanticalSugarOfOperator']();
        const expected: string = 'ist';

        expect(actual.trim()).toEqual(expected);
    });

    // tslint:disable-next-line: max-line-length
    test('getSemanticalSugarOfOperator with duplicate operator but without right operand, expect not used operator', () => {
        const operand: string = 'Test';
        const left: OperandNode =
            new OperandNode([operand], IndexRange.create(0, 0, 0, operand.length), 'String', operand);
        const operator: OperatorNode =
            new OperatorNode(['kleiner'], IndexRange.create(0, 0, 0, 0), 'Boolean', 'kleiner', 'Decimal');
        const operationNode: OperationNode =
            new OperationNode(
                left, operator, null, ['Test ist kleiner'], IndexRange.create(0, 0, 0, 'Test ist kleiner'.length)
            );

        const actual: string = operationNode['getSemanticalSugarOfOperator']();
        const expected: string = 'ist';

        expect(actual.trim()).toEqual(expected);
    });

    // tslint:disable-next-line: max-line-length
    test('getSemanticalSugarOfOperator with duplicate operator but without any operand, expect not used operator', () => {
        const operator: OperatorNode =
            new OperatorNode(['kleiner'], IndexRange.create(0, 0, 0, 0), 'Boolean', 'kleiner', 'Decimal');
        const operationNode: OperationNode =
            new OperationNode(
                null, operator, null, [' ist kleiner'], IndexRange.create(0, 0, 0, ' ist kleiner'.length)
            );

        const actual: string = operationNode['getSemanticalSugarOfOperator']();
        const expected: string = 'ist';

        expect(actual.trim()).toEqual(expected);
    });

    test('getSemanticalSugarOfOperator without duplicate operator, expect not used operator', () => {
        const operand: string = 'Test';
        const left: OperandNode =
            new OperandNode([operand], IndexRange.create(0, 0, 0, operand.length), 'String', operand);
        const operator: OperatorNode =
            new OperatorNode(['kleiner'], IndexRange.create(0, 0, 0, 0), 'Boolean', 'kleiner', 'Decimal');
        const right: OperandNode =
            new OperandNode([operand], IndexRange.create(0, 0, 0, operand.length), 'String', operand);
        const operationNode: OperationNode =
            new OperationNode(left, operator, right, ['Test kleiner Test'], IndexRange.create(0, 0, 0, 'Test kleiner Test'.length));

        const actual: string = operationNode['getSemanticalSugarOfOperator']();
        const expected: string = '';

        expect(actual.trim()).toEqual(expected);
    });

    test('getPatternInformation with operation with single static string operand, expect static String', () => {
        const operand: string = 'Test';
        const left: OperandNode =
            new OperandNode([operand], IndexRange.create(0, 0, 0, operand.length), 'String', operand, true);
        const operationNode: OperationNode =
            new OperationNode(
                left, null, null, ['Test kleiner Test'], IndexRange.create(0, 0, 0, 'Test kleiner Test'.length)
            );

        const actual: ScopeEnum[] = operationNode.getPatternInformation(initializer.$server.aliasHelper)!.$capture;
        const expected: ScopeEnum[] = [ScopeEnum.StaticString];

        expect(actual).toEqual(expected);
    });

    test('getPatternInformation with operation with single static decimal operand, expect static Decimal', () => {
        const operand: string = 'Test';
        const left: OperandNode =
            new OperandNode([operand], IndexRange.create(0, 0, 0, operand.length), 'Decimal', operand, true);
        const operationNode: OperationNode =
            new OperationNode(
                left, null, null, ['Test kleiner Test'], IndexRange.create(0, 0, 0, 'Test kleiner Test'.length)
            );

        const actual: ScopeEnum[] = operationNode.getPatternInformation(initializer.$server.aliasHelper)!.$capture;
        const expected: ScopeEnum[] = [ScopeEnum.StaticNumber];

        expect(actual).toEqual(expected);
    });

    test('getPatternInformation with operation with single variable operand, expect variable', () => {
        const operand: string = 'Test';
        const left: OperandNode =
            new OperandNode([operand], IndexRange.create(0, 0, 0, operand.length), 'Decimal', operand);
        const operationNode: OperationNode =
            new OperationNode(
                left, null, null, ['Test kleiner Test'], IndexRange.create(0, 0, 0, 'Test kleiner Test'.length)
            );

        const actual: ScopeEnum[] = operationNode.getPatternInformation(initializer.$server.aliasHelper)!.$capture;
        const expected: ScopeEnum[] = [ScopeEnum.Variable];

        expect(actual).toEqual(expected);
    });

    test('getPatternInformation with operation with operand and operator, expect variable', () => {
        const operand: string = 'Test';
        const left: OperandNode =
            new OperandNode([operand], IndexRange.create(0, 0, 0, operand.length), 'String', operand);
        const operator: OperatorNode =
            new OperatorNode(['kleiner'], IndexRange.create(0, 0, 0, 0), 'Boolean', 'kleiner', 'Decimal');
        const operationNode: OperationNode =
            new OperationNode(
                left, operator, null, ['Test test kleiner'], IndexRange.create(0, 0, 0, 'Test kleiner'.length)
            );

        const actual: ScopeEnum[] = operationNode.getPatternInformation(initializer.$server.aliasHelper)!.$capture;
        const expected: ScopeEnum[] = [ScopeEnum.Variable, ScopeEnum.Empty, ScopeEnum.Keyword];

        expect(actual).toEqual(expected);
    });

    test('getPatternInformation with operation with operand and operator, expect variable', () => {
        const left: OperandNode =
            new OperandNode(['Test bla'], IndexRange.create(0, 0, 0, 4), 'String', 'Test');
        const operator: OperatorNode =
            new OperatorNode(['kleiner'], IndexRange.create(0, 9, 0, 16), 'Boolean', 'kleiner', 'Decimal');
        const right: OperandNode =
            new OperandNode(['bla Test'], IndexRange.create(0, 21, 0, 25), 'String', 'Test');
        const operationNode: OperationNode =
            new OperationNode(
                left, operator, right, ['Test bla kleiner bla Test'], IndexRange.create(0, 0, 0, 'Test bla kleiner bla Test'.length)
            );

        const actual: ScopeEnum[] = operationNode.getPatternInformation(initializer.$server.aliasHelper)!.$capture;
        const expected: ScopeEnum[] = [
            ScopeEnum.Variable, ScopeEnum.Empty, ScopeEnum.Keyword, ScopeEnum.Empty, ScopeEnum.Variable
        ];

        expect(actual).toEqual(expected);
    });
});
