import "jest";
import { AstKey } from "../../src/data-model/AstKeyEnum";
import { OvStringHelper } from "../../src/helper/OvStringHelper";
import { Language } from "../../src/rest-interface/ParsingEnums";


describe("OvStringHelper.getTypeFromAstType Tests", () => {
    test("Insert Rule, expect Rule", () => {
        var expected = "Rule";
        var input = AstKey.Rule;

        var actual = OvStringHelper.getTypeFromAstType(input);

        expect(actual).toEqual(expected);
    });

    test("Insert Variable, expect Variable", () => {
        var expected = "Variable";
        var input = AstKey.Variable;

        var actual = OvStringHelper.getTypeFromAstType(input);

        expect(actual).toEqual(expected);
    });

    test("Insert Comment, expect Comment", () => {
        var expected = "Comment";
        var input = AstKey.Comment;

        var actual = OvStringHelper.getTypeFromAstType(input);

        expect(actual).toEqual(expected);
    });

    test("Insert Unknown, expect Unknown", () => {
        var expected = "Unknown";
        var input = AstKey.Unknown;

        var actual = OvStringHelper.getTypeFromAstType(input);

        expect(actual).toEqual(expected);
    });

    test("Insert invalid string, expect same string", () => {
        var expected = "something";
        var input = "something";

        var actual = OvStringHelper.getTypeFromAstType(input);

        expect(actual).toEqual(expected);
    });
});

describe("OvStringHelper.convertOvLanguageToMonacoLanguage Tests", () => {
    test("Insert Node, expected JavaScript", () => {
        var expected = "JavaScript";
        var input = Language.Node;

        var actual = OvStringHelper.convertOvLanguageToMonacoLanguage(input);

        expect(actual).toEqual(expected);
    });

    test("Insert Java, expected Java", () => {
        var expected = "Java";
        var input = Language.Java;

        var actual = OvStringHelper.convertOvLanguageToMonacoLanguage(input);

        expect(actual).toEqual(expected);
    });
});