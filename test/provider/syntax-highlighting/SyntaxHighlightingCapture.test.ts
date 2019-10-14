import "jest";
import { ScopeEnum } from "../../../src/enums/ScopeEnum";
import { SyntaxHighlightingCapture } from "../../../src/provider/syntax-highlighting/SyntaxHighlightingCapture";

describe("SyntaxHighlightingCapture tests", () => {
  let capture: SyntaxHighlightingCapture;

  beforeEach(() => {
    capture = new SyntaxHighlightingCapture();
  });

  test("test getter/setter of capture", () => {
    const expected = [
      ScopeEnum.Empty,
      ScopeEnum.Comment,
      ScopeEnum.StaticString
    ];

    capture.$capture = expected;
    const actual = expected;

    expect(actual).toEqual(expected);
  });

  test("test getter/setter of match", () => {
    const expected = "Test";

    capture.$match = expected;
    const actual = expected;

    expect(actual).toEqual(expected);
  });

  test("buildPattern with empty capture, expect null", () => {
    const expected = null;
    const actual = capture.buildPattern();

    expect(actual).toEqual(expected);
  });

  test("addRegexGroupAndCapture with empty regex, expect group of previous string", () => {
    const input = "regex";

    capture.addRegexGroupAndCapture(input, ScopeEnum.Empty);
    capture.addRegexGroupAndCapture(null, ScopeEnum.Empty);
    const actual = capture.$match;
    const expected = "(regex)";

    expect(actual).toEqual(expected);
  });

  test("addRegexToMatch with empty regex, expect match to be not set", () => {
    const input = "";

    capture["addRegexToMatch"](input);
    const actual = capture.$match;
    const expected = null;

    expect(actual).toEqual(expected);
  });

  test("getRegex with two words, expect match", () => {
    const expected = true;

    capture.addRegexGroupAndCapture("Test", ScopeEnum.Empty);
    capture.addRegexGroupAndCapture("Test", ScopeEnum.Empty);
    const actual = new RegExp(capture.$match!).test("Test Test");

    expect(actual).toEqual(expected);
  });

  test("getRegex with two words, expect no match", () => {
    const expected = false;

    capture.addRegexGroupAndCapture("Test", ScopeEnum.Empty);
    capture.addRegexGroupAndCapture("Test", ScopeEnum.Empty);
    const actual = new RegExp(capture.$match!).test("Test aTest");

    expect(actual).toEqual(expected);
  });

  test("buildPattern with match and captures, expect 2 captures", () => {
    const expected = {
      2: { name: ScopeEnum.Keyword }
    };

    capture.addRegexGroupAndCapture("Test", ScopeEnum.Empty);
    capture.addRegexGroupAndCapture("Test", ScopeEnum.Keyword);
    const actual = capture.buildPattern();

    expect(actual!.captures).toEqual(expected);
  });
});
