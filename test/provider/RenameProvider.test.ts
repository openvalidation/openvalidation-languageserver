import "jest";
import { Position, RenameParams, WorkspaceEdit } from "vscode-languageserver";
import { RenameProvider } from "../../src/provider/RenameProvider";
import { TestInitializer } from "../TestInitializer";

describe("Rename provider test", () => {
  let provider: RenameProvider;

  function getParams(newName: string, position: Position): RenameParams {
    return {
      newName,
      textDocument: {
        uri: "test.ov"
      },
      position
    };
  }

  beforeEach(() => {
    const testInitializer = new TestInitializer(true);
    provider = testInitializer.renameProvider;
  });

  test("Verify provider exists", () => {
    expect(provider).not.toBeNull();
  });

  test("rename with empty document, expect no edit", () => {
    const tmpTestInitializer = new TestInitializer(false);
    const tmpProvider = tmpTestInitializer.renameProvider;

    const expected: WorkspaceEdit = {};
    const actual = tmpProvider.rename(
      getParams("NewText", Position.create(0, 0))
    );

    expect(actual).toEqual(expected);
  });

  test("rename with valid document but invalid position, expect no edit", () => {
    const expected: WorkspaceEdit = {};
    const actual = provider.rename(getParams("NewText", Position.create(0, 0)));

    expect(actual).toEqual(expected);
  });

  test("rename with invalid documentUri, expect no edit", () => {
    const expected: WorkspaceEdit = {};

    const inputParams = getParams("NewText", Position.create(0, 0));
    inputParams.textDocument.uri = "invalidUri";

    const actual = provider.rename(inputParams);
    expect(actual).toEqual(expected);
  });

  test("rename with valid document and valid position of variable definition, expect old name dont appears anymore", () => {
    const expected: WorkspaceEdit = {};

    const variablePosition: Position = Position.create(6, 10);
    const actual = provider.rename(getParams("NewText", variablePosition));

    expect(actual).toEqual(expected);
  });

  test("rename with valid document and valid position of variable definition, expect old name dont appears anymore", () => {
    const expected: WorkspaceEdit = {};

    const variablePosition: Position = Position.create(4, 10);
    const actual = provider.rename(getParams("NewText", variablePosition));

    expect(actual).not.toEqual(expected);
  });
});
