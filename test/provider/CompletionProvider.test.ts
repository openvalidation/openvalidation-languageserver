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

    // test("completionForParsedElement with OperandNode, expected one operator", () => {
    //     var expectedLength: number = 1;
    //     var expectedType: CompletionItemKind = CompletionItemKind.Keyword;
    //     var expectedName: string = "EQUALS";

    //     var line: string = "Alter";
    //     var linesLength: number = line.length;
    //     var parameter: GenericNode = new OperandNode([line], IndexRange.create(0, 0, 0, linesLength), "Decimal", "Alter");
    //     var responseParameter: CompletionResponse | null = new CompletionResponse(parameter);
    //     var actual: CompletionItem[] | null = provider["completionForParsedElement"](responseParameter, [], Position.create(0, linesLength + 1));

    //     expect(actual!.length).toEqual(expectedLength);
    //     expect(actual![0].kind).toEqual(expectedType);
    //     expect(actual![0].label).toEqual(expectedName);
    // });

    // test("completionForParsedElement with OperatorNode, expected one operator", () => {
    //     var expectedLength: number = 1;
    //     var expectedType: CompletionItemKind = CompletionItemKind.Variable;
    //     var expectedName: string = "Something";

    //     var line: string = "GLEICH";
    //     var linesLength: number = line.length;
    //     var parameter: GenericNode = new OperatorNode([line], IndexRange.create(0, 0, 0, linesLength), "Boolean", "EQUALS", "Object");
    //     var responseParameter: CompletionResponse | null = new CompletionResponse(parameter);
    //     var actual: CompletionItem[] | null = provider["completionForParsedElement"](responseParameter, [new Variable(expectedName, "Decimal")], Position.create(0, linesLength + 1));

    //     expect(actual!.length).toEqual(expectedLength);
    //     expect(actual![0].kind).toEqual(expectedType);
    //     expect(actual![0].label).toEqual(expectedName);
    // });
});