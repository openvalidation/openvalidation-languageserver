import "jest";
import { LanguageEnum } from "../../src/enums/LanguageEnum";
import { LanguageHelper } from "../../src/helper/LanguageHelper";

describe("OvStringHelper.convertOvLanguageToMonacoLanguage Tests", () => {
    test("Insert Node, expected JavaScript", () => {
        var expected = "JavaScript";
        var input = LanguageEnum.Node;

        var actual = LanguageHelper.convertOvLanguageToMonacoLanguage(input);

        expect(actual).toEqual(expected);
    });

    test("Insert Java, expected Java", () => {
        var expected = "Java";
        var input = LanguageEnum.Java;

        var actual = LanguageHelper.convertOvLanguageToMonacoLanguage(input);

        expect(actual).toEqual(expected);
    });
});