import "jest";
import { InitializeResult } from "vscode-languageserver";
import { TestInitializer } from "./Testinitializer";

describe("Dummy Tests", () => {
    var initializer: TestInitializer;

    beforeEach(() => {
        initializer = new TestInitializer(true);
    });

    test("initialize with empty params, expect no error", async () => {
        var actual: InitializeResult = await initializer.server["initialize"]({ rootPath: "test", rootUri: "test", processId: 20, capabilities: {}, workspaceFolders: null });

        expect(actual).not.toBeNull();
    });

    test("validateAndSetSchemaDefinition with default params, expect no error", () => {
        expect(() => initializer.server["validateAndSetSchemaDefinition"]({ schema: "Alter: 20", uri: "test.ov" })).not.toThrow(Error);
    });

    test("setLanguage with default params, expect no error", () => {
        expect(async () => await initializer.server["setLanguage"]({ language: "Java", uri: "test.ov" })).not.toThrow(Error);
    });

    test("setCulture with default params, expect no error", () => {
        expect(async () => await initializer.server["setCulture"]({ culture: "de", uri: "test.ov" })).not.toThrow(Error);
    });

    test("setAliases, expect no error", () => {
        expect(async () => await initializer.server["setAliases"]()).not.toThrow(Error);
    });

    test("setGeneratedSchema, expect no error", () => {
        expect(async () => await initializer.server["setGeneratedSchema"](initializer.mockNotEmptyLintingResponse())).not.toThrow(Error);
    });
});