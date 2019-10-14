import "jest";
import { CompletionItem } from "vscode-languageserver";
import { AliasHelper } from "../../../src/aliases/AliasHelper";
import { Variable } from "../../../src/data-model/syntax-tree/Variable";
import { CompletionBuilder } from "../../../src/provider/code-completion/CompletionBuilder";
// import { TestInitializer } from "../../Testinitializer";

describe("CompletionGenerator tests", () => {
  // let initializer: TestInitializer;

  // beforeEach(() => {
  //   initializer = new TestInitializer(true);
  // });

  // test("default with empty parameters, expect globals", () => {
  //   const expected: CompletionItem[] = [];
  //   const actual: CompletionItem[] = CompletionBuilder.default(
  //     [],
  //     initializer.$server
  //   );

  //   expect(actual).not.toEqual(expected);

  //   const builder: CompletionBuilder = new CompletionBuilder(
  //     [new Variable("test", "Decimal")],
  //     new AliasHelper(),
  //     {
  //       complexData: [{ child: "Alter", parent: "Student" }],
  //       dataProperties: [
  //         { name: "Student.Alter", type: "Decimal" },
  //         { name: "Student", type: "Object" },
  //         { name: "Alter", type: "Decimal" }
  //       ]
  //     }
  //   );
  // });

  // test("addGlobals with constrained keywords, expect 4 globals", () => {
  //   const aliasHelper: AliasHelper = new AliasHelper();
  //   const input = new Map<string, string>();
  //   input.set("AND", AliasKey.AND);
  //   input.set("OR", AliasKey.OR);
  //   input.set("AS", AliasKey.AS);
  //   input.set("COMMENT", AliasKey.COMMENT);
  //   input.set("THEN", AliasKey.THEN);
  //   input.set("IF", AliasKey.IF);
  //   input.set("EQUALS", AliasKey.EQUALS);
  //   input.set("SUM OF", AliasKey.SUM_OF);
  //   input.set("OF", AliasKey.OF);
  //   aliasHelper.$aliases = input;

  //   const builder: CompletionBuilder = new CompletionBuilder(
  //     [new Variable("test", "Decimal")],
  //     aliasHelper,
  //     {
  //       complexData: [{ child: "Alter", parent: "Student" }],
  //       dataProperties: [
  //         { name: "Student.Alter", type: "Decimal" },
  //         { name: "Student", type: "Object" },
  //         { name: "Alter", type: "Decimal" }
  //       ]
  //     }
  //   );
  // });

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
});
