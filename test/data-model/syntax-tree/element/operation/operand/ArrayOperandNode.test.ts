import "jest";
import { Position } from "vscode-languageserver";
import { ArrayOperandNode } from "../../../../../../src/data-model/syntax-tree/element/operation/operand/ArrayOperandNode";
import { OperandNode } from "../../../../../../src/data-model/syntax-tree/element/operation/operand/OperandNode";
import { GenericNode } from "../../../../../../src/data-model/syntax-tree/GenericNode";
import { IndexRange } from "../../../../../../src/data-model/syntax-tree/IndexRange";
import { ScopeEnum } from "../../../../../../src/enums/ScopeEnum";
import { OperandTransition } from "../../../../../../src/provider/code-completion/states/OperandTransition";
import { StateTransition } from "../../../../../../src/provider/code-completion/states/StateTransition";
import { TestInitializer } from "../../../../../Testinitializer";

describe("ArrayOperandNode Tests", () => {
  let initializer: TestInitializer;

  beforeEach(() => {
    initializer = new TestInitializer(true);
  });

  test("getChildren without children, expect no children", () => {
    const operand: string = "Test";
    const arrayOperandNode: ArrayOperandNode = new ArrayOperandNode(
      [],
      [operand],
      IndexRange.create(0, 0, 0, operand.length),
      "String",
      operand
    );

    const actual: GenericNode[] = arrayOperandNode.getChildren();
    const expected: GenericNode[] = [];

    expect(actual).toEqual(expected);
  });

  test("getChildren with previous set children, expect one child", () => {
    const operand: string = "Test";
    const arrayOperandNode: ArrayOperandNode = new ArrayOperandNode(
      [],
      [operand],
      IndexRange.create(0, 0, 0, operand.length),
      "String",
      operand
    );

    const operandNode: OperandNode = new OperandNode(
      [operand],
      IndexRange.create(0, 0, 0, operand.length),
      "String",
      operand
    );
    arrayOperandNode.setItems([operandNode]);

    const actual: GenericNode[] = arrayOperandNode.getChildren();
    const expected: GenericNode[] = [operandNode];

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
    const arrayOperandNode: ArrayOperandNode = new ArrayOperandNode(
      [operandNode],
      [operand],
      IndexRange.create(0, 0, 0, operand.length),
      "String",
      operand
    );

    const actual: GenericNode[] = arrayOperandNode.getChildren();
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
    const arrayOperandNode: ArrayOperandNode = new ArrayOperandNode(
      [operandNode],
      [operand],
      IndexRange.create(0, 0, 0, operand.length),
      "String",
      operand
    );

    const actual = arrayOperandNode.getHoverContent();

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
    const arrayOperandNode: ArrayOperandNode = new ArrayOperandNode(
      [operandNode],
      [operand],
      IndexRange.create(0, 0, 0, operand.length),
      "String",
      operand
    );

    const actual = arrayOperandNode.getBeautifiedContent(
      initializer.$server.getAliasHelper()
    );

    expect(actual).toEqual(operand);
  });

  test("getCompletionContainer without children, expect empty operand transition list", () => {
    const operand: string = "Test";
    const arrayOperandNode: ArrayOperandNode = new ArrayOperandNode(
      [],
      [operand],
      IndexRange.create(0, 0, 0, operand.length),
      "String",
      operand
    );

    const actual: StateTransition[] = arrayOperandNode.getCompletionContainer(
      Position.create(0, 5)
    ).$transitions;
    const expected: StateTransition[] = [new OperandTransition("String")];

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
    const arrayOperandNode: ArrayOperandNode = new ArrayOperandNode(
      [operandNode],
      [operand],
      IndexRange.create(0, 0, 0, operand.length),
      "String",
      operand
    );

    const actual: StateTransition[] = arrayOperandNode.getCompletionContainer(
      Position.create(0, 5)
    ).$transitions;
    const expected: StateTransition[] = [];

    expect(actual).toEqual(expected);
  });

  test("isComplete without children, expect false", () => {
    const operand: string = "Test";
    const arrayOperandNode: ArrayOperandNode = new ArrayOperandNode(
      [],
      [operand],
      IndexRange.create(0, 0, 0, operand.length),
      "String",
      operand
    );

    const actual: boolean = arrayOperandNode.isComplete();
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
    const arrayOperandNode: ArrayOperandNode = new ArrayOperandNode(
      [operandNode],
      [operand],
      IndexRange.create(0, 0, 0, operand.length),
      "String",
      operand
    );

    const actual: boolean = arrayOperandNode.isComplete();
    const expected: boolean = true;

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
    const arrayOperandNode: ArrayOperandNode = new ArrayOperandNode(
      [operandNode],
      [operand],
      IndexRange.create(0, 0, 0, operand.length),
      "String",
      operand
    );

    const actual: ScopeEnum[] = arrayOperandNode.getPatternInformation(
      initializer.$server.getAliasHelper()
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
    const arrayOperandNode: ArrayOperandNode = new ArrayOperandNode(
      [operandNode],
      [operand],
      IndexRange.create(0, 0, 0, operand.length),
      "String",
      operand
    );

    const actual: ScopeEnum[] = arrayOperandNode.getPatternInformation(
      initializer.$server.getAliasHelper()
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
    const arrayOperandNode: ArrayOperandNode = new ArrayOperandNode(
      [operandNode],
      [operand],
      IndexRange.create(0, 0, 0, operand.length),
      "String",
      operand
    );

    const actual: ScopeEnum[] = arrayOperandNode.getPatternInformation(
      initializer.$server.getAliasHelper()
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
    const arrayOperandNode: ArrayOperandNode = new ArrayOperandNode(
      [operandNode],
      [operand],
      IndexRange.create(0, 0, 0, operand.length),
      "String",
      operand
    );

    const actual: ScopeEnum[] = arrayOperandNode.getPatternInformation(
      initializer.$server.getAliasHelper()
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
    const arrayOperandNode: ArrayOperandNode = new ArrayOperandNode(
      [operandNode],
      [operand],
      IndexRange.create(0, 0, 0, operand.length),
      "String",
      operand
    );

    const actual: ScopeEnum[] = arrayOperandNode.getPatternInformation(
      initializer.$server.getAliasHelper()
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
    const arrayOperandNode: ArrayOperandNode = new ArrayOperandNode(
      [operandNode],
      [operand],
      IndexRange.create(0, 0, 0, operand.length),
      "String",
      operand
    );

    const actual: ScopeEnum[] = arrayOperandNode.getPatternInformation(
      initializer.$server.getAliasHelper()
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
    const arrayOperandNode: ArrayOperandNode = new ArrayOperandNode(
      [operandNode],
      [operand],
      IndexRange.create(0, 0, 0, operand.length),
      "String",
      operand
    );

    const actual: ScopeEnum[] = arrayOperandNode.getPatternInformation(
      initializer.$server.getAliasHelper()
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
    const arrayOperandNode: ArrayOperandNode = new ArrayOperandNode(
      [operandNode],
      [operand],
      IndexRange.create(0, 0, 0, operand.length),
      "String",
      operand
    );

    const actual: ScopeEnum[] = arrayOperandNode.getPatternInformation(
      initializer.$server.getAliasHelper()
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
    const arrayOperandNode: ArrayOperandNode = new ArrayOperandNode(
      [operandNode],
      [operand],
      IndexRange.create(0, 0, 0, operand.length),
      "String",
      operand
    );

    const actual: ScopeEnum[] = arrayOperandNode.getPatternInformation(
      initializer.$server.getAliasHelper()
    )!.$capture;
    const expected: ScopeEnum[] = [];

    expect(actual).toEqual(expected);
  });
});
