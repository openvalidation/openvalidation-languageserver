import "jest";
import { MarkDownContentBuilder } from "../../../src/helper/markdown/MarkDownContentBuilder";

describe("Jest Tests", () => {

    var markDownBuilder: MarkDownContentBuilder;

    beforeEach(() => {
        markDownBuilder = new MarkDownContentBuilder("Header");
    });

    test("Check if header exists", () => {
        var expected = "**Header** ";
        var actual = markDownBuilder.build();

        expect(actual).toEqual(expected);
    });

    test("addSimpleLineContent, expected content to appear", () => {
        var input = "newContent";
        markDownBuilder.addSimpleLineContent(input);

        var expected = "**Header** \nnewContent";
        var actual = markDownBuilder.build();

        expect(actual).toEqual(expected);
    });


    test("addMultiLineContent, expected content to appear", () => {
        var input = "newContent";
        markDownBuilder.addMultiLineContent([input, input, input]);

        var expected = "**Header** \nnewContent\nnewContent\nnewContent";
        var actual = markDownBuilder.build();

        expect(actual).toEqual(expected);
    });
})