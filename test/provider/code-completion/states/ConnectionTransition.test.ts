import 'jest';
import { CompletionBuilder } from '../../../../src/provider/code-completion/CompletionBuilder';
import { CompletionContainer } from '../../../../src/provider/code-completion/CompletionContainer';
import { ConnectionTransition } from '../../../../src/provider/code-completion/states/ConnectionTransition';
import { TestInitializer } from '../../../Testinitializer';

describe('ConnectionTransition Tests', () => {
    let initializer: TestInitializer;

    beforeEach(() => {
        initializer = new TestInitializer(true);
    });

    test('getCompletions with ConnectionTransition, expect two CompletionItems', () => {
        const container: CompletionContainer = new CompletionContainer();
        const builder: CompletionBuilder =
            new CompletionBuilder([], initializer.$server.aliasHelper, initializer.$server.schema);

        const connectionTransition: ConnectionTransition = new ConnectionTransition();
        container.addTransition(connectionTransition);

        const expectedLength: number = 2;
        const actualLength: number = container.getCompletions(builder).build().length;

        expect(actualLength).toEqual(expectedLength);
    });
});
