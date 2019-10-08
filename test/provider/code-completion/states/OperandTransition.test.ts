import 'jest';
import { Variable } from '../../../../src/data-model/syntax-tree/Variable';
import { CompletionBuilder } from '../../../../src/provider/code-completion/CompletionBuilder';
import { OperandTransition } from '../../../../src/provider/code-completion/states/OperandTransition';
import { TestInitializer } from '../../../Testinitializer';

describe('OperandTransition.isValid Tests', () => {
    test('Empty transition params, expected everything to be valid', () => {
        const transition: OperandTransition = new OperandTransition();

        const expected = true;
        const actual = transition.isValid('Something', 'Something');

        expect(actual).toEqual(expected);
    });

    test('Set datatype transition params, expected attribute to be valid', () => {
        const transition: OperandTransition = new OperandTransition('Something');

        const expected = true;
        const actual = transition.isValid('Something', 'Something');

        expect(actual).toEqual(expected);
    });

    test('Set datatype transition params, expected attribute to be invalid', () => {
        const transition: OperandTransition = new OperandTransition('Something');

        const expected = false;
        const actual = transition.isValid('Something', 'Something Else');

        expect(actual).toEqual(expected);
    });

    test('Set nameFilter transition params, expected attribute to be invalid', () => {
        const transition: OperandTransition = new OperandTransition(undefined, ['Something']);

        const expected = false;
        const actual = transition.isValid('Something', 'Something Else');

        expect(actual).toEqual(expected);
    });

    test('Set nameFilter transition params, expected attribute to be valid', () => {
        const transition: OperandTransition = new OperandTransition(undefined, ['Something']);

        const expected = true;
        const actual = transition.isValid('Something Else', 'Something Else');

        expect(actual).toEqual(expected);
    });

    test('Set nameFilter with complex Schema transition params, expected attribute to be valid', () => {
        const transition: OperandTransition = new OperandTransition(undefined, ['Something.Else']);

        const expected = false;
        const actual = transition.isValid('Else', 'Something Else');

        expect(actual).toEqual(expected);
    });

    test('Set nameFilter with complex Schema transition params, expected attribute to be valid', () => {
        const transition: OperandTransition = new OperandTransition(undefined, ['Something.Else']);

        const expected = false;
        const actual = transition.isValid('Something.Else', 'Something Else');

        expect(actual).toEqual(expected);
    });

    test('isValid undefined nameFilter and dataType, expected true', () => {
        const operandTransition: OperandTransition = new OperandTransition('Decimal');

        const expected: boolean = false;
        const actual: boolean = operandTransition.isValid('Something', 'Object');

        expect(actual).toEqual(expected);
    });

    test('getCompletions with OperandTransition, expected more than zero completionItems', () => {
        const initializer: TestInitializer = new TestInitializer(true);
        const builder: CompletionBuilder =
            new CompletionBuilder(
                [new Variable('Alter', 'Decimal')], initializer.$server.aliasHelper, initializer.$server.schema);

        const operandTransition: OperandTransition = new OperandTransition();
        operandTransition.addCompletionItems(builder);

        const expectedLength: number = 0;
        const actualLength: number = builder.build().length;

        expect(actualLength).not.toEqual(expectedLength);
    });
});
