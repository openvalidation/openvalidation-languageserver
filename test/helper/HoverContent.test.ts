import "jest"
import { HoverContent } from "../../src/helper/HoverContent";
import { IndexRange } from "../../src/data-model/syntax-tree/IndexRange";

describe("HoverContent Tests", () => {
    test("HoverContent getter/setter test", () => {
        var position: HoverContent = new HoverContent(IndexRange.create(0, 0, 0, 0), "Test");
        position.$content = "Hovering-Message";
        position.$range = IndexRange.create(0, 0, 0, 10);

        expect(position.$content).toEqual("Hovering-Message");
        expect(position.$range).toEqual(IndexRange.create(0, 0, 0, 10));
    });
});