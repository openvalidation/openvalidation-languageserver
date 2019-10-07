import "jest";
import { CompletionContainer } from "../../../../src/provider/code-completion/CompletionContainer";
import { OperandTransition } from "../../../../src/provider/code-completion/states/OperandTransition";
import { StateTransition } from "../../../../src/provider/code-completion/states/StateTransition";

describe("ThenKeywordTransition Tests", () => {
    test("getCompletions with empty transitions, expect empty", () => {
        var container: CompletionContainer = new CompletionContainer();

        var prependingText: string = ", ";
        var operandTransition: StateTransition = new OperandTransition("", [], prependingText);
        container.addTransition(operandTransition);

        var expected: string = prependingText;
        var actual = operandTransition.$prependingText;

        expect(actual).toEqual(expected);
    });
});