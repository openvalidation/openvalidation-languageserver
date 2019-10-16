import "jest";
import { CompletionBuilder } from "../../../../src/provider/code-completion/CompletionBuilder";
import { CompletionContainer } from "../../../../src/provider/code-completion/CompletionContainer";
import { AsKeywordTransition } from "../../../../src/provider/code-completion/states/AsKeywordTransition";
import { TestInitializer } from "../../../Testinitializer";

describe("AsKeywordTransition Tests", () => {
  let initializer: TestInitializer;

  beforeEach(() => {
    initializer = new TestInitializer(true);
  });

  test("getCompletions with AsKeywordTransition, expect one CompletionItem", () => {
    const container: CompletionContainer = new CompletionContainer();
    const builder: CompletionBuilder = new CompletionBuilder(
      [],
      initializer.$server.aliasHelper,
      initializer.$server.schema
    );

    const askeywordTransition: AsKeywordTransition = new AsKeywordTransition();
    container.addTransition(askeywordTransition);

    const expectedLength: number = 1;
    const actualLength: number = container.getCompletions(builder).build()
      .length;

    expect(actualLength).toEqual(expectedLength);
  });
});
