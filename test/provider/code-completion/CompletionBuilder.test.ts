import { CompletionBuilder } from '../../../src/provider/code-completion/CompletionBuilder';
import "jest";
import { TestInitializer } from '../../Testinitializer';
import { CompletionItem } from 'vscode-languageserver';
import { AliasHelper } from '../../../src/aliases/AliasHelper';

describe("CompletionGenerator tests", () => {
    var initializer: TestInitializer;

    beforeEach(() => {
        initializer = new TestInitializer(true);
    });

    test("default with empty parameters, expect globals", () => {
        var expected: CompletionItem[] = [];
        var actual: CompletionItem[] = CompletionBuilder.default([], initializer.server);

        expect(actual).not.toEqual(expected);
    });

    test("addOperandsWithTypeOfGivenOperand with empty builder, expect the same builder", () => {
        var builder: CompletionBuilder = new CompletionBuilder([], new AliasHelper(), { complexData: [], dataProperties: [] });

        var expected: CompletionBuilder = builder;
        var actual: CompletionBuilder = builder.addOperandsWithTypeOfGivenOperand("Something");

        expect(actual).toEqual(expected);
    });

    // test("addOperandsWithTypeOfGivenOperand with empty builder, expect another builder", () => {
    //     var builder: CompletionBuilder = new CompletionBuilder([], new AliasHelper(), { complexData: [{ child: "Alter", parent: "Student" }], dataProperties: [{ name: "Student.Alter", type: "Decimal" }] });

    //     var expected: CompletionItem[] = builder.build();
    //     var actual: CompletionItem[] = builder.addOperandsWithTypeOfGivenOperand("Something").build();

    //     expect(actual).not.toEqual(expected);
    // });
});