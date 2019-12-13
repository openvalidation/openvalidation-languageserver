import "jest";
import { Position } from "vscode-languageserver";
import { ActionErrorNode } from "../../../../src/data-model/syntax-tree/element/ActionErrorNode";
import { GenericNode } from "../../../../src/data-model/syntax-tree/GenericNode";
import { IndexRange } from "../../../../src/data-model/syntax-tree/IndexRange";
import { EmptyTransition } from "../../../../src/provider/code-completion/states/EmptyTransition";
import { StateTransition } from "../../../../src/provider/code-completion/states/StateTransition";
import { TestInitializer } from "../../../Testinitializer";
import { UnknownNode } from "../../../../src/data-model/syntax-tree/element/UnknownNode";
import { SyntaxToken } from "ov-language-server-types";
import { ScopeEnum } from "../../../../src/enums/ScopeEnum";
import { KeywordNode } from "../../../../src/data-model/syntax-tree/KeywordNode";

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
      errorMessage,
      IndexRange.create(0, 0, 0, errorMessage.length)
    );

    expect(errorNode.$errorMessage).toEqual(errorMessage);
  });

  test("getChildren test, expect no children", () => {
    const errorMessage: string = "This is an error";
    const errorNode: ActionErrorNode = new ActionErrorNode(
      [errorMessage],
      IndexRange.create(0, 0, 0, errorMessage.length),
      errorMessage,
      IndexRange.create(0, 0, 0, errorMessage.length)
    );

    const actual: GenericNode[] = errorNode.getChildren();
    const expected: GenericNode[] = [
      new UnknownNode(null, [], IndexRange.create(0, 0, 0, errorMessage.length))
    ];

    expect(actual).toEqual(expected);
  });

  test("getHoverContent test, expect not empty content", () => {
    const errorMessage: string = "This is an error";
    const errorNode: ActionErrorNode = new ActionErrorNode(
      [errorMessage],
      IndexRange.create(0, 0, 0, errorMessage.length),
      errorMessage,
      IndexRange.create(0, 0, 0, errorMessage.length)
    );

    const actual = errorNode.getHoverContent();

    expect(actual).not.toBeNull();
  });

  test("getBeautifiedContent test, expect not empty content", () => {
    const errorMessage: string = "This is an error";
    const errorNode: ActionErrorNode = new ActionErrorNode(
      [errorMessage],
      IndexRange.create(0, 0, 0, errorMessage.length),
      errorMessage,
      IndexRange.create(0, 0, 0, errorMessage.length)
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
      errorMessage,
      IndexRange.create(0, 0, 0, errorMessage.length)
    );

    const actual: StateTransition = errorNode.getCompletionContainer(
      Position.create(0, 5)
    ).$transitions[0];
    const expected: StateTransition = new EmptyTransition();

    expect(actual).toEqual(expected);
  });

  test("getSpecificTokens with actionErrorRange and keyword, expect correct token", () => {
    const errorMessage: string = "This is an error";
    const errorNode: ActionErrorNode = new ActionErrorNode(
      [errorMessage],
      IndexRange.create(0, 0, 0, errorMessage.length),
      errorMessage,
      IndexRange.create(0, 0, 0, 3)
    );
    errorNode.$keywords = [
      new KeywordNode(["DANN"], IndexRange.create(0, 0, 0, 4))
    ];

    const actual: SyntaxToken[] = errorNode.getTokens();
    const expected: SyntaxToken[] = [
      {
        pattern: ScopeEnum.Keyword,
        range: IndexRange.create(0, 0, 0, 4).asRange()
      },
      {
        pattern: ScopeEnum.StaticString,
        range: IndexRange.create(0, 0, 0, 3).asRange()
      }
    ];

    expect(actual).toEqual(expected);
  });
});
