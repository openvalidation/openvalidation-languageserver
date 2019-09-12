import "jest";
import { DocumentSymbolParams, SymbolInformation } from "vscode-languageserver";
import { DocumentSymbolProvider } from "../../src/provider/DocumentSymbolProvider";
import { TestInitializer } from "../TestInitializer";

describe("DocumentSymbol provider test", () => {
    var provider: DocumentSymbolProvider;

    function getParams(): DocumentSymbolParams {
        return {
            textDocument: {
                uri: "test.ov"
            }
        }
    }

    beforeEach(() => {
        var testInitializer = new TestInitializer(true);
        provider = testInitializer.documentSymbolProvider;
    });

    test("Verify provider exists", () => {
        expect(provider).not.toBeNull();
    });

    test("findDocumentSymbols with empty document", () => {
        var tmpTestInitializer = new TestInitializer(false);
        var tmpProvider = tmpTestInitializer.documentSymbolProvider;

        var expected: Location[] = [];
        var actual = tmpProvider.findDocumentSymbols(getParams());

        expect(actual).toEqual(expected);
    });

    test("findDocumentSymbols with full document, expect one variable", () => {
        var expectedLength: number = 1;
        var expectedName: string = "Minderjährig";

        var actual = provider.findDocumentSymbols(getParams());

        expect(actual.length).toEqual(expectedLength);
        expect(actual[0].name).toEqual(expectedName);
    });


    test("findDocumentSymbols with wrong document-uri, expect empty array", () => {
        var expected: SymbolInformation[] = [];

        var input = {
            textDocument: {
                uri: "wrongUri"
            }
        }
        var actual = provider.findDocumentSymbols(input);

        expect(actual).toEqual(expected);
    });
});