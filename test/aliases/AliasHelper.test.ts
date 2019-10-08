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
        input.set("OF", AliasKey.OF);
        input.set("EQUALS", "ʬoperatorʬequals");
        input.set("SUM OF", AliasKey.SUM_OF);
        aliasHelper.$aliases = input;

        var operatorInput = new Map<string, string>();
        operatorInput.set("EQUALS", "Object");
        aliasHelper.$operators = operatorInput;
    }

    beforeEach(() => {
        aliasHelper = new AliasHelper();
    });

    test("AliasHelper getter/setter test", () => {
        setDefaultAliases();

        var operators = new Map<string, string>();
        aliasHelper.$operators = operators;

        expect(aliasHelper.$operators).toEqual(operators);
    });

    test("getKeywordByAliasKey with invalid key, expect null", () => {
        setDefaultAliases();

        var expected: string | null = null;

        var input: AliasKey = AliasKey.CONSTRAINT;
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

        var expected: string[] = ["AND" ];
        var actual: string[] = aliasHelper.getKeywordsByAliasKeys(AliasKey.AND, AliasKey.CONSTRAINT);

        expect(actual).toEqual(expected);
    });

    test("getLogicalOperators with default aliases, expect both operators", () => {
        setDefaultAliases();

        var expected: string[] = ["OR", "AND"];
        var actual: string[] = aliasHelper.getLogicalOperators();

        expect(actual).toEqual(expected);
    });

    test("getCommentKeyword with default aliases, expect comment keyword", () => {
        setDefaultAliases();

        var expected: string = "COMMENT";
        var actual: string | null = aliasHelper.getCommentKeyword();

        expect(actual).toEqual(expected);
    });

    test("getOfKeywords with default aliases, expect comment keyword", () => {
        setDefaultAliases();

        var expected: string[] = ["OF"];
        var actual: string[] = aliasHelper.getOfKeywords();

        expect(actual).toEqual(expected);
    });

    test("getFunctions with default aliases, expect comment keyword", () => {
        setDefaultAliases();

        var expected: string[] = ["SUM OF"];
        var actual: string[] = aliasHelper.getFunctions();

        expect(actual).toEqual(expected);
    });

    test("getLengthOfLongestLogicalOperator with default aliases, expect comment keyword", () => {
        setDefaultAliases();

        var expected: number = 4;
        var actual: number = aliasHelper.getLengthOfLongestLogicalOperator();

        expect(actual).toEqual(expected);
    });

    test("getOperators, expect one operator", () => {
        setDefaultAliases();

        var expected: number = 1;
        var actualMap: Map<string, [string, string]> = aliasHelper.getOperators();
        var actual: number = actualMap.size;

        expect(actual).toEqual(expected);
    });

    test("getOperators with two operators with the same key, expect both operators", () => {
        setDefaultAliases();

        var expected: number = 2;
        aliasHelper.$aliases = aliasHelper.$aliases.set("Equals2", "ʬoperatorʬequals");
        var actualMap: Map<string, [string, string]> = aliasHelper.getOperators();
        var actual: number = actualMap.size;

        expect(actual).toEqual(expected);
    });
})