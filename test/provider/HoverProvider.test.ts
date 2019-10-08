import 'jest';
import { MarkupContent, MarkupKind, Position, TextDocumentPositionParams } from 'vscode-languageserver';
import { HoverProvider } from '../../src/provider/HoverProvider';
import { TestInitializer } from '../TestInitializer';

describe('Hover provider test', () => {
    let provider: HoverProvider;

    function getParams(position: Position): TextDocumentPositionParams {
        return {
            textDocument: {
                uri: 'test.ov'
            },
            position
        };
    }

    beforeEach(() => {
        const testInitializer = new TestInitializer(true);
        provider = testInitializer.hoverProvider;
    });

    test('Verify provider exists', () => {
        expect(provider).not.toBeNull();
    });

    test('hover with empty document, expect null', async () => {
        const tmpTestInitializer = new TestInitializer(false);
        const tmpProvider = tmpTestInitializer.hoverProvider;

        const actual = await tmpProvider.hover(getParams(Position.create(0, 0)));
        expect(actual).toBeNull();
    });

    test('hover with valid document and invalid position, expect null', async () => {
        const actual = await provider.hover(getParams(Position.create(100, 0)));
        expect(actual).toBeNull();
    });

    test('hover with invalid document-uri, expect null', async () => {
        const inputParam: TextDocumentPositionParams = {
            textDocument: {
                uri: 'invalidUri'
            },
            position: Position.create(100, 0)
        };

        const actual = await provider.hover(inputParam);
        expect(actual).toBeNull();
    });

    test('hover with valid document and Position {0, 1}, expect hover-documentation', async () => {
        const expectedHoverKind: MarkupKind = MarkupKind.Markdown;
        const actual = await provider.hover(getParams(Position.create(0, 1)));

        const actualHoverKind = (actual!.contents as MarkupContent).kind;
        expect(actualHoverKind).toEqual(expectedHoverKind);
    });
});
