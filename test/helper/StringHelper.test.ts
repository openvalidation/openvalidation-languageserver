import "jest";
import { StringHelper } from "../../src/helper/StringHelper";

describe("OvStringHelper Tests", () => {
    test("getOredRegEx with a empty list, expect empty string", () => {
        var input: string[] = [];

        var expected = "";
        var actual = StringHelper.getOredRegExForWords(...input);

        expect(actual).toEqual(expected);
    });
    
    test("getOredRegEx with a list of strings, expected an ored RegEx of them", () => {
        var input: string[] = ["Alter", "Preis", "Name"];

        var expected = "\\bAlter\\b|\\bPreis\\b|\\bName\\b";
        var actual = StringHelper.getOredRegExForWords(...input);

        expect(actual).toEqual(expected);
    });

    test("getOredRegEx with list with duplicated strings, expected to have every String only once in RegExp", () => {
        var input = ["Alter", "Preis", "Alter"];

        var expected = "\\bAlter\\b|\\bPreis\\b";
        var actual = StringHelper.getOredRegExForWords(...input);

        expect(actual).toEqual(expected);
    });

    test("getWordAt with empty string and invalid index, expect empty string", () => {
        var inputString: string = "";
        var inputIndex: number = 5;

        var expected = "";
        var actual = StringHelper.getWordAt(inputString, inputIndex);

        expect(actual).toEqual(expected);
    });

    test("getWordAt with valid string and invalid index, expect last word", () => {
        var inputString: string = "some words";
        var inputIndex: number = 50;

        var expected = "words";
        var actual = StringHelper.getWordAt(inputString, inputIndex);

        expect(actual).toEqual(expected);
    });
    
    test("getWordAt with valid string and valid index, expect wanted word", () => {
        var inputString: string = "some words are here";
        var inputIndex: number = 13;

        var expected = "are";
        var actual = StringHelper.getWordAt(inputString, inputIndex);

        expect(actual).toEqual(expected);
    });

    test("makeStringRegExSafe with empty string, expect same string", () => {
        var inputString: string = "";

        var expected = "";
        var actual = StringHelper.makeStringRegExSafe(inputString);

        expect(actual).toEqual(expected);
    });

    test("makeStringRegExSafe with safe string, expect same string", () => {
        var inputString: string = "safe string";

        var expected = "safe string";
        var actual = StringHelper.makeStringRegExSafe(inputString);

        expect(actual).toEqual(expected);
    });

    test("makeStringRegExSafe with unsafe string, expect safe string", () => {
        var inputString: string = "(un*-)safe string";

        var expected = "\\(un\\*-\\)safe string";
        var actual = StringHelper.makeStringRegExSafe(inputString);

        expect(actual).toEqual(expected);
    });
});