import "jest";
import { Position } from "vscode-languageserver";
import { OperandNode } from "../../../../../../src/data-model/syntax-tree/element/operation/operand/OperandNode";
import { GenericNode } from "../../../../../../src/data-model/syntax-tree/GenericNode";
import { IndexRange } from "../../../../../../src/data-model/syntax-tree/IndexRange";
import { StateTransition } from "../../../../../../src/provider/code-completion/states/StateTransition";
import { TestInitializer } from "../../../../../Testinitializer";

describe("OperandNode Tests", () => {
  let initializer: TestInitializer;

  beforeEach(() => {
    initializer = new TestInitializer(true);
  });

  test("OperandNode get isStatic test", () => {
    const operand: string = "Test";
    const operandNode: OperandNode = new OperandNode(
      [operand],
      IndexRange.create(0, 0, 0, operand.length),
      "String",
      operand
    );

    expect(operandNode.$isStatic).toEqual(false);
  });

  test("getChildren test, expect no children", () => {
    const operand: string = "Test";
    const operandNode: OperandNode = new OperandNode(
      [operand],
      IndexRange.create(0, 0, 0, operand.length),
      "String",
      operand
    );

    const actual: GenericNode[] = operandNode.getChildren();
    const expected: GenericNode[] = [];

    expect(actual).toEqual(expected);
  });

  test("getHoverContent test, expect not empty content", () => {
    const operand: string = "Test";
    const operandNode: OperandNode = new OperandNode(
      [operand],
      IndexRange.create(0, 0, 0, operand.length),
      "String",
      operand
    );

    const actual = operandNode.getHoverContent();

    expect(actual).not.toBeNull();
  });

  test("getBeautifiedContent test, expect not empty content", () => {
    const operand: string = "Test";
    const operandNode: OperandNode = new OperandNode(
      [operand],
      IndexRange.create(0, 0, 0, operand.length),
      "String",
      operand
    );

    const actual = operandNode.getBeautifiedContent(
      initializer.$server.getAliasHelper()
    );

    expect(actual).toEqual(operand);
  });

  test("getCompletionContainer test, expect empty transition list", () => {
    const operand: string = "Test";
    const operandNode: OperandNode = new OperandNode(
      [operand],
      IndexRange.create(0, 0, 0, operand.length),
      "String",
      operand
    );

    const actual: StateTransition[] = operandNode.getCompletionContainer(
      Position.create(0, 5)
    ).$transitions;
    const expected: StateTransition[] = [];

    expect(actual).toEqual(expected);
  });

  test("isComplete test, expect false", () => {
    const operand: string = "Test";
    const operandNode: OperandNode = new OperandNode(
      [operand],
      IndexRange.create(0, 0, 0, operand.length),
      "String",
      operand
    );

    const actual: boolean = operandNode.isComplete();
    const expected: boolean = false;

    expect(actual).toEqual(expected);
  });
});
