import 'jest';
import { Position, TextDocumentPositionParams } from 'vscode-languageserver';
import { GotoDefinitionProvider } from '../../src/provider/GotoDefinitionProvider';
import { TestInitializer } from '../TestInitializer';

describe('GotoDefinition provider test', () => {
    let provider: GotoDefinitionProvider;

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
        provider = testInitializer.gotoDefinitionProvider;
    });

    test('Verify provider exists', () => {
        expect(provider).not.toBeNull();
    });

    test('definition with empty document, expect empty list', () => {
        const tmpTestInitializer = new TestInitializer(false);
        const tmpProvider = tmpTestInitializer.gotoDefinitionProvider;

        const expected: Location[] = [];
        const actual = tmpProvider.definition(getParams(Position.create(1, 10)));

        expect(actual).toEqual(expected);
    });

    test('definition with invalid document-uri, expect empty list', () => {
        const expected: Location[] = [];

        const inputPosition: Position = Position.create(6, 20);
        const inputParams: TextDocumentPositionParams = {
            textDocument: {
                uri: 'invalidUri'
            },
            position: inputPosition
        };
        const actual = provider.definition(inputParams);
        expect(actual).toEqual(expected);
    });

    test('definition with valid document but wrong position, expect empty list', () => {
        const expected: Location[] = [];
        const actual = provider.definition(getParams(Position.create(1, 10)));

        expect(actual).toEqual(expected);
    });

    // test("definition with valid document and valid position, expect one definition", () => {
    //     var expectedRange: Range = Range.create(4, 4, 4, 16);
    //     var expectedLocations: LocationLink[] = [LocationLink.create("test.ov", expectedRange, expectedRange)];

    //     var actual = provider.definition(getParams(Position.create(6, 20)));
    //     expect(actual).toEqual(expectedLocations);
    // });
});
