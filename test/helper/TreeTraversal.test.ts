import "jest";
import { Position } from "vscode-languageserver";
import { GenericNode } from "../../src/data-model/syntax-tree/GenericNode";
import { TreeTraversal } from "../../src/helper/TreeTraversal";

describe("TreeTraversal Tests", () => {
  let traversal: TreeTraversal;

  beforeEach(() => {
    traversal = new TreeTraversal();
  });

  test("traverseTree with empty list, expect empty list", () => {
    const input: GenericNode[] = [];
    const position: Position = Position.create(0, 0);

    const expected: GenericNode | null = null;
    const actual: GenericNode | null = traversal.traverseTree(input, position);

    expect(actual).toEqual(expected);
  });
});
