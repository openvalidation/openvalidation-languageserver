import "jest";
import { Position, RenameParams, WorkspaceEdit } from "vscode-languageserver";
import { RenameProvider } from "../../src/provider/RenameProvider";
import { TestInitializer } from "../TestInitializer";

describe("Rename provider test", () => {
    var provider: RenameProvider;

    function getParams(newName: string, position: Position): RenameParams {
        return {
            newName: newName,
            textDocument: {
                uri: "test.ov"
            },
            position: position
        }
    }

    beforeEach(() => {
        var testInitializer = new TestInitializer(true);
        provider = testInitializer.renameProvider;
    });

    test("Verify provider exists", () => {
        expect(provider).not.toBeNull();
    });

    test("rename with empty document, expect no edit", () => {
        var tmpTestInitializer = new TestInitializer(false);
        var tmpProvider = tmpTestInitializer.renameProvider;

        var expected: WorkspaceEdit = {};
        var actual = tmpProvider.rename(getParams("NewText", Position.create(0, 0)));

        expect(actual).toEqual(expected);
    });

    test("rename with valid document but invalid position, expect no edit", () => {
        var expected: WorkspaceEdit = {};
        var actual = provider.rename(getParams("NewText", Position.create(0, 0)));

        expect(actual).toEqual(expected);
    });

    test("rename with invalid documentUri, expect no edit", () => {
        var expected: WorkspaceEdit = {};

        var inputParams = getParams("NewText", Position.create(0, 0));
        inputParams.textDocument.uri = "invalidUri";

        var actual = provider.rename(inputParams);
        expect(actual).toEqual(expected);
    });

    test("rename with valid document and valid position of variable definition, expect old name don't appears anymore", () => {
        var expected: WorkspaceEdit = {};

        var variablePosition: Position = Position.create(6, 10);
        var actual = provider.rename(getParams("NewText", variablePosition));

        expect(actual).toEqual(expected);
    });

    test("rename with valid document and valid position of variable definition, expect old name don't appears anymore", () => {
        var expected: WorkspaceEdit = {};

        var variablePosition: Position = Position.create(6, 20);
        var actual = provider.rename(getParams("NewText", variablePosition));

        expect(actual).not.toEqual(expected);
    });
});
