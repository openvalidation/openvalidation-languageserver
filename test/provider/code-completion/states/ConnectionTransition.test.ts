import "jest";
import { CompletionContainer } from "../../../../src/provider/code-completion/CompletionContainer";
import { CompletionBuilder } from "../../../../src/provider/code-completion/CompletionBuilder";
import { ConnectionTransition } from "../../../../src/provider/code-completion/states/ConnectionTransition";
import { TestInitializer } from "../../../Testinitializer";

describe("ConnectionTransition Tests", () => {
    var initializer: TestInitializer;

    beforeEach(() => {
        initializer = new TestInitializer(true);
    });

    test("getCompletions with ConnectionTransition, expect two CompletionItems", () => {
        var container: CompletionContainer = new CompletionContainer();
        var builder: CompletionBuilder = new CompletionBuilder([], initializer.server.aliasHelper, initializer.server.schema);

        var connectionTransition: ConnectionTransition = new ConnectionTransition();
        container.addTransition(connectionTransition);

        var expectedLength: number = 2;
        var actualLength: number = container.getCompletions(builder).build().length;

        expect(actualLength).toEqual(expectedLength);
    });
});