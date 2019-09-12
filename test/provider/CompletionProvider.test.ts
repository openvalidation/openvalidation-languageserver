import "jest";
import { CompletionItem, Position, TextDocumentPositionParams } from "vscode-languageserver";
import { CompletionProvider } from "../../src/provider/CompletionProvider";
import { TestInitializer } from "../TestInitializer";

describe("Completion provider test", () => {
    var provider: CompletionProvider;

    // function getParams(position: Position): TextDocumentPositionParams {
    //     return {
    //         textDocument: {
    //             uri: "test.ov"
    //         },
    //         position: position
    //     }
    // }

    beforeEach(() => {
        var testInitializer = new TestInitializer(true);
        provider = testInitializer.completionProvider;
    });

    test("Verify provider exists", () => {
        expect(provider).not.toBeNull();
    });

    // test("completion with empty document, expect default keywords", async () => {
    //     var tmpTestInitializer = new TestInitializer(false);
    //     var tmpProvider = tmpTestInitializer.completionProvider;

    //     var expectedLength: number = 4;
    //     var actual = await (tmpProvider as any)["completionByText"]("", getParams(Position.create(0, 0)));
    //     expect(actual!.length).toEqual(expectedLength);
    // });

    test("completion with invalid document-uri, expect empty list", async () => {
        var expectedLength: number = 0;

        var inputParameter: TextDocumentPositionParams = {
            textDocument: {
                uri: "invalidUri"
            },
            position: Position.create(0, 0)
        }
        var actual = await provider.completion(inputParameter);
        expect(actual!.length).toEqual(expectedLength);
    });

    // test("completion with valid document but invalid position, expect default keywords", async () => {
    //     var expectedLength: number = 3;
    //     var actual = await provider.completion(getParams(Position.create(0, 0)));
    //     expect(actual!.length).toEqual(expectedLength);
    // });

    // test("completion with valid document and valid position, expect default keywords", async () => {
    //     var expectedLength: number = 3;
    //     var actual = await provider.completion(getParams(Position.create(15, 0)))
    //     expect(actual!.length).toEqual(expectedLength);
    // });

    test("completionResolve with default item, expect same item", () => {
        var expected: CompletionItem = CompletionItem.create("Test-Item");

        var input: CompletionItem = CompletionItem.create("Test-Item");
        var actual = provider.completionResolve(input);

        expect(actual).toEqual(expected);
    });
});