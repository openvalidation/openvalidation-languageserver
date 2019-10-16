import "jest";
import { DocumentSymbolParams, SymbolInformation } from "vscode-languageserver";
import { DocumentSymbolProvider } from "../../src/provider/DocumentSymbolProvider";
import { TestInitializer } from "../TestInitializer";

describe("DocumentSymbol provider test", () => {
  let provider: DocumentSymbolProvider;

  function getParams(): DocumentSymbolParams {
    return {
      textDocument: {
        uri: "test.ov"
      }
    };
  }

  beforeEach(() => {
    const testInitializer = new TestInitializer(true);
    provider = testInitializer.documentSymbolProvider;
  });

  test("Verify provider exists", () => {
    expect(provider).not.toBeNull();
  });

  test("findDocumentSymbols with empty document", () => {
    const tmpTestInitializer = new TestInitializer(false);
    const tmpProvider = tmpTestInitializer.documentSymbolProvider;

    const expected: Location[] = [];
    const actual = tmpProvider.findDocumentSymbols(getParams());

    expect(actual).toEqual(expected);
  });

  test("findDocumentSymbols with full document, expect one variable", () => {
    const expectedLength: number = 1;
    const expectedName: string = "Minderjährig";

    const actual = provider.findDocumentSymbols(getParams());

    expect(actual.length).toEqual(expectedLength);
    expect(actual[0].name).toEqual(expectedName);
  });

  test("findDocumentSymbols with wrong document-uri, expect empty array", () => {
    const expected: SymbolInformation[] = [];

    const input = {
      textDocument: {
        uri: "wrongUri"
      }
    };
    const actual = provider.findDocumentSymbols(input);

    expect(actual).toEqual(expected);
  });
});
