import "jest";
import { Position } from "vscode-languageserver";
import { OperatorNode } from "../../../../../../src/data-model/syntax-tree/element/operation/operand/OperatorNode";
import { GenericNode } from "../../../../../../src/data-model/syntax-tree/GenericNode";
import { IndexRange } from "../../../../../../src/data-model/syntax-tree/IndexRange";
import { StateTransition } from "../../../../../../src/provider/code-completion/states/StateTransition";
import { TestInitializer } from "../../../../../Testinitializer";

describe("OperatorNode Tests", () => {
  let initializer: TestInitializer;

  beforeEach(() => {
    initializer = new TestInitializer(true);
  });

  test("OperatorNode get dataType and validType test", () => {
    const operator: string = "Test";
    const operatorNode: OperatorNode = new OperatorNode(
      [operator],
      IndexRange.create(0, 0, 0, operator.length),
      "Boolean",
      operator,
      "Decimal"
    );

    expect(operatorNode.$dataType).toEqual("Boolean");
    expect(operatorNode.$validType).toEqual("Decimal");
  });

  test("getChildren test, expect no children", () => {
    const operator: string = "Test";
    const operatorNode: OperatorNode = new OperatorNode(
      [operator],
      IndexRange.create(0, 0, 0, operator.length),
      "Boolean",
      operator,
      "Decimal"
    );

    const actual: GenericNode[] = operatorNode.getChildren();
    const expected: GenericNode[] = [];

    expect(actual).toEqual(expected);
  });

  test("getHoverContent test, expect not empty content", () => {
    const operator: string = "Test";
    const operatorNode: OperatorNode = new OperatorNode(
      [operator],
      IndexRange.create(0, 0, 0, operator.length),
      "Boolean",
      operator,
      "Decimal"
    );

    const actual = operatorNode.getHoverContent();

    expect(actual).not.toBeNull();
  });

  test("getBeautifiedContent test, expect not empty content", () => {
    const operator: string = "Test";
    const operatorNode: OperatorNode = new OperatorNode(
      [operator],
      IndexRange.create(0, 0, 0, operator.length),
      "Boolean",
      operator,
      "Decimal"
    );

    const actual = operatorNode.getBeautifiedContent(
      initializer.$server.getAliasHelper()
    );

    expect(actual).toEqual(operator);
  });

  test("getCompletionContainer test, expect empty transition list", () => {
    const operator: string = "Test";
    const operatorNode: OperatorNode = new OperatorNode(
      [operator],
      IndexRange.create(0, 0, 0, operator.length),
      "Boolean",
      operator,
      "Decimal"
    );

    const actual: StateTransition[] = operatorNode.getCompletionContainer(
      Position.create(0, 5)
    ).$transitions;
    const expected: StateTransition[] = [];

    expect(actual).toEqual(expected);
  });

  test("isComplete test, expect true", () => {
    const operator: string = "Test";
    const operatorNode: OperatorNode = new OperatorNode(
      [operator],
      IndexRange.create(0, 0, 0, operator.length),
      "Boolean",
      operator,
      "Decimal"
    );

    const actual: boolean = operatorNode.isComplete();
    const expected: boolean = true;

    expect(actual).toEqual(expected);
  });
});
