import 'jest';
import { IndexRange } from '../../../src/data-model/syntax-tree/IndexRange';
import { LintingError } from '../../../src/rest-interface/response/LintingError';
import { LintingResponse } from '../../../src/rest-interface/response/LintingResponse';
import { TestInitializer } from '../../Testinitializer';

describe('LintingResponse Tests', () => {
    let testInitializer: TestInitializer;

    beforeEach(() => {
        testInitializer = new TestInitializer(true);
    });

    test('Create LintingResponse, test getter/setter of errors', () => {
        const response = new LintingResponse(testInitializer.getCorrectParseResult(), testInitializer.$server.schema);

        const expected = [new LintingError('error', IndexRange.create(0, 0, 0, 1))];
        response.$errors = expected;

        expect(response.$errors).toEqual(expected);
    });

    test('Create LintingResponse, test getter of mainAstNode', () => {
        const response = new LintingResponse(testInitializer.getCorrectParseResult(), testInitializer.$server.schema);

        const expected = testInitializer.getCorrectParseResult();

        expect(response.$mainAstNode).toEqual(expected);
    });

    test('Create LintingResponse, test getter of schema', () => {
        const response = new LintingResponse(testInitializer.getCorrectParseResult(), testInitializer.$server.schema);

        const expected = testInitializer.$server.schema;

        expect(response.$schema).toEqual(expected);
    });
});
