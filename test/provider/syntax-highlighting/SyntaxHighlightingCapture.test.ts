import "jest";
import { ScopeEnum } from "../../../src/enums/ScopeEnum";
import { SyntaxHighlightingCapture } from "../../../src/provider/syntax-highlighting/SyntaxHighlightingCapture";

describe("SyntaxHighlightingCapture tests", () => {
    var capture: SyntaxHighlightingCapture
    
    beforeEach(() => {
        capture = new SyntaxHighlightingCapture();
    });

    test("test getter/setter of capture", () => {
        var expected = [ScopeEnum.Empty, ScopeEnum.Comment, ScopeEnum.StaticString];
        
        capture.$capture = expected;
        var actual = expected;

        expect(actual).toEqual(expected);
    });

    test("test getter/setter of match", () => {
        var expected = "Test";
        
        capture.$match = expected;
        var actual = expected;

        expect(actual).toEqual(expected);
    });

    test("buildPattern with empty capture, expect null", () => {
        var expected = null;
        var actual = capture.buildPattern();

        expect(actual).toEqual(expected);
    });

    test("addRegexToMatch with empty regex, expect group of previous string", () => {
        var input = "regex";
        
        capture.addRegexGroupAndCapture(input, ScopeEnum.Empty);
        capture.addRegexGroupAndCapture(null, ScopeEnum.Empty);
        var actual = capture.$match;
        var expected = "(regex)";

        expect(actual).toEqual(expected);
    });
    
    test("getRegex with two words, expect match", () => {
        var expected = true;

        capture.addRegexGroupAndCapture("Test", ScopeEnum.Empty);
        capture.addRegexGroupAndCapture("Test", ScopeEnum.Empty);
        var actual = new RegExp(capture.$match!).test("Test Test");

        expect(actual).toEqual(expected);
    });

    test("getRegex with two words, expect no match", () => {
        var expected = false;

        capture.addRegexGroupAndCapture("Test", ScopeEnum.Empty);
        capture.addRegexGroupAndCapture("Test", ScopeEnum.Empty);
        var actual = new RegExp(capture.$match!).test("Test aTest");

        expect(actual).toEqual(expected);
    });

    test("buildPattern with match and captures, expect 2 captures", () => {
        var expected = {
            "2": { name: ScopeEnum.Keyword}
        };

        capture.addRegexGroupAndCapture("Test", ScopeEnum.Empty);
        capture.addRegexGroupAndCapture("Test", ScopeEnum.Keyword);
        var actual = capture.buildPattern();

        expect(actual!.captures).toEqual(expected);
    });
});