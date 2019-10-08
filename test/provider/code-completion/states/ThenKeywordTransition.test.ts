import 'jest';
import { CompletionBuilder } from '../../../../src/provider/code-completion/CompletionBuilder';
import { CompletionContainer } from '../../../../src/provider/code-completion/CompletionContainer';
import { ThenKeywordTransition } from '../../../../src/provider/code-completion/states/ThenKeywordTransition';
import { TestInitializer } from '../../../Testinitializer';

describe('ThenKeywordTransition Tests', () => {
    let initializer: TestInitializer;

    beforeEach(() => {
        initializer = new TestInitializer(true);
    });

    test('getCompletions with ThenKeywordTransition, expect one CompletionItem', () => {
        const container: CompletionContainer = new CompletionContainer();
        const builder: CompletionBuilder =
            new CompletionBuilder([], initializer.$server.aliasHelper, initializer.$server.schema);

        const thenKeywordTransition: ThenKeywordTransition = new ThenKeywordTransition();
        container.addTransition(thenKeywordTransition);

        const expectedLength: number = 1;
        const actualLength: number = container.getCompletions(builder).build().length;

        expect(actualLength).toEqual(expectedLength);
    });
});
