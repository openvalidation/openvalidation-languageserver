import "jest";
import { FormattingHelper } from "./../../src/helper/FormattingHelper";

describe("FormattingHelper.removeDuplicateWhitespaceFromLine Tests", () => {
  test("insert empty string, expected empty string", () => {
    const expected: string = "";

    const input: string = "";
    const actual: string = FormattingHelper.removeDuplicateWhitespaceFromLine(
      input
    );

    expect(actual).toEqual(expected);
  });

  test("insert no whitespace, expect no change", () => {
    const expected: string = "thisIsATest";

    const input: string = "thisIsATest";
    const actual: string = FormattingHelper.removeDuplicateWhitespaceFromLine(
      input
    );

    expect(actual).toEqual(expected);
  });

  test("insert string with multiple whitespaces and tabs, expect them to get removed", () => {
    const expected: string = "this is a test";

    const input: string = "this \t is     a    \t   test ";
    const actual: string = FormattingHelper.removeDuplicateWhitespaceFromLine(
      input
    );

    expect(actual).toEqual(expected);
  });
});

describe("FormattingHelper.generateSpaces Tests", () => {
  test("0 spaces, expected empty string", () => {
    const expected: string = "";

    const input: number = 0;
    const actual: string = FormattingHelper.generateSpaces(input);

    expect(actual).toEqual(expected);
  });

  test("insert 5, expect a string with 5 spaces", () => {
    const expected: string = "     ";

    const input: number = 5;
    const actual: string = FormattingHelper.generateSpaces(input);

    expect(actual).toEqual(expected);
  });
});
