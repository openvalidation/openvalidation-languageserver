import "jest";
import { IndexRange } from '../../../src/data-model/syntax-tree/IndexRange';
import { LintingError } from '../../../src/rest-interface/response/LintingError';
import { LintingResponse } from '../../../src/rest-interface/response/LintingResponse';
import { TestInitializer } from '../../Testinitializer';

describe("LintingResponse Tests", () => {
    var testInitializer: TestInitializer;

    beforeEach(() => {
        testInitializer = new TestInitializer(true);
    });

    test("Create LintingResponse, test getter/setter of errors", () => {
        var response = new LintingResponse(testInitializer.getCorrectParseResult(), testInitializer.server.schema);

        var expected = [new LintingError("error", IndexRange.create(0, 0, 0, 1))];
        response.$errors = expected;

        expect(response.$errors).toEqual(expected);
    });

    test("Create LintingResponse, test getter of mainAstNode", () => {
        var response = new LintingResponse(testInitializer.getCorrectParseResult(), testInitializer.server.schema);

        var expected = testInitializer.getCorrectParseResult();

        expect(response.$mainAstNode).toEqual(expected);
    });

    test("Create LintingResponse, test getter of schema", () => {
        var response = new LintingResponse(testInitializer.getCorrectParseResult(), testInitializer.server.schema);

        var expected = testInitializer.server.schema;

        expect(response.$schema).toEqual(expected);
    });
});