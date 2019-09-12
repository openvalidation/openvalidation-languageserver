import "jest";
import { FormattingHelper } from "./../../src/helper/FormattingHelper";

describe("FormattingHelper.removeDuplicateWhitespacesFromLine Tests", () => {
    test("insert empty string, expected empty string", () => {
        var expected: string = ""

        var input: string = "";
        var actual: string = FormattingHelper.removeDuplicateWhitespacesFromLine(input);

        expect(actual).toEqual(expected);
    });

    test("insert no whitespace, expect no change", () => {
        var expected: string = "thisIsATest";

        var input: string = "thisIsATest";
        var actual: string = FormattingHelper.removeDuplicateWhitespacesFromLine(input);

        expect(actual).toEqual(expected);
    });

    test("insert string with multiple whitespaces and tabs, expect them to get removed", () => {
        var expected: string = "this is a test";

        var input: string = "this \t is     a    \t   test ";
        var actual: string = FormattingHelper.removeDuplicateWhitespacesFromLine(input);

        expect(actual).toEqual(expected);
    });
});

describe("FormattingHelper.generateSpaces Tests", () => {
    test("0 spaces, expected empty string", () => {
        var expected: string = ""

        var input: number = 0;
        var actual: string = FormattingHelper.generateSpaces(input);

        expect(actual).toEqual(expected);
    });

    test("insert 5, expect a string with 5 spaces", () => {
        var expected: string = "     ";

        var input: number = 5;
        var actual: string = FormattingHelper.generateSpaces(input);

        expect(actual).toEqual(expected);
    });
});