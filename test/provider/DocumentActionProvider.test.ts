import "jest";
import { TextDocument, TextDocumentChangeEvent, Diagnostic, Range, Position } from "vscode-languageserver";
import { DocumentActionProvider } from "../../src/provider/DocumentActionProvider";
import { TestInitializer } from "../TestInitializer";
import { OvDocument } from "../../src/data-model/ov-document/OvDocument";

describe("DocumentAction provider test", () => {
    var provider: DocumentActionProvider;
    var testInitializer: TestInitializer;

    function getChangeEvent(uri: string): TextDocumentChangeEvent {
        var textDocument = TextDocument.create(uri, "ov", 1, "KOMMENTAR bla");

        return {
            document: textDocument
        };
    }

    beforeEach(() => {
        testInitializer = new TestInitializer(true);
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

    test("sendDiagnostics with valid document-uri and empty diagnostics, expect no error", () => {
        provider["sendDiagnostics"]("test.ov", []);
        expect(provider).not.toBeNull();
    });

    test("sendDiagnostics with valid document-uri and not empty diagnostics, expect no error", () => {
        provider["sendDiagnostics"]("test.ov", [Diagnostic.create(Range.create(0, 0, 0, 1), "Error!")]);
        expect(provider).not.toBeNull();
    });
    

    test("sendDiagnostics with invalid document, expect no error", () => {
        provider["cleanDiagnostics"](undefined);
        expect(provider).not.toBeNull();
    });

    test("sendDiagnostics with valid document, expect no error", () => {
        var document: TextDocument = {
            uri: "test.ov",
            languageId: "ov",
            version: 0.1,
            getText: () => "",
            positionAt: () => Position.create(0, 0),
            offsetAt: () => 0,
            lineCount: 0
        };
        provider["cleanDiagnostics"](document);
        expect(provider).not.toBeNull();
    });

    test("generateDiagnostics with empty response, expect no error", () => {
        var actual: Diagnostic[] = provider["generateDiagnostics"](testInitializer.mockEmptyLintingResponse());
        var expected: Diagnostic[] = []; 
        expect(actual).toEqual(expected);
    });

    test("generateDiagnostics with not empty response, expect no error", () => {
        var actualLength: number = provider["generateDiagnostics"](testInitializer.mockNotEmptyLintingResponse()).length;
        var expectedLength: number = 1; 
        expect(actualLength).toEqual(expectedLength);
    });

    test("generateDocumentWithAst with empty response, expect undefined", () => {
        var actual: OvDocument | undefined = provider["generateDocumentWithAst"](testInitializer.mockEmptyLintingResponse());
        var expected: OvDocument | undefined = undefined; 
        expect(actual).toEqual(expected);
    });

    test("generateDocumentWithAst with not empty response, expect ovDocument", () => {
        var actual: OvDocument | undefined = provider["generateDocumentWithAst"](testInitializer.mockNotEmptyLintingResponse());
        var notExpected: OvDocument | undefined = undefined; 
        expect(actual).not.toEqual(notExpected);
    });

    test("validateDocumentWithUri with invalid uri, expect no error", () => {
        provider["validateDocumentWithUri"]("invalid");
        expect(provider).not.toBeNull();
    });

    test("validateText with invalid uri but valid text, expect no error", () => {
        provider["validateText"]("invalid", "Kommentar hallo");
        expect(provider).not.toBeNull();
    });
});