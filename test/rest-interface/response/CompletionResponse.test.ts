import 'jest';
import { CompletionResponse } from '../../../src/rest-interface/response/CompletionResponse';
import { TestInitializer } from '../../Testinitializer';

describe('CompletionResponse tests', () => {
    let testInitializer: TestInitializer;

    beforeEach(() => {
        testInitializer = new TestInitializer(true);
    });

    test('Create CompletionResponse, test getter/setter of errors', () => {
        const expected = testInitializer.getCorrectParseResult().$scopes[0];
        const response = new CompletionResponse(expected);

        expect(response.$scope).toEqual(expected);
    });
});
