import { KeywordNode } from "../../../src/data-model/syntax-tree/KeywordNode";
import { IndexRange } from "../../../src/data-model/syntax-tree/IndexRange";

describe("KeywordNode Tests", () => {
  beforeEach(() => {});

  test("KeywordNode getter/setter Tests", () => {
    const expectedLines = ["WENN"];
    const expectedRange = IndexRange.create(0, 0, 0, 4);

    const keywordNode = new KeywordNode([], IndexRange.create(0, 0, 0, 0));
    keywordNode.$lines = expectedLines;
    keywordNode.$range = expectedRange;

    expect(keywordNode.$lines).toEqual(expectedLines);
    expect(keywordNode.$range).toEqual(expectedRange);
  });
});
