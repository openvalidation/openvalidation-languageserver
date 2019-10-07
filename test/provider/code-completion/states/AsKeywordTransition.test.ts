import "jest";
import { CompletionContainer } from "../../../../src/provider/code-completion/CompletionContainer";
import { CompletionBuilder } from "../../../../src/provider/code-completion/CompletionBuilder";
import { AsKeywordTransition } from "../../../../src/provider/code-completion/states/AsKeywordTransition";
import { TestInitializer } from "../../../Testinitializer";

describe("AsKeywordTransition Tests", () => {
    var initializer: TestInitializer;

    beforeEach(() => {
        initializer = new TestInitializer(true);
    });

    test("getCompletions with AsKeywordTransition, expect one CompletionItem", () => {
        var container: CompletionContainer = new CompletionContainer();
        var builder: CompletionBuilder = new CompletionBuilder([], initializer.server.aliasHelper, initializer.server.schema);

        var askeywordTransition: AsKeywordTransition = new AsKeywordTransition();
        container.addTransition(askeywordTransition);

        var expectedLength: number = 1;
        var actualLength: number = container.getCompletions(builder).build().length;

        expect(actualLength).toEqual(expectedLength);
    });
});