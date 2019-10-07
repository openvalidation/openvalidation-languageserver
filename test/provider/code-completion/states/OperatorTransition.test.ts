import "jest";
import { CompletionContainer } from "../../../../src/provider/code-completion/CompletionContainer";
import { CompletionBuilder } from "../../../../src/provider/code-completion/CompletionBuilder";
import { OperatorTransition } from "../../../../src/provider/code-completion/states/OperatorTransition";
import { TestInitializer } from "../../../Testinitializer";

describe("OperatorTransition Tests", () => {
    var initializer: TestInitializer;

    beforeEach(() => {
        initializer = new TestInitializer(true);
    });

    test("getCompletions with OperatorTransition, expected more than zero completionItems", () => {
        var container: CompletionContainer = new CompletionContainer();
        var builder: CompletionBuilder = new CompletionBuilder([], initializer.server.aliasHelper, initializer.server.schema);

        var operatorTransition: OperatorTransition = new OperatorTransition("Decimal");
        container.addTransition(operatorTransition);

        var expectedLength: number = 0;
        var actualLength: number = container.getCompletions(builder).build().length;

        expect(actualLength).not.toEqual(expectedLength);
    });
});