import "jest";
import { CompletionItem, Position, TextDocument, CompletionParams, CompletionTriggerKind } from "vscode-languageserver";
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
    var testInitializer: TestInitializer;

    beforeEach(() => {
        testInitializer = new TestInitializer(true);
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

    test("completionForParsedElement with null, expected global items", () => {
        var expectedLength: number = 3;
        var actual: CompletionItem[] | null = provider["completionForParsedElement"](null, [], Position.create(0, 0), "");

        expect(actual!.length).toEqual(expectedLength);
    });

    test("completionForParsedElement with null, expected global items", () => {
        var expectedLength: number = 3;
        var actual: CompletionItem[] | null = provider["completionForParsedElement"](testInitializer.getInorrectCompletionResponse(), [], Position.create(3, 0), "");

        expect(actual!.length).toEqual(expectedLength);
    });

    test("completionForParsedElement with null, expected global items", () => {
        var expectedLength: number = 0;
        var actual: CompletionItem[] | null = provider["completionForParsedElement"](testInitializer.getCorrectCompletionResponse(), [], Position.create(5, 0), "");

        expect(actual!.length).toEqual(expectedLength);
    });

    test("completionByText with null, expected global items", async () => {
        var document: TextDocument = {
            uri: "test.ov",
            languageId: "ov",
            version: 0.1,
            getText: () => "",
            positionAt: () => Position.create(0, 0),
            offsetAt: () => 0,
            lineCount: 0
        };
        var params: CompletionParams = {
            textDocument: {
                uri: "test.ov"
            },
            position: Position.create(0, 0),
            context: {
                triggerKind: CompletionTriggerKind.Invoked,
                triggerCharacter: ""
            }
        }

        var actual: CompletionItem[] | null = await provider["completionByText"](document, params)!;
        var expectedLength: number = 0;

        expect(actual!.length).toEqual(expectedLength);
    });
});