import "jest";
import { CompletionContainer } from '../../../src/provider/code-completion/CompletionContainer';
import { CompletionBuilder } from '../../../src/provider/code-completion/CompletionBuilder';
import { TestInitializer } from '../../Testinitializer';
import { CompletionItem } from "vscode-languageserver";

describe("CompletionContainer tests", () => {
    var initializer: TestInitializer;

    beforeEach(() => {
        initializer = new TestInitializer(true);
    });

    test("getCompletions with empty transitions, expect empty", () => {
        var container: CompletionContainer = new CompletionContainer();
        var builder: CompletionBuilder = new CompletionBuilder([], initializer.server.aliasHelper, initializer.server.schema);

        var expected: CompletionItem[] = [];
        var actual: CompletionItem[] = container.getCompletions(builder).build();

        expect(actual).toEqual(expected);
    });
});