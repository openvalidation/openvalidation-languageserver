import "jest";
import { CompletionContainer } from "../../../../src/provider/code-completion/CompletionContainer";
import { OperandTransition } from "../../../../src/provider/code-completion/states/OperandTransition";
import { StateTransition } from "../../../../src/provider/code-completion/states/StateTransition";
import { IStateTransition } from "../../../../src/provider/code-completion/states/state-constructor/IStateTransition";

describe("ThenKeywordTransition Tests", () => {
  test("getCompletions with empty transitions, expect empty", () => {
    const container: CompletionContainer = new CompletionContainer();

    const constructor: IStateTransition = {
      prependingText: ", "
    };
    const operandTransition: StateTransition = new OperandTransition(
      "",
      [],
      constructor
    );
    container.addTransition(operandTransition);

    const expected: string = ", ";
    const actual = operandTransition.$prependingText;

    expect(actual).toEqual(expected);
  });
});
