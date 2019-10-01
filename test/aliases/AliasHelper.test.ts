import "jest";
import { AliasHelper } from "../../src/aliases/AliasHelper";
import { AliasKey } from "../../src/aliases/AliasKey";

describe("AliasHelper Tests", () => {
    var aliasHelper: AliasHelper;

    function setDefaultAliases() {
        var input = new Map<string, string>();
        input.set("AND", AliasKey.AND);
        input.set("OR", AliasKey.OR);
        input.set("AS", AliasKey.AS);
        input.set("COMMENT", AliasKey.COMMENT);
        input.set("THEN", AliasKey.THEN);
        input.set("IF", AliasKey.IF);
        aliasHelper.$aliases = input;
    }

    beforeEach(() => {
        aliasHelper = new AliasHelper();
    });

    test("getKeywordByAliasKey with invalid key, expect null", () => {
        setDefaultAliases();

        var expected: string | null = null;

        var input: AliasKey = AliasKey.SUMME_VON;
        var actual: string | null = aliasHelper.getKeywordByAliasKey(input);

        expect(actual).toEqual(expected);
    });

    test("getKeywordByAliasKey with valid key, expect value", () => {
        setDefaultAliases();

        var expected: string | null = "AND";

        var input: AliasKey = AliasKey.AND;
        var actual: string | null = aliasHelper.getKeywordByAliasKey(input);

        expect(actual).toEqual(expected);
    });

    test("getKeywordByAliasKey with valid key, expect value", () => {
        setDefaultAliases();

        var expected: string | null = "AND";

        var input: AliasKey = AliasKey.AND;
        var actual: string | null = aliasHelper.getKeywordByAliasKey(input);

        expect(actual).toEqual(expected);
    });

    test("getKeywordByAliasKey with valid key, expect value", () => {
        setDefaultAliases();

        var expected: string[] = ["AND", "COMMENT"];
        var actual: string[] = aliasHelper.getKeywordsByAliasKeys(AliasKey.AND, AliasKey.COMMENT);

        expect(actual).toEqual(expected);
    });


    test("getKeywordByAliasKey with one valid and one invalid key, expect one found value", () => {
        setDefaultAliases();

        var expected: string[] = ["AND"];
        var actual: string[] = aliasHelper.getKeywordsByAliasKeys(AliasKey.AND, AliasKey.SUMME_VON);

        expect(actual).toEqual(expected);
    });

    test("getLogicalOperators with default aliases, expect both operators", () => {
        setDefaultAliases();

        var expected: string[] = ["OR", "AND"];
        var actual: string[] = aliasHelper.getLogicalOperators();

        expect(actual).toEqual(expected);
    });

    test("isLinkingOperator with default aliases, expect comment keyword", () => {
        setDefaultAliases();

        var expected: string = "COMMENT";
        var actual: string | null = aliasHelper.getCommentKeyword();

        expect(actual).toEqual(expected);
    });
})