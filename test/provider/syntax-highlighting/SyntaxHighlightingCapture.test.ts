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

    test("addRegexToMatch with empty regex, expect the same as before", () => {
        var expected = "regex";
        
        capture.addRegexToMatch(expected);
        capture.addRegexToMatch(null);
        var actual = capture.$match;

        expect(actual).toEqual(expected);
    });


    test("buildPattern without captures, expect null", () => {
        var expected = null;

        capture.addRegexToMatch("Test");
        var actual = capture.buildPattern();

        expect(actual).toEqual(expected);
    });

    test("getRegex with two words, expect match", () => {
        var expected = true;

        capture.addRegexToMatch("Test");
        capture.addRegexToMatch("Test");
        var actual = new RegExp(capture.$match!).test("Test Test");

        expect(actual).toEqual(expected);
    });

    test("getRegex with two words, expect no match", () => {
        var expected = false;

        capture.addRegexToMatch("Test");
        capture.addRegexToMatch("Test");
        var actual = new RegExp(capture.$match!).test("Test aTest");

        expect(actual).toEqual(expected);
    });

    test("buildPattern with match and captures, expect 2 captures", () => {
        var expected = {
            "2": { name: ScopeEnum.Keyword}
        };

        capture.addRegexToMatch("Test");
        capture.addRegexToMatch("Test");
        capture.addCapture(ScopeEnum.Empty);
        capture.addCapture(ScopeEnum.Keyword);
        var actual = capture.buildPattern();

        expect(actual!.captures).toEqual(expected);
    });
});