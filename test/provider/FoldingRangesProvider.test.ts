import "jest";
import { FoldingRange, FoldingRangeRequestParam } from "vscode-languageserver";
import { FoldingRangesProvider } from "../../src/provider/FoldingRangesProvider";
import { TestInitializer } from "../TestInitializer";

describe("FoldingRanges provider test", () => {
  let provider: FoldingRangesProvider;
  let testInitializer: TestInitializer;

  beforeEach(() => {
    testInitializer = new TestInitializer(true);
    provider = testInitializer.foldingRangesProvider;
  });

  function getEmptyParams(): FoldingRangeRequestParam {
    return {
      textDocument: {
        uri: "test.ov"
      }
    };
  }

  test("Verify provider exists", () => {
    expect(provider).not.toBeNull();
  });

  test("getFoldingRanges with empty document, expect empty array", () => {
    const tmpTestInitializer = new TestInitializer(false);
    const tmpProvider = tmpTestInitializer.foldingRangesProvider;

    const expected: FoldingRange[] = [];
    const actual = tmpProvider.getFoldingRanges(getEmptyParams());

    expect(actual).toEqual(expected);
  });

  test("getFoldingRanges with wrong uri, expected empty list", () => {
    const expected: FoldingRange[] = [];

    const input = {
      textDocument: {
        uri: "wrongUri"
      }
    };
    const actual = provider.getFoldingRanges(input);

    expect(actual).toEqual(expected);
  });

  test("getFoldingRangesByText with wrong uri, expected not empty list", () => {
    const expected: FoldingRange[] = [
      FoldingRange.create(0, 0, undefined, undefined, "region")
    ];

    const input: string = `Kommentar das ist ein Test`;
    const actual = provider.getFoldingRangesByText(input);

    expect(actual).toEqual(expected);
  });

  test("getFoldingRangesByText with wrong uri, expected not empty list", () => {
    var expected: FoldingRange[] = [
      FoldingRange.create(0, 1, undefined, undefined, "region")
    ];

    var input: string = "Kommentar das ist ein Test\nBla bla";
    var actual = provider["getFoldingRangesByText"](input);

    expect(actual).toEqual(expected);
  });

  test("getFoldingRangesByText with wrong uri, expected not empty list", () => {
    var expected: FoldingRange[] = [
      FoldingRange.create(0, 1, undefined, undefined, "region"),
      FoldingRange.create(3, 4, undefined, undefined, "region")
    ];

    var input: string =
      "Kommentar das ist ein Test\nHier gehts weiter\n\nAlter kleiner 30\n Dann dwadwad";
    var actual = provider["getFoldingRangesByText"](input);

    expect(actual).toEqual(expected);
  });
});
