import "jest";
import { StringHelper } from "../../src/helper/StringHelper";

describe("OvStringHelper Tests", () => {
  test("getOredRegEx with a empty list, expect empty string", () => {
    const input: string[] = [];

    const expected = "";
    const actual = StringHelper.getOredRegExForWords(...input);

    expect(actual).toEqual(expected);
  });

  test("getOredRegEx with a list of strings, expected an ored RegEx of them", () => {
    const input: string[] = ["Alter", "Preis", "Name"];

    const expected = "\\bAlter\\b|\\bPreis\\b|\\bName\\b";
    const actual = StringHelper.getOredRegExForWords(...input);

    expect(actual).toEqual(expected);
  });

  test("getOredRegEx with list with duplicated strings, expected to have every String only once in RegExp", () => {
    const input = ["Alter", "Preis", "Alter"];

    const expected = "\\bAlter\\b|\\bPreis\\b";
    const actual = StringHelper.getOredRegExForWords(...input);

    expect(actual).toEqual(expected);
  });

  test("getWordAt with empty string and invalid index, expect empty string", () => {
    const inputString: string = "";
    const inputIndex: number = 5;

    const expected = "";
    const actual = StringHelper.getWordAt(inputString, inputIndex);

    expect(actual).toEqual(expected);
  });

  test("getWordAt with valid string and invalid index, expect last word", () => {
    const inputString: string = "some words";
    const inputIndex: number = 50;

    const expected = "words";
    const actual = StringHelper.getWordAt(inputString, inputIndex);

    expect(actual).toEqual(expected);
  });

  test("getWordAt with valid string and valid index, expect wanted word", () => {
    const inputString: string = "some words are here";
    const inputIndex: number = 13;

    const expected = "are";
    const actual = StringHelper.getWordAt(inputString, inputIndex);

    expect(actual).toEqual(expected);
  });

  test("makeStringRegExSafe with empty string, expect same string", () => {
    const inputString: string = "";

    const expected = "";
    const actual = StringHelper.makeStringRegExSafe(inputString);

    expect(actual).toEqual(expected);
  });

  test("makeStringRegExSafe with safe string, expect same string", () => {
    const inputString: string = "safe string";

    const expected = "safe string";
    const actual = StringHelper.makeStringRegExSafe(inputString);

    expect(actual).toEqual(expected);
  });

  test("makeStringRegExSafe with unsafe string, expect safe string", () => {
    const inputString: string = "(un*-)safe string";

    const expected = "\\(un\\*-\\)safe string";
    const actual = StringHelper.makeStringRegExSafe(inputString);

    expect(actual).toEqual(expected);
  });
});
