import "jest";
import { MarkupContent, MarkupKind, Position, TextDocumentPositionParams } from "vscode-languageserver";
import { HoverProvider } from "../../src/provider/HoverProvider";
import { TestInitializer } from "../TestInitializer";

describe("Hover provider test", () => {
    var provider: HoverProvider;

    function getParams(position: Position): TextDocumentPositionParams {
        return {
            textDocument: {
                uri: "test.ov"
            },
            position: position
        }
    }

    beforeEach(() => {
        var testInitializer = new TestInitializer(true);
        provider = testInitializer.hoverProvider;
    });

    test("Verify provider exists", () => {
        expect(provider).not.toBeNull();
    });

    test("hover with empty document, expect null", async () => {
        var tmpTestInitializer = new TestInitializer(false);
        var tmpProvider = tmpTestInitializer.hoverProvider;

        var actual = await tmpProvider.hover(getParams(Position.create(0, 0)))
        expect(actual).toBeNull();
    });

    test("hover with valid document and invalid position, expect null", async () => {
        var actual = await provider.hover(getParams(Position.create(100, 0)))
        expect(actual).toBeNull();
    });

    test("hover with invalid document-uri, expect null", async () => {
        var inputParam: TextDocumentPositionParams = {
            textDocument: {
                uri: "invalidUri"
            },
            position: Position.create(100, 0)
        }

        var actual = await provider.hover(inputParam);
        expect(actual).toBeNull();
    });

    test("hover with valid document and Position {0, 1}, expect hover-documentation", async () => {
        var expectedHoverKind: MarkupKind = MarkupKind.Markdown;
        var actual = await provider.hover(getParams(Position.create(0, 1)));

        var actualHoverKind = (actual!.contents as MarkupContent).kind;
        expect(actualHoverKind).toEqual(expectedHoverKind);
    });
});