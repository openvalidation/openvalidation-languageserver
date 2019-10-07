import "jest";
import { CompletionItem, Position } from "vscode-languageserver";
import { CompletionProvider } from "../../src/provider/CompletionProvider";
import { TestInitializer } from "../TestInitializer";
// import { GenericNode } from "../../src/data-model/syntax-tree/GenericNode";
// import { OperandNode } from "../../src/data-model/syntax-tree/element/operation/operand/OperandNode";
// import { IndexRange } from "../../src/data-model/syntax-tree/IndexRange";
// import { CompletionResponse } from "../../src/rest-interface/response/CompletionResponse";
// import { Variable } from "../../src/data-model/syntax-tree/Variable";
// import { OperatorNode } from "../../src/data-model/syntax-tree/element/operation/operand/OperatorNode";

describe("Completion provider test", () => {
    var provider: CompletionProvider;

    beforeEach(() => {
        var testInitializer = new TestInitializer(true);
        provider = testInitializer.completionProvider;
    });

    test("Verify provider exists", () => {
        expect(provider).not.toBeNull();
    });

    test("completionResolve with default item, expect same item", () => {
        var expected: CompletionItem = CompletionItem.create("Test-Item");

        var input: CompletionItem = CompletionItem.create("Test-Item");
        var actual = provider.completionResolve(input);

        expect(actual).toEqual(expected);
    });

    test("completionForParsedElement with null, expected global items", () => {
        var expectedLength: number = 3;
        var actual: CompletionItem[] | null = provider["completionForParsedElement"](null, [], Position.create(0, 0), "");

        expect(actual!.length).toEqual(expectedLength);
    });
});