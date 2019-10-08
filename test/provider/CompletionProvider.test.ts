import 'jest';
import { CompletionItem, CompletionParams, CompletionTriggerKind, Position, TextDocument } from 'vscode-languageserver';
import { CompletionProvider } from '../../src/provider/CompletionProvider';
import { TestInitializer } from '../TestInitializer';

describe('Completion provider test', () => {
    let provider: CompletionProvider;
    let testInitializer: TestInitializer;

    beforeEach(() => {
        testInitializer = new TestInitializer(true);
        provider = testInitializer.completionProvider;
    });

    test('Verify provider exists', () => {
        expect(provider).not.toBeNull();
    });

    test('completionResolve with default item, expect same item', () => {
        const expected: CompletionItem = CompletionItem.create('Test-Item');

        const input: CompletionItem = CompletionItem.create('Test-Item');
        const actual = provider.completionResolve(input);

        expect(actual).toEqual(expected);
    });

    test('completionForParsedElement with null, expected global items', () => {
        const expectedLength: number = 3;
        const actual: CompletionItem[] | null = provider['completionForParsedElement'](null, [], Position.create(0, 0), '');

        expect(actual!.length).toEqual(expectedLength);
    });

    test('completionForParsedElement with null, expected global items', () => {
        const expectedLength: number = 3;
        const actual: CompletionItem[] | null = provider['completionForParsedElement'](null, [], Position.create(0, 0), '');

        expect(actual!.length).toEqual(expectedLength);
    });

    test('completionForParsedElement with null, expected global items', () => {
        const expectedLength: number = 3;
        const actual: CompletionItem[] | null =
            provider['completionForParsedElement'](
                testInitializer.getInorrectCompletionResponse(), [], Position.create(3, 0), '');

        expect(actual!.length).toEqual(expectedLength);
    });

    test('completionForParsedElement with null, expected global items', () => {
        const expectedLength: number = 0;
        const actual: CompletionItem[] | null =
            provider['completionForParsedElement'](
                testInitializer.getCorrectCompletionResponse(), [], Position.create(5, 0), '');

        expect(actual!.length).toEqual(expectedLength);
    });

    test('completionByText with null, expected global items', async () => {
        const document: TextDocument = {
            uri: 'test.ov',
            languageId: 'ov',
            version: 0.1,
            getText: () => '',
            positionAt: () => Position.create(0, 0),
            offsetAt: () => 0,
            lineCount: 0
        };
        const params: CompletionParams = {
            textDocument: {
                uri: 'test.ov'
            },
            position: Position.create(0, 0),
            context: {
                triggerKind: CompletionTriggerKind.Invoked,
                triggerCharacter: ''
            }
        };

        const actual: CompletionItem[] | null = await provider['completionByText'](document, params)!;
        const expectedLength: number = 0;

        expect(actual!.length).toEqual(expectedLength);
    });
});
