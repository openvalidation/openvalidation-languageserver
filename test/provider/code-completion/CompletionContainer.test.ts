import 'jest';
import { CompletionItem } from 'vscode-languageserver';
import { CompletionBuilder } from '../../../src/provider/code-completion/CompletionBuilder';
import { CompletionContainer } from '../../../src/provider/code-completion/CompletionContainer';
import { TestInitializer } from '../../Testinitializer';

describe('CompletionContainer tests', () => {
    let initializer: TestInitializer;

    beforeEach(() => {
        initializer = new TestInitializer(true);
    });

    test('getCompletions with empty transitions, expect empty', () => {
        const container: CompletionContainer = new CompletionContainer();
        const builder: CompletionBuilder =
            new CompletionBuilder([], initializer.$server.aliasHelper, initializer.$server.schema);

        const expected: CompletionItem[] = [];
        const actual: CompletionItem[] = container.getCompletions(builder).build();

        expect(actual).toEqual(expected);
    });
});
