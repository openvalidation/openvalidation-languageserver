import "jest";
import { TextDocument, TextDocumentChangeEvent } from "vscode-languageserver";
import { DocumentActionProvider } from "../../src/provider/DocumentActionProvider";
import { TestInitializer } from "../TestInitializer";

describe("DocumentAction provider test", () => {
    var provider: DocumentActionProvider;

    function getChangeEvent(uri: string): TextDocumentChangeEvent {
        var textDocument = TextDocument.create(uri, "ov", 1, "KOMMENTAR bla");

        return {
            document: textDocument
        };
    }

    beforeEach(() => {
        var testInitializer = new TestInitializer(true);
        provider = testInitializer.documentActionProvider;
    });

    test("Verify provider exists", () => {
        expect(provider).not.toBeNull();
    });

    test("validate with invalid uri, expect no error", () => {
        provider.validate("invalidUri");
        expect(provider).not.toBeNull();
    });

    test("validate with valid uri, expect no error", () => {
        provider.validate("test.ov");
        expect(provider).not.toBeNull();
    });

    test("close with invalid uri, expect no error", () => {
        provider.close(getChangeEvent("invalidUri"));
        expect(provider).not.toBeNull();
    });

    test("close with valid uri, expect no error", () => {
        provider.close(getChangeEvent("test.ov"));
        expect(provider).not.toBeNull();
    });
});