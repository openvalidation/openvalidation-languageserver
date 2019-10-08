import 'jest';
import { DocumentRangeFormattingParams, Range } from 'vscode-languageserver';
import { FormattingProvider } from '../../src/provider/FormattingProvider';
import { TestInitializer } from '../TestInitializer';

describe('Formatting provider test', () => {
    let provider: FormattingProvider;

    function getParams(range: Range): DocumentRangeFormattingParams {
        return {
            textDocument: {
                uri: 'test.ov'
            },
            range,
            options: {
                tabSize: 4,
                insertSpaces: true
            }
        };
    }

    beforeEach(() => {
        const testInitializer = new TestInitializer(true);
        provider = testInitializer.formattingProvider;
    });

    test('Verify provider exists', () => {
        expect(provider).not.toBeNull();
    });

    test('documentRangeFormatting with empty document, expect empty list', () => {
        const tmpTestInitializer = new TestInitializer(false);
        const tmpProvider = tmpTestInitializer.formattingProvider;

        const expected: Location[] = [];
        const actual = tmpProvider.documentRangeFormatting(getParams(Range.create(0, 0, 0, 0)));

        expect(actual).toEqual(expected);
    });

    test('documentRangeFormatting with valid document but invalid range, expect empty list', () => {
        const expected: Location[] = [];
        const actual = provider.documentRangeFormatting(getParams(Range.create(0, 0, 0, 0)));

        expect(actual).toEqual(expected);
    });

    test('documentRangeFormatting with invalid document-uri but valid range, expect empty list', () => {
        const expected: Location[] = [];

        const inputParams: DocumentRangeFormattingParams = {
            textDocument: {
                uri: 'invalidUri'
            },
            range: Range.create(0, 0, 30, 0),
            options: {
                tabSize: 4,
                insertSpaces: true
            }
        };
        const actual = provider.documentRangeFormatting(inputParams);

        expect(actual).toEqual(expected);
    });

    // test("documentRangeFormatting with valid document and valid range, expect not empty list", () => {
    //     var expectedLength: number = 8;
    //     var actual = provider.documentRangeFormatting(getParams(Range.create(0, 0, 30, 0)));

    //     expect(actual.length).toEqual(expectedLength);
    // });
});
