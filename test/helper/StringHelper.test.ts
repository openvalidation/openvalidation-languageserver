import "jest";
import { StringHelper } from "../../src/helper/StringHelper";

describe("OvStringHelper Tests", () => {
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
});
