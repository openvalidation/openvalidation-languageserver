import "jest"
import { TestInitializer } from "../../Testinitializer";
import { TextMateParameter } from "../../../src/provider/syntax-highlighting/TextMateParameter";
import { Pattern } from "../../../src/provider/syntax-highlighting/TextMateJson";

describe("TextMateParameter Tests", () => {
    var testInitializer: TestInitializer;

    beforeEach(() => {
        testInitializer = new TestInitializer(true);
    });


    test("getIdentifier with empty response, expect no identifier", () => {
        var parameter = new TextMateParameter(testInitializer.mockEmptyLintingResponse(), testInitializer.server);
        
        var actual: string[] = parameter["getIdentifier"]();
        var expected: string[] = [];

        expect(actual).toEqual(expected);
    })

    test("getIdentifier with not empty response, expect one identifier", () => {
        var parameter = new TextMateParameter(testInitializer.mockNotEmptyLintingResponse(), testInitializer.server);
        
        var actualLength = parameter["getIdentifier"]().length;
        var expectedLength = 1;

        expect(actualLength).toEqual(expectedLength);
    })

    test("getOperationAndOperandPatterns with not empty response", () => {
        var parameter = new TextMateParameter(testInitializer.mockNotEmptyLintingResponse(), testInitializer.server);
        
        var actual: Pattern[] = parameter.getOperationAndOperandPatterns(null);
        var expected: Pattern[] = [];

        expect(actual).toEqual(expected);
    })
});