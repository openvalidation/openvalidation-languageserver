import 'jest';
import { CompletionItem } from 'vscode-languageserver';
import { AliasHelper } from '../../../src/aliases/AliasHelper';
import { Variable } from '../../../src/data-model/syntax-tree/Variable';
import { CompletionBuilder } from '../../../src/provider/code-completion/CompletionBuilder';
import { TestInitializer } from '../../Testinitializer';

describe('CompletionGenerator tests', () => {
    let initializer: TestInitializer;

    beforeEach(() => {
        initializer = new TestInitializer(true);
    });

    test('default with empty parameters, expect globals', () => {
        const expected: CompletionItem[] = [];
        const actual: CompletionItem[] = CompletionBuilder.default([], initializer.$server);

        expect(actual).not.toEqual(expected);
    });

    test('addOperandsWithTypeOfGivenOperand with empty builder, expect the same builder', () => {
        const builder: CompletionBuilder =
            new CompletionBuilder([], new AliasHelper(), { complexData: [], dataProperties: [] });

        const expected: CompletionBuilder = builder;
        const actual: CompletionBuilder = builder.addOperandsWithTypeOfGivenOperand('Something');

        expect(actual).toEqual(expected);
    });

    test('addOperandsWithTypeOfGivenOperand with empty builder, expect another builder', () => {
        const builder: CompletionBuilder = new CompletionBuilder([new Variable('test', 'Decimal')],
            new AliasHelper(), {
            complexData: [{ child: 'Alter', parent: 'Student' }],
            dataProperties: [
                { name: 'Student.Alter', type: 'Decimal' },
                { name: 'Student', type: 'Object' },
                { name: 'Alter', type: 'Decimal' }
            ]
        });

        const expected: CompletionItem[] = [];
        const actual: CompletionItem[] = builder.addOperandsWithTypeOfGivenOperand('Student.Alter').build();

        expect(actual).not.toEqual(expected);
    });
});
