import "jest";
import { CompletionItem, Position } from "vscode-languageserver";
import { CompletionBuilder } from "../../../src/provider/code-completion/CompletionBuilder";
import { CompletionContainer } from "../../../src/provider/code-completion/CompletionContainer";
import { TestInitializer } from "../../Testinitializer";
import { OperandNode } from "../../../src/data-model/syntax-tree/element/operation/operand/OperandNode";
import { IndexRange } from "../../../src/data-model/syntax-tree/IndexRange";
import { IndexPosition } from "../../../src/data-model/syntax-tree/IndexPosition";

describe("CompletionContainer tests", () => {
  let initializer: TestInitializer;

  beforeEach(() => {
    initializer = new TestInitializer(true);
  });

  test("getCompletions with empty transitions, expect empty", () => {
    const container: CompletionContainer = new CompletionContainer();
    const builder: CompletionBuilder = new CompletionBuilder(
      [],
      initializer.$server.getAliasHelper(),
      initializer.$server.schema
    );

    const expected: CompletionItem[] = [];
    const actual: CompletionItem[] = container.getCompletions(builder).build();

    expect(actual).toEqual(expected);
  });

  test("getCompletions with position at operand, expect alternative operands", () => {
    const operand = new OperandNode(
      ["Alter"],
      new IndexRange(new IndexPosition(0, 0), new IndexPosition(0, 5)),
      "Decimal",
      "Alter"
    );
    const container: CompletionContainer = operand.getCompletionContainer(
      Position.create(0, 2)
    );
    const builder: CompletionBuilder = new CompletionBuilder(
      [],
      initializer.$server.getAliasHelper(),
      initializer.$server.schema
    );

    const expectedLength: number = 3;
    const actualLength: number = container.getCompletions(builder).build()
      .length;

    expect(actualLength).toEqual(expectedLength);
  });
});
