import "jest";
import { CompletionBuilder } from "../../../../src/provider/code-completion/CompletionBuilder";
import { CompletionContainer } from "../../../../src/provider/code-completion/CompletionContainer";
import { OperatorTransition } from "../../../../src/provider/code-completion/states/OperatorTransition";
import { TestInitializer } from "../../../Testinitializer";

describe("OperatorTransition Tests", () => {
  let initializer: TestInitializer;

  beforeEach(() => {
    initializer = new TestInitializer(true);
  });

  test("getCompletions with OperatorTransition, expected more than zero completionItems", () => {
    const container: CompletionContainer = new CompletionContainer();
    const builder: CompletionBuilder = new CompletionBuilder(
      [],
      initializer.$server.getAliasHelper(),
      initializer.$server.schema
    );

    const operatorTransition: OperatorTransition = new OperatorTransition(
      "Decimal"
    );
    container.addTransition(operatorTransition);

    const expectedLength: number = 0;
    const actualLength: number = container.getCompletions(builder).build()
      .length;

    expect(actualLength).not.toEqual(expectedLength);
  });
});
