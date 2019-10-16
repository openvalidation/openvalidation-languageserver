import "jest";
import { Position } from "vscode-languageserver";
import { AliasHelper } from "../../../../src/aliases/AliasHelper";
import { CommentNode } from "../../../../src/data-model/syntax-tree/element/CommentNode";
import { GenericNode } from "../../../../src/data-model/syntax-tree/GenericNode";
import { IndexRange } from "../../../../src/data-model/syntax-tree/IndexRange";
import { EmptyTransition } from "../../../../src/provider/code-completion/states/EmptyTransition";
import { StateTransition } from "../../../../src/provider/code-completion/states/StateTransition";
import { TestInitializer } from "../../../Testinitializer";

describe("CommentNode Tests", () => {
  let initializer: TestInitializer;

  beforeEach(() => {
    initializer = new TestInitializer(true);
  });

  test("getCompletionContainer with empty CommentNode, expected Empty", () => {
    const comment: CommentNode = new CommentNode(
      [],
      IndexRange.create(0, 0, 0, 0),
      ""
    );

    const positionParameter = Position.create(0, 5);

    const actual: StateTransition[] = comment.getCompletionContainer(
      positionParameter
    ).$transitions;
    expect(actual[0]).toBeInstanceOf(EmptyTransition);
  });

  test("getCompletionContainer with full CommentNode, expected Empty", () => {
    const comment: CommentNode = new CommentNode(
      ["Kommentar Das ist ein Test"],
      IndexRange.create(0, 0, 0, "Kommentar Das ist ein Test".length),
      "Das ist ein Test"
    );

    const positionParameter = Position.create(0, 5);

    const actual: StateTransition[] = comment.getCompletionContainer(
      positionParameter
    ).$transitions;
    expect(actual[0]).toBeInstanceOf(EmptyTransition);
  });

  test("getChildren test, expect no children", () => {
    const commentText: string = "This is an error";
    const commentNode: CommentNode = new CommentNode(
      [commentText],
      IndexRange.create(0, 0, 0, commentText.length),
      commentText
    );

    const actual: GenericNode[] = commentNode.getChildren();
    const expected: GenericNode[] = [];

    expect(actual).toEqual(expected);
  });

  test("getHoverContent test, expect not empty content", () => {
    const commentText: string = "This is an error";
    const commentNode: CommentNode = new CommentNode(
      [commentText],
      IndexRange.create(0, 0, 0, commentText.length),
      commentText
    );

    const actual = commentNode.getHoverContent();

    expect(actual).not.toBeNull();
  });

  test("getBeautifiedContent test with aliasHelper and one line, expect not empty content", () => {
    const commentText: string = "This is an error";
    const commentNode: CommentNode = new CommentNode(
      [commentText],
      IndexRange.create(0, 0, 0, commentText.length),
      commentText
    );

    const actual = commentNode.getBeautifiedContent(
      initializer.$server.aliasHelper
    );

    expect(actual).toEqual(commentText);
  });

  test("getBeautifiedContent test with aliasHelper and two lines, expect not empty content", () => {
    const commentText: string = "This is an error";
    const commentNode: CommentNode = new CommentNode(
      [commentText, commentText],
      IndexRange.create(0, 0, 1, commentText.length),
      commentText
    );

    const actual = commentNode.getBeautifiedContent(
      initializer.$server.aliasHelper
    );
    const expected = "This is an error\n        This is an error";

    expect(actual).toEqual(expected);
  });

  test("getBeautifiedContent test with empty aliasHelper and two lines, expect not empty content", () => {
    const commentText: string = "This is an error";
    const commentNode: CommentNode = new CommentNode(
      [commentText, commentText],
      IndexRange.create(0, 0, 1, commentText.length),
      commentText
    );

    const actual = commentNode.getBeautifiedContent(new AliasHelper());
    const expected = "This is an error\\nThis is an error";

    expect(actual).toEqual(expected);
  });

  test("getCompletionContainer test, expect not empty content", () => {
    const commentText: string = "This is an error";
    const commentNode: CommentNode = new CommentNode(
      [commentText],
      IndexRange.create(0, 0, 0, commentText.length),
      commentText
    );

    const actual: StateTransition = commentNode.getCompletionContainer(
      Position.create(0, 5)
    ).$transitions[0];
    const expected: StateTransition = new EmptyTransition();

    expect(actual).toEqual(expected);
  });
});
