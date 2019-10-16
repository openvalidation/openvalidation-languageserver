import "jest";
import { Position } from "vscode-languageserver";
import { OperandNode } from "../../../../../../src/data-model/syntax-tree/element/operation/operand/OperandNode";
import { GenericNode } from "../../../../../../src/data-model/syntax-tree/GenericNode";
import { IndexRange } from "../../../../../../src/data-model/syntax-tree/IndexRange";
import { ScopeEnum } from "../../../../../../src/enums/ScopeEnum";
import { StateTransition } from "../../../../../../src/provider/code-completion/states/StateTransition";
import { SyntaxHighlightingCapture } from "../../../../../../src/provider/syntax-highlighting/SyntaxHighlightingCapture";
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
      initializer.$server.aliasHelper
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

  test("getPatternInformation with single operand, expect variable", () => {
    const operand: string = "Test";
    const operandNode: OperandNode = new OperandNode(
      [operand],
      IndexRange.create(0, 0, 0, operand.length),
      "String",
      operand
    );

    const actual: ScopeEnum[] = operandNode.getPatternInformation(
      initializer.$server.aliasHelper
    )!.$capture;
    const expected: ScopeEnum[] = [ScopeEnum.Variable];

    expect(actual).toEqual(expected);
  });

  test("getPatternInformation with single static string operand, expect static string", () => {
    const operand: string = "Test";
    const operandNode: OperandNode = new OperandNode(
      [operand],
      IndexRange.create(0, 0, 0, operand.length),
      "String",
      operand,
      true
    );

    const actual: ScopeEnum[] = operandNode.getPatternInformation(
      initializer.$server.aliasHelper
    )!.$capture;
    const expected: ScopeEnum[] = [ScopeEnum.StaticString];

    expect(actual).toEqual(expected);
  });

  test("getPatternInformation with single static decimal operand, expect static number", () => {
    const operand: string = "100";
    const operandNode: OperandNode = new OperandNode(
      [operand],
      IndexRange.create(0, 0, 0, operand.length),
      "Decimal",
      operand,
      true
    );

    const actual: ScopeEnum[] = operandNode.getPatternInformation(
      initializer.$server.aliasHelper
    )!.$capture;
    const expected: ScopeEnum[] = [ScopeEnum.StaticNumber];

    expect(actual).toEqual(expected);
  });

  test("getPatternInformation with complex static decimal operand, expect empty and static number", () => {
    const operand: string = "Alter kleiner 100";
    const operandNode: OperandNode = new OperandNode(
      [operand],
      IndexRange.create(0, 0, 0, operand.length),
      "Decimal",
      "100",
      true
    );

    const actual: ScopeEnum[] = operandNode.getPatternInformation(
      initializer.$server.aliasHelper
    )!.$capture;
    const expected: ScopeEnum[] = [ScopeEnum.Empty, ScopeEnum.StaticNumber];

    expect(actual).toEqual(expected);
  });

  test("getPatternInformation with complex static decimal operand, expect empty, static number and empty", () => {
    const operand: string = "Alter kleiner 100 test";
    const operandNode: OperandNode = new OperandNode(
      [operand],
      IndexRange.create(0, 0, 0, operand.length),
      "Decimal",
      "100",
      true
    );

    const actual: ScopeEnum[] = operandNode.getPatternInformation(
      initializer.$server.aliasHelper
    )!.$capture;
    const expected: ScopeEnum[] = [
      ScopeEnum.Empty,
      ScopeEnum.StaticNumber,
      ScopeEnum.Empty
    ];

    expect(actual).toEqual(expected);
  });

  test("getPatternInformation with complex static decimal operand which appears two times, expect empty, static number and empty", () => {
    const operand: string = "Alter kleiner 100 test 100 test";
    const operandNode: OperandNode = new OperandNode(
      [operand],
      IndexRange.create(0, 0, 0, operand.length),
      "Decimal",
      "100",
      true
    );

    const actual: ScopeEnum[] = operandNode.getPatternInformation(
      initializer.$server.aliasHelper
    )!.$capture;
    const expected: ScopeEnum[] = [
      ScopeEnum.Empty,
      ScopeEnum.StaticNumber,
      ScopeEnum.Empty
    ];

    expect(actual).toEqual(expected);
  });

  test("getPatternInformation with complex schema operand, expect empty, variable", () => {
    const operand: string = "Alter kleiner Student.Alter";
    const operandNode: OperandNode = new OperandNode(
      [operand],
      IndexRange.create(0, 0, 0, operand.length),
      "Decimal",
      "Student.Alter"
    );

    const actual: ScopeEnum[] = operandNode.getPatternInformation(
      initializer.$server.aliasHelper
    )!.$capture;
    const expected: ScopeEnum[] = [ScopeEnum.Empty, ScopeEnum.Variable];

    expect(actual).toEqual(expected);
  });

  test("getPatternInformation with complex schema operand, expect empty, variable", () => {
    const operand: string = "Test kleiner Alter OF Student";
    const operandNode: OperandNode = new OperandNode(
      [operand],
      IndexRange.create(0, 0, 0, operand.length),
      "Decimal",
      "Student.Alter"
    );

    const actual: ScopeEnum[] = operandNode.getPatternInformation(
      initializer.$server.aliasHelper
    )!.$capture;
    const expected: ScopeEnum[] = [
      ScopeEnum.Empty,
      ScopeEnum.Variable,
      ScopeEnum.Keyword,
      ScopeEnum.Variable
    ];

    expect(actual).toEqual(expected);
  });

  test("getPatternInformation with empty lines, expect null", () => {
    const operand: string = "";
    const operandNode: OperandNode = new OperandNode(
      [operand],
      IndexRange.create(0, 0, 0, operand.length),
      "Decimal",
      "Student.Alter"
    );

    const actual: SyntaxHighlightingCapture | null = operandNode.getPatternInformation(
      initializer.$server.aliasHelper
    );
    const expected: SyntaxHighlightingCapture | null = null;

    expect(actual).toEqual(expected);
  });
});
