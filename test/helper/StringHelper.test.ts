import "jest";
import { StringHelper } from "../../src/helper/StringHelper";

describe("OvStringHelper.getOredRegEx Tests", () => {
    test("Pass a empty list, expect empty string", () => {
        var input: string[] = [];

        var expected = "";
        var actual = StringHelper.getOredRegEx(input);

        expect(actual).toEqual(expected);
    });
    
    test("Pass a list of strings, expected an ored RegEx of them", () => {
        var input: string[] = ["Alter", "Preis", "Name"];

        var expected = "Alter|Preis|Name";
        var actual = StringHelper.getOredRegEx(input);

        expect(actual).toEqual(expected);
    });

    test("Pass list with duplicated strings, expected to have every String only once in RegExp", () => {
        var input = ["Alter", "Preis", "Alter"];

        var expected = "Alter|Preis";
        var actual = StringHelper.getOredRegEx(input);

        expect(actual).toEqual(expected);
    });
});

describe("OvStringHelper.getWordAt Tests", () => {
    test("pass empty string and invalid index, expect empty string", () => {
        var inputString: string = "";
        var inputIndex: number = 5;

        var expected = "";
        var actual = StringHelper.getWordAt(inputString, inputIndex);

        expect(actual).toEqual(expected);
    });

    test("pass valid string and invalid index, expect last word", () => {
        var inputString: string = "some words";
        var inputIndex: number = 50;

        var expected = "words";
        var actual = StringHelper.getWordAt(inputString, inputIndex);

        expect(actual).toEqual(expected);
    });

    
    test("pass valid string and valid index, expect wanted word", () => {
        var inputString: string = "some words are here";
        var inputIndex: number = 13;

        var expected = "are";
        var actual = StringHelper.getWordAt(inputString, inputIndex);

        expect(actual).toEqual(expected);
    });
});