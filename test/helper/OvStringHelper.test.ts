import "jest";
import { OvStringHelper } from "../../src/helper/OvStringHelper";
import { LanguageEnum } from "../../src/enums/LanguageEnum";

describe("OvStringHelper.convertOvLanguageToMonacoLanguage Tests", () => {
    test("Insert Node, expected JavaScript", () => {
        var expected = "JavaScript";
        var input = LanguageEnum.Node;

        var actual = OvStringHelper.convertOvLanguageToMonacoLanguage(input);

        expect(actual).toEqual(expected);
    });

    test("Insert Java, expected Java", () => {
        var expected = "Java";
        var input = LanguageEnum.Java;

        var actual = OvStringHelper.convertOvLanguageToMonacoLanguage(input);

        expect(actual).toEqual(expected);
    });
});