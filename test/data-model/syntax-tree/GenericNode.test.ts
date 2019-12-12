import "jest";
import { OperandNode } from "../../../src/data-model/syntax-tree/element/operation/operand/OperandNode";
import { GenericNode } from "../../../src/data-model/syntax-tree/GenericNode";
import { IndexRange } from "../../../src/data-model/syntax-tree/IndexRange";
import { TestInitializer } from "../../Testinitializer";
import { OperationNode } from "../../../src/data-model/syntax-tree/element/operation/OperationNode";
import { BaseOperandNode } from "../../../src/data-model/syntax-tree/element/operation/operand/BaseOperandNode";
import { KeywordNode } from "../../../src/data-model/syntax-tree/KeywordNode";

describe("GenericNode Tests", () => {
  let initializer: TestInitializer;

  beforeEach(() => {
    initializer = new TestInitializer(true);
  });

  test("GenericNode getter/setter test", () => {
    const operandNode = new OperandNode(
      [],
      IndexRange.create(0, 0, 0, 0),
      "",
      ""
    );

    const expectedLines: string[] = ["Hello"];
    operandNode.$lines = expectedLines;
    const expectedRange: IndexRange = IndexRange.create(10, 10, 10, 10);
    operandNode.$range = expectedRange;

    expect(operandNode.$lines).toEqual(expectedLines);
    expect(operandNode.$range).toEqual(expectedRange);
  });

  test("formatCode with good formatted OperandNode, expect no edit", () => {
    const node: GenericNode = new OperandNode(
      ["Test"],
      IndexRange.create(0, 0, 0, 4),
      "String",
      "Test"
    );

    const expected: string = "Test";
    const actual: string = node.formatCode(
      initializer.$server.getAliasHelper()
    )[0].newText;

    expect(actual).toEqual(expected);
  });

  test("formatCode with bad formatted OperandNode, expect no edit", () => {
    const node: GenericNode = new OperandNode(
      ["   Test"],
      IndexRange.create(0, 0, 0, 4),
      "String",
      "Test"
    );

    const expected: string = " Test";
    const actual: string = node.formatCode(
      initializer.$server.getAliasHelper()
    )[0].newText;

    expect(actual).not.toEqual(expected);
  });

  test("modifyRangeOfEveryNode by 1, expect changed range", () => {
    const leftNode: BaseOperandNode = new OperandNode(
      ["Test"],
      IndexRange.create(0, 0, 0, 4),
      "String",
      "Test"
    );
    const operation: OperationNode = new OperationNode(
      leftNode,
      null,
      null,
      [],
      IndexRange.create(0, 0, 1, 4)
    );
    operation.$keywords = [
      new KeywordNode(["WENN"], IndexRange.create(1, 0, 1, 0))
    ];

    const lineChange: number = 1;
    operation.modifyRangeOfEveryNode(lineChange);

    const actualOperation: IndexRange = operation.$range;
    const expectedOperation: IndexRange = IndexRange.create(1, 0, 2, 4);
    expect(actualOperation).toEqual(expectedOperation);

    const actualLeftOperand: IndexRange = operation.$leftOperand!.$range;
    const expectedLeftOperand: IndexRange = IndexRange.create(1, 0, 1, 4);
    expect(actualLeftOperand).toEqual(expectedLeftOperand);

    const actualKeyword: IndexRange = operation.$keywords[0].$range;
    const expectedKeyword: IndexRange = IndexRange.create(2, 0, 2, 0);
    expect(actualKeyword).toEqual(expectedKeyword);
  });
});
