import "jest";
import { Position } from "vscode-languageserver";
import { VariableNameNode } from "../../../../src/data-model/syntax-tree/element/VariableNameNode";
import { GenericNode } from "../../../../src/data-model/syntax-tree/GenericNode";
import { IndexRange } from "../../../../src/data-model/syntax-tree/IndexRange";
import { EmptyTransition } from "../../../../src/provider/code-completion/states/EmptyTransition";
import { StateTransition } from "../../../../src/provider/code-completion/states/StateTransition";
import { TestInitializer } from "../../../Testinitializer";

describe("VariableNameNode Tests", () => {
  let initializer: TestInitializer;

  beforeEach(() => {
    initializer = new TestInitializer(true);
  });

  test("VariableNameNode get errorMessage test", () => {
    const variableName: string = "Test";
    const variableNode: VariableNameNode = new VariableNameNode(
      [variableName],
      IndexRange.create(0, 0, 0, variableName.length),
      variableName,
      IndexRange.create(0, 0, 0, variableName.length)
    );

    expect(variableNode.$name).toEqual(variableName);
  });

  test("getChildren test, expect no children", () => {
    const variableName: string = "Test";
    const variableNode: VariableNameNode = new VariableNameNode(
      [variableName],
      IndexRange.create(0, 0, 0, variableName.length),
      variableName,
      IndexRange.create(0, 0, 0, variableName.length)
    );

    const actual: GenericNode[] = variableNode.getChildren();
    const expected: GenericNode[] = [];

    expect(actual).toEqual(expected);
  });

  test("getHoverContent test, expect not empty content", () => {
    const variableName: string = "Test";
    const variableNode: VariableNameNode = new VariableNameNode(
      [variableName],
      IndexRange.create(0, 0, 0, variableName.length),
      variableName,
      IndexRange.create(0, 0, 0, variableName.length)
    );

    const actual = variableNode.getHoverContent();

    expect(actual).not.toBeNull();
  });

  test("getBeautifiedContent test, expect not empty content", () => {
    const variableName: string = "Test";
    const variableNode: VariableNameNode = new VariableNameNode(
      [variableName],
      IndexRange.create(0, 0, 0, variableName.length),
      variableName,
      IndexRange.create(0, 0, 0, variableName.length)
    );

    const actual = variableNode.getBeautifiedContent(
      initializer.$server.getAliasHelper()
    );

    expect(actual).toEqual(variableName);
  });

  test("getCompletionContainer test, empty transition", () => {
    const variableName: string = "Test";
    const variableNode: VariableNameNode = new VariableNameNode(
      [variableName],
      IndexRange.create(0, 0, 0, variableName.length),
      variableName,
      IndexRange.create(0, 0, 0, variableName.length)
    );

    const actual: StateTransition = variableNode.getCompletionContainer(
      Position.create(0, 5)
    ).$transitions[0];
    const expected: StateTransition = new EmptyTransition();

    expect(actual).toEqual(expected);
  });
});
