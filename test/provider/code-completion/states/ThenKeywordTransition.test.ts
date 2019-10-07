import "jest";
import { CompletionContainer } from "../../../../src/provider/code-completion/CompletionContainer";
import { CompletionBuilder } from "../../../../src/provider/code-completion/CompletionBuilder";
import { ThenKeywordTransition } from "../../../../src/provider/code-completion/states/ThenKeywordTransition";
import { TestInitializer } from "../../../Testinitializer";

describe("ThenKeywordTransition Tests", () => {
    var initializer: TestInitializer;

    beforeEach(() => {
        initializer = new TestInitializer(true);
    });

    test("getCompletions with ThenKeywordTransition, expect one CompletionItem", () => {
        var container: CompletionContainer = new CompletionContainer();
        var builder: CompletionBuilder = new CompletionBuilder([], initializer.server.aliasHelper, initializer.server.schema);

        var thenKeywordTransition: ThenKeywordTransition = new ThenKeywordTransition();
        container.addTransition(thenKeywordTransition);

        var expectedLength: number = 1;
        var actualLength: number = container.getCompletions(builder).build().length;

        expect(actualLength).toEqual(expectedLength);
    });
});