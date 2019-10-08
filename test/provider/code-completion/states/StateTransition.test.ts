import 'jest';
import { CompletionContainer } from '../../../../src/provider/code-completion/CompletionContainer';
import { OperandTransition } from '../../../../src/provider/code-completion/states/OperandTransition';
import { StateTransition } from '../../../../src/provider/code-completion/states/StateTransition';

describe('ThenKeywordTransition Tests', () => {
    test('getCompletions with empty transitions, expect empty', () => {
        const container: CompletionContainer = new CompletionContainer();

        const prependingText: string = ', ';
        const operandTransition: StateTransition = new OperandTransition('', [], prependingText);
        container.addTransition(operandTransition);

        const expected: string = prependingText;
        const actual = operandTransition.$prependingText;

        expect(actual).toEqual(expected);
    });
});
