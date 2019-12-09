import "jest";
import { CompletionItem } from "vscode-languageserver";
import { AliasHelper } from "../../../src/aliases/AliasHelper";
import { Variable } from "../../../src/data-model/syntax-tree/Variable";
import { CompletionBuilder } from "../../../src/provider/code-completion/CompletionBuilder";
import { TestInitializer } from "../../Testinitializer";
import { AliasKey } from "../../../src/aliases/AliasKey";
import { EmptyTransition } from "../../../src/provider/code-completion/states/EmptyTransition";

describe("CompletionGenerator tests", () => {
  let initializer: TestInitializer;

  beforeEach(() => {
    initializer = new TestInitializer(true);
  });

  test("default with empty parameters, expect 3 globals", () => {
    const expectedLength: number = 3;
    const actual: CompletionItem[] = CompletionBuilder.default(
      [],
      initializer.$server
    );

    expect(actual.length).toEqual(expectedLength);
  });

  test("addGlobals with constrained keywords, expect 4 globals", () => {
    const aliasHelper: AliasHelper = new AliasHelper();
    const input = new Map<string, string>();
    input.set("AND", AliasKey.AND);
    input.set("OR", AliasKey.OR);
    input.set("AS", AliasKey.AS);
    input.set("COMMENT", AliasKey.COMMENT);
    input.set("THEN", AliasKey.THEN);
    input.set("IF", AliasKey.IF);
    input.set("EQUALS", AliasKey.EQUALS);
    input.set("SUM OF", AliasKey.SUM_OF);
    input.set("OF", AliasKey.OF);
    input.set("MUST", AliasKey.CONSTRAINT);
    aliasHelper.$aliases = input;

    const builder: CompletionBuilder = new CompletionBuilder(
      [new Variable("test", "Decimal")],
      aliasHelper,
      {
        complexData: [{ child: "Alter", parent: "Student" }],
        dataProperties: [
          { name: "Student.Alter", type: "Decimal" },
          { name: "Student", type: "Object" },
          { name: "Alter", type: "Decimal" }
        ]
      }
    );
    builder.addGlobals();

    const expectedLength: number = 4;
    const actual: CompletionItem[] = builder.build();

    expect(actual.length).toEqual(expectedLength);
  });

  test("addOperandsWithTypeOfGivenOperand with empty builder, expect the same builder", () => {
    const builder: CompletionBuilder = new CompletionBuilder(
      [],
      new AliasHelper(),
      { complexData: [], dataProperties: [] }
    );

    const expected: CompletionItem[] = builder.build();
    const actual: CompletionItem[] = builder
      .addOperandsWithTypeOfGivenOperand("Something")
      .build();

    expect(actual).toEqual(expected);
  });

  test("addOperandsWithTypeOfGivenOperand with one variable and schema-attributes, expect another builder", () => {
    const builder: CompletionBuilder = new CompletionBuilder(
      [new Variable("test", "Decimal")],
      new AliasHelper(),
      {
        complexData: [{ child: "Alter", parent: "Student" }],
        dataProperties: [
          { name: "Student.Alter", type: "Decimal" },
          { name: "Student", type: "Object" },
          { name: "Alter", type: "Decimal" }
        ]
      }
    );

    const expectedLength: number = 1;
    const actualLength: number = builder
      .addOperandsWithTypeOfGivenOperand("Student.Alter")
      .build().length;

    expect(actualLength).toEqual(expectedLength);
  });

  test("addOperandsWithTypeOfGivenOperand with one variable and schema-attributes, expect another builder", () => {
    const builder: CompletionBuilder = new CompletionBuilder(
      [new Variable("test", "Decimal")],
      new AliasHelper(),
      {
        complexData: [{ child: "Alter", parent: "Student" }],
        dataProperties: [
          { name: "Student.Alter", type: "Decimal" },
          { name: "Student", type: "Object" },
          { name: "Alter", type: "Decimal" }
        ]
      }
    );

    const expectedLength: number = 2;
    const actualLength: number = builder
      .addOperandsWithTypeOfGivenOperand("test")
      .build().length;

    expect(actualLength).toEqual(expectedLength);
  });

  test("addSnippet with empty builder and without label, expect the same builder", () => {
    const builder: CompletionBuilder = new CompletionBuilder(
      [],
      new AliasHelper(),
      { complexData: [], dataProperties: [] }
    );

    const expected: CompletionItem[] = [];
    const actual: CompletionItem[] = builder["addSnippet"](
      null,
      "",
      "",
      new EmptyTransition()
    ).build();

    expect(actual).toEqual(expected);
  });

  test("addKeyword with empty builder and without label, expect the same builder", () => {
    const builder: CompletionBuilder = new CompletionBuilder(
      [],
      new AliasHelper(),
      { complexData: [], dataProperties: [] }
    );

    const expected: CompletionItem[] = [];
    const actual: CompletionItem[] = builder["addKeyword"](
      null,
      "",
      new EmptyTransition(),
      ""
    ).build();

    expect(actual).toEqual(expected);
  });

  test("addFunction with empty builder and without label, expect the same builder", () => {
    const builder: CompletionBuilder = new CompletionBuilder(
      [],
      new AliasHelper(),
      { complexData: [], dataProperties: [] }
    );

    const expected: CompletionItem[] = [];
    const actual: CompletionItem[] = builder["addFunction"](
      null,
      "",
      "",
      new EmptyTransition()
    ).build();

    expect(actual).toEqual(expected);
  });

  test("addVariable with empty builder and without label, expect the same builder", () => {
    const builder: CompletionBuilder = new CompletionBuilder(
      [],
      new AliasHelper(),
      { complexData: [], dataProperties: [] }
    );

    const expected: CompletionItem[] = [];
    const actual: CompletionItem[] = builder["addVariable"](
      null,
      "",
      "",
      new EmptyTransition()
    ).build();

    expect(actual).toEqual(expected);
  });
});
