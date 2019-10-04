import "jest";
import { CompletionResponse } from '../../../src/rest-interface/response/CompletionResponse';
import { TestInitializer } from '../../Testinitializer';

describe("CompletionResponse tests", () => {
    var testInitializer: TestInitializer;
    
    beforeEach(() => {
        testInitializer = new TestInitializer(true);
    });

    test("Create CompletionResponse, test getter/setter of errors", () => {
        var expected = testInitializer.getCorrectParseResult().$scopes[0];
        var response = new CompletionResponse(expected);

        expect(response.$scope).toEqual(expected);
    });
});