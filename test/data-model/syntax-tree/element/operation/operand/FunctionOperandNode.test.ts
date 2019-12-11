import "jest";
import { Position } from "vscode-languageserver";
import { FunctionOperandNode } from "../../../../../../src/data-model/syntax-tree/element/operation/operand/FunctionOperandNode";
import { OperandNode } from "../../../../../../src/data-model/syntax-tree/element/operation/operand/OperandNode";
import { GenericNode } from "../../../../../../src/data-model/syntax-tree/GenericNode";
import { IndexRange } from "../../../../../../src/data-model/syntax-tree/IndexRange";
import { OperandTransition } from "../../../../../../src/provider/code-completion/states/OperandTransition";
import { StateTransition } from "../../../../../../src/provider/code-completion/states/StateTransition";
import { TestInitializer } from "../../../../../Testinitializer";

describe("FunctionOperandNode Tests", () => {
  let initializer: TestInitializer;

  beforeEach(() => {
    initializer = new TestInitializer(true);
  });

  test("FunctionOperandNode get type and acceptedType test", () => {
    const operand: string = "Test";
    const functionString: string = "SUM OF " + operand;
    const functionNode: FunctionOperandNode = new FunctionOperandNode(
      [],
      [functionString],
      IndexRange.create(0, 0, 0, functionString.length),
      "Decimal",
      operand,
      "Decimal"
    );

    expect(functionNode.$acceptedType).toEqual("Decimal");
  });

  test("getChildren without children, expect no children", () => {
    const operand: string = "Test";
    const functionString: string = "SUM OF " + operand;
    const functionNode: FunctionOperandNode = new FunctionOperandNode(
      [],
      [functionString],
      IndexRange.create(0, 0, 0, functionString.length),
      "Decimal",
      operand,
      "Decimal"
    );

    const actual: GenericNode[] = functionNode.getChildren();
    const expected: GenericNode[] = [];

    expect(actual).toEqual(expected);
  });

  test("getChildren with one child, expect one child", () => {
    const operand: string = "Test";
    const operandNode: OperandNode = new OperandNode(
      [operand],
      IndexRange.create(0, 0, 0, operand.length),
      "String",
      operand
    );
    const functionString: string = "SUM OF " + operand;
    const functionNode: FunctionOperandNode = new FunctionOperandNode(
      [operandNode],
      [functionString],
      IndexRange.create(0, 0, 0, functionString.length),
      "Decimal",
      operand,
      "Decimal"
    );

    const actual: GenericNode[] = functionNode.getChildren();
    const expected: GenericNode[] = [operandNode];

    expect(actual).toEqual(expected);
  });

  test("getChildren with previous set children, expect one child", () => {
    const operand: string = "Test";
    const functionString: string = "SUM OF " + operand;
    const functionNode: FunctionOperandNode = new FunctionOperandNode(
      [],
      [functionString],
      IndexRange.create(0, 0, 0, functionString.length),
      "Decimal",
      operand,
      "Decimal"
    );

    const operandNode: OperandNode = new OperandNode(
      [operand],
      IndexRange.create(0, 0, 0, operand.length),
      "Decimal",
      operand
    );
    functionNode.setParameters([operandNode]);

    const actual: GenericNode[] = functionNode.getChildren();
    const expected: GenericNode[] = [operandNode];

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
    const functionString: string = "SUM OF " + operand;
    const functionNode: FunctionOperandNode = new FunctionOperandNode(
      [operandNode],
      [functionString],
      IndexRange.create(0, 0, 0, functionString.length),
      "Decimal",
      operand,
      "Decimal"
    );

    const actual = functionNode.getHoverContent();

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
    const functionString: string = "SUM OF " + operand;
    const functionNode: FunctionOperandNode = new FunctionOperandNode(
      [operandNode],
      [functionString],
      IndexRange.create(0, 0, 0, functionString.length),
      "Decimal",
      operand,
      "Decimal"
    );

    const actual = functionNode.getBeautifiedContent(
      initializer.$server.getAliasHelper()
    );

    expect(actual).toEqual(functionString);
  });

  test("getCompletionContainer without children, expect empty operand transition list", () => {
    const operand: string = "Test";
    const functionString: string = "SUM OF " + operand;
    const functionNode: FunctionOperandNode = new FunctionOperandNode(
      [],
      [functionString],
      IndexRange.create(0, 0, 0, functionString.length),
      "Decimal",
      operand,
      "Decimal"
    );

    const actual: StateTransition[] = functionNode.getCompletionContainer(
      Position.create(0, 5)
    ).$transitions;
    const expected: StateTransition[] = [new OperandTransition("Decimal")];

    expect(actual).toEqual(expected);
  });

  test("getCompletionContainer with child, expect empty transition list", () => {
    const operand: string = "Test";
    const operandNode: OperandNode = new OperandNode(
      [operand],
      IndexRange.create(0, 0, 0, operand.length),
      "String",
      operand
    );
    const functionString: string = "SUM OF " + operand;
    const functionNode: FunctionOperandNode = new FunctionOperandNode(
      [operandNode],
      [functionString],
      IndexRange.create(0, 0, 0, functionString.length),
      "Decimal",
      operand,
      "Decimal"
    );

    const actual: StateTransition[] = functionNode.getCompletionContainer(
      Position.create(0, 5)
    ).$transitions;
    const expected: StateTransition[] = [];

    expect(actual).toEqual(expected);
  });

  test("isComplete without children, expect false", () => {
    const operand: string = "Test";
    const functionString: string = "SUM OF " + operand;
    const functionNode: FunctionOperandNode = new FunctionOperandNode(
      [],
      [functionString],
      IndexRange.create(0, 0, 0, functionString.length),
      "Decimal",
      operand,
      "Decimal"
    );

    const actual: boolean = functionNode.isComplete();
    const expected: boolean = false;

    expect(actual).toEqual(expected);
  });

  test("isComplete with children, expect true", () => {
    const operand: string = "Test";
    const operandNode: OperandNode = new OperandNode(
      [operand],
      IndexRange.create(0, 0, 0, operand.length),
      "String",
      operand
    );
    const functionString: string = "SUM OF " + operand;
    const functionNode: FunctionOperandNode = new FunctionOperandNode(
      [operandNode],
      [functionString],
      IndexRange.create(0, 0, 0, functionString.length),
      "Decimal",
      operand,
      "Decimal"
    );

    const actual: boolean = functionNode.isComplete();
    const expected: boolean = true;

    expect(actual).toEqual(expected);
  });
});
