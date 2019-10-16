import "jest";
import { IndexRange } from "../../src/data-model/syntax-tree/IndexRange";
import { HoverContent } from "../../src/helper/HoverContent";

describe("HoverContent Tests", () => {
  test("HoverContent getter/setter test", () => {
    const position: HoverContent = new HoverContent(
      IndexRange.create(0, 0, 0, 0),
      "Test"
    );
    position.$content = "Hovering-Message";
    position.$range = IndexRange.create(0, 0, 0, 10);

    expect(position.$content).toEqual("Hovering-Message");
    expect(position.$range).toEqual(IndexRange.create(0, 0, 0, 10));
  });
});
