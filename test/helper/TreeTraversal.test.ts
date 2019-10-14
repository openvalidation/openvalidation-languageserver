import "jest";
import { Position } from "vscode-languageserver";
import { OperandNode } from "../../src/data-model/syntax-tree/element/operation/operand/OperandNode";
import { OperatorNode } from "../../src/data-model/syntax-tree/element/operation/operand/OperatorNode";
import { OperationNode } from "../../src/data-model/syntax-tree/element/operation/OperationNode";
import { VariableNode } from "../../src/data-model/syntax-tree/element/VariableNode";
import { GenericNode } from "../../src/data-model/syntax-tree/GenericNode";
import { IndexRange } from "../../src/data-model/syntax-tree/IndexRange";
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

  test("traverseTree with operation, expect matching child of operation", () => {
    const operand: string = "Test";
    const left: OperandNode = new OperandNode(
      [operand],
      IndexRange.create(0, 0, 0, 4),
      "String",
      operand
    );
    const operator: OperatorNode = new OperatorNode(
      ["kleiner"],
      IndexRange.create(0, 5, 0, 12),
      "Boolean",
      "kleiner",
      "Decimal"
    );
    const right: OperandNode = new OperandNode(
      [operand],
      IndexRange.create(0, 13, 0, 17),
      "String",
      operand
    );
    const operationNode: OperationNode = new OperationNode(
      left,
      operator,
      right,
      ["Test kleiner Test"],
      IndexRange.create(0, 0, 0, 17)
    );

    const input: GenericNode[] = [operationNode];
    const position: Position = Position.create(0, 6);

    const expected: GenericNode | null = operator;
    const actual: GenericNode | null = traversal.traverseTree(input, position);

    expect(actual).toEqual(expected);
  });

  test("getOperations with empty list, expect empty list", () => {
    const input: GenericNode[] = [];

    const expected: GenericNode[] = [];
    const actual: GenericNode[] = traversal.getOperations(input);

    expect(actual).toEqual(expected);
  });

  test("getOperations with one operation, expect operation list", () => {
    const operand: string = "Test";
    const left: OperandNode = new OperandNode(
      [operand],
      IndexRange.create(0, 0, 0, operand.length),
      "String",
      operand
    );
    const operator: OperatorNode = new OperatorNode(
      ["kleiner"],
      IndexRange.create(0, 0, 0, 0),
      "Boolean",
      "kleiner",
      "Decimal"
    );
    const right: OperandNode = new OperandNode(
      [operand],
      IndexRange.create(0, 0, 0, operand.length),
      "String",
      operand
    );
    const operationNode: OperationNode = new OperationNode(
      left,
      operator,
      right,
      ["Test kleiner Test"],
      IndexRange.create(0, 0, 0, "Test kleiner Test".length)
    );

    const input: GenericNode[] = [operationNode];
    const expected: GenericNode[] = [operationNode];
    const actual: GenericNode[] = traversal.getOperations(input);

    expect(actual).toEqual(expected);
  });

  test("getOperations with one variable with one operand and operation, expect empty list", () => {
    const operandText: string = "Test";
    const left: OperandNode = new OperandNode(
      [operandText],
      IndexRange.create(0, 0, 0, operandText.length),
      "String",
      operandText
    );
    const operator: OperatorNode = new OperatorNode(
      ["kleiner"],
      IndexRange.create(0, 0, 0, 0),
      "Boolean",
      "kleiner",
      "Decimal"
    );
    const right: OperandNode = new OperandNode(
      [operandText],
      IndexRange.create(0, 0, 0, operandText.length),
      "String",
      operandText
    );
    const operationNode: OperationNode = new OperationNode(
      left,
      operator,
      right,
      ["Test kleiner Test"],
      IndexRange.create(0, 0, 0, "Test kleiner Test".length)
    );
    const variable: VariableNode = new VariableNode(
      null,
      operationNode,
      [],
      IndexRange.create(0, 0, 0, 0)
    );

    const input: GenericNode[] = [variable];

    const expected: GenericNode[] = [operationNode];
    const actual: GenericNode[] = traversal.getOperations(input);

    expect(actual).toEqual(expected);
  });

  test("getOperations with one empty variable, expect empty list", () => {
    const variable: VariableNode = new VariableNode(
      null,
      null,
      [],
      IndexRange.create(0, 0, 0, 0)
    );

    const input: GenericNode[] = [variable];

    const expected: GenericNode[] = [];
    const actual: GenericNode[] = traversal.getOperations(input);

    expect(actual).toEqual(expected);
  });

  test("getLonelyOperands with empty list, expect empty list", () => {
    const input: GenericNode[] = [];

    const expected: GenericNode[] = [];
    const actual: GenericNode[] = traversal.getLonelyOperands(input);

    expect(actual).toEqual(expected);
  });

  test("getLonelyOperands with one operand, expect empty list", () => {
    const operandText: string = "Test";
    const operand: OperandNode = new OperandNode(
      [operandText],
      IndexRange.create(0, 0, 0, operandText.length),
      "String",
      operandText
    );

    const input: GenericNode[] = [operand];

    const expected: GenericNode[] = [operand];
    const actual: GenericNode[] = traversal.getLonelyOperands(input);

    expect(actual).toEqual(expected);
  });

  test("getLonelyOperands with one operand and operation, expect empty list", () => {
    const operandText: string = "Test";
    const operand: OperandNode = new OperandNode(
      [operandText],
      IndexRange.create(0, 0, 0, operandText.length),
      "String",
      operandText
    );

    const left: OperandNode = new OperandNode(
      [operandText],
      IndexRange.create(0, 0, 0, operandText.length),
      "String",
      operandText
    );
    const operator: OperatorNode = new OperatorNode(
      ["kleiner"],
      IndexRange.create(0, 0, 0, 0),
      "Boolean",
      "kleiner",
      "Decimal"
    );
    const right: OperandNode = new OperandNode(
      [operandText],
      IndexRange.create(0, 0, 0, operandText.length),
      "String",
      operandText
    );
    const operationNode: OperationNode = new OperationNode(
      left,
      operator,
      right,
      ["Test kleiner Test"],
      IndexRange.create(0, 0, 0, "Test kleiner Test".length)
    );

    const input: GenericNode[] = [operand, operationNode];

    const expected: GenericNode[] = [operand];
    const actual: GenericNode[] = traversal.getLonelyOperands(input);

    expect(actual).toEqual(expected);
  });

  test("getLonelyOperands with one variable with one operand and operation, expect empty list", () => {
    const operandText: string = "Test";
    const operand: OperandNode = new OperandNode(
      [operandText],
      IndexRange.create(0, 0, 0, operandText.length),
      "String",
      operandText
    );
    const variable: VariableNode = new VariableNode(
      null,
      operand,
      [],
      IndexRange.create(0, 0, 0, 0)
    );

    const left: OperandNode = new OperandNode(
      [operandText],
      IndexRange.create(0, 0, 0, operandText.length),
      "String",
      operandText
    );
    const operator: OperatorNode = new OperatorNode(
      ["kleiner"],
      IndexRange.create(0, 0, 0, 0),
      "Boolean",
      "kleiner",
      "Decimal"
    );
    const right: OperandNode = new OperandNode(
      [operandText],
      IndexRange.create(0, 0, 0, operandText.length),
      "String",
      operandText
    );
    const operationNode: OperationNode = new OperationNode(
      left,
      operator,
      right,
      ["Test kleiner Test"],
      IndexRange.create(0, 0, 0, "Test kleiner Test".length)
    );

    const input: GenericNode[] = [variable, operationNode];

    const expected: GenericNode[] = [operand];
    const actual: GenericNode[] = traversal.getLonelyOperands(input);

    expect(actual).toEqual(expected);
  });

  test("getLonelyOperands with one empty variable, expect empty list", () => {
    const variable: VariableNode = new VariableNode(
      null,
      null,
      [],
      IndexRange.create(0, 0, 0, 0)
    );

    const input: GenericNode[] = [variable];

    const expected: GenericNode[] = [];
    const actual: GenericNode[] = traversal.getLonelyOperands(input);

    expect(actual).toEqual(expected);
  });

  test("getLonelyOperands with one operation, expect empty list", () => {
    const operandText: string = "Test";
    const left: OperandNode = new OperandNode(
      [operandText],
      IndexRange.create(0, 0, 0, operandText.length),
      "String",
      operandText
    );
    const operator: OperatorNode = new OperatorNode(
      ["kleiner"],
      IndexRange.create(0, 0, 0, 0),
      "Boolean",
      "kleiner",
      "Decimal"
    );
    const right: OperandNode = new OperandNode(
      [operandText],
      IndexRange.create(0, 0, 0, operandText.length),
      "String",
      operandText
    );
    const operationNode: OperationNode = new OperationNode(
      left,
      operator,
      right,
      ["Test kleiner Test"],
      IndexRange.create(0, 0, 0, "Test kleiner Test".length)
    );

    const input: GenericNode[] = [operationNode];

    const expected: GenericNode[] = [];
    const actual: GenericNode[] = traversal.getLonelyOperands(input);

    expect(actual).toEqual(expected);
  });
});
