import "jest";
import { Position } from "vscode-languageserver";
import { ActionErrorNode } from "../../../../src/data-model/syntax-tree/element/ActionErrorNode";
import { GenericNode } from "../../../../src/data-model/syntax-tree/GenericNode";
import { IndexRange } from "../../../../src/data-model/syntax-tree/IndexRange";
import { EmptyTransition } from "../../../../src/provider/code-completion/states/EmptyTransition";
import { StateTransition } from "../../../../src/provider/code-completion/states/StateTransition";
import { TestInitializer } from "../../../Testinitializer";

describe("ActionErrorNode Tests", () => {
  let initializer: TestInitializer;

  beforeEach(() => {
    initializer = new TestInitializer(true);
  });

  test("ActionErrorNode get errorMessage test", () => {
    const errorMessage: string = "This is an error";
    const errorNode: ActionErrorNode = new ActionErrorNode(
      [errorMessage],
      IndexRange.create(0, 0, 0, errorMessage.length),
      errorMessage
    );

    expect(errorNode.$errorMessage).toEqual(errorMessage);
  });

  test("getChildren test, expect no children", () => {
    const errorMessage: string = "This is an error";
    const errorNode: ActionErrorNode = new ActionErrorNode(
      [errorMessage],
      IndexRange.create(0, 0, 0, errorMessage.length),
      errorMessage
    );

    const actual: GenericNode[] = errorNode.getChildren();
    const expected: GenericNode[] = [];

    expect(actual).toEqual(expected);
  });

  test("getHoverContent test, expect not empty content", () => {
    const errorMessage: string = "This is an error";
    const errorNode: ActionErrorNode = new ActionErrorNode(
      [errorMessage],
      IndexRange.create(0, 0, 0, errorMessage.length),
      errorMessage
    );

    const actual = errorNode.getHoverContent();

    expect(actual).not.toBeNull();
  });

  test("getBeautifiedContent test, expect not empty content", () => {
    const errorMessage: string = "This is an error";
    const errorNode: ActionErrorNode = new ActionErrorNode(
      [errorMessage],
      IndexRange.create(0, 0, 0, errorMessage.length),
      errorMessage
    );

    const actual = errorNode.getBeautifiedContent(
      initializer.$server.getAliasHelper()
    );

    expect(actual).toEqual(errorMessage);
  });

  test("getCompletionContainer test, expect empty transition", () => {
    const errorMessage: string = "This is an error";
    const errorNode: ActionErrorNode = new ActionErrorNode(
      [errorMessage],
      IndexRange.create(0, 0, 0, errorMessage.length),
      errorMessage
    );

    const actual: StateTransition = errorNode.getCompletionContainer(
      Position.create(0, 5)
    ).$transitions[0];
    const expected: StateTransition = new EmptyTransition();

    expect(actual).toEqual(expected);
  });
});
