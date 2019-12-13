import "jest";
import { AliasHelper } from "../../src/aliases/AliasHelper";
import { AliasKey } from "../../src/aliases/AliasKey";

describe("AliasHelper Tests", () => {
  let aliasHelper: AliasHelper;

  function setDefaultAliases() {
    const input = new Map<string, string>();
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

    const operatorInput = new Map<string, string>();
    operatorInput.set("EQUALS", "Object");
    aliasHelper.$operators = operatorInput;
  }

  beforeEach(() => {
    aliasHelper = new AliasHelper();
  });

  test("AliasHelper getter/setter test", () => {
    setDefaultAliases();

    const operators = new Map<string, string>();
    aliasHelper.$operators = operators;

    expect(aliasHelper.$operators).toEqual(operators);
  });

  test("getKeywordByAliasKey with invalid key, expect null", () => {
    setDefaultAliases();

    const expected: string | null = null;

    const input: AliasKey = AliasKey.CONSTRAINT;
    const actual: string | null = aliasHelper.getKeywordByAliasKey(input);

    expect(actual).toEqual(expected);
  });

  test("getKeywordByAliasKey with valid key, expect value", () => {
    setDefaultAliases();

    const expected: string | null = "AND";

    const input: AliasKey = AliasKey.AND;
    const actual: string | null = aliasHelper.getKeywordByAliasKey(input);

    expect(actual).toEqual(expected);
  });

  test("getKeywordByAliasKey with valid key, expect value", () => {
    setDefaultAliases();

    const expected: string | null = "AND";

    const input: AliasKey = AliasKey.AND;
    const actual: string | null = aliasHelper.getKeywordByAliasKey(input);

    expect(actual).toEqual(expected);
  });

  test("getKeywordByAliasKey with valid key, expect value", () => {
    setDefaultAliases();

    const expected: string[] = ["AND", "COMMENT"];
    const actual: string[] = aliasHelper.getKeywordsByAliasKeys(
      AliasKey.AND,
      AliasKey.COMMENT
    );

    expect(actual).toEqual(expected);
  });

  test("getKeywordByAliasKey with one valid and one invalid key, expect one found value", () => {
    setDefaultAliases();

    const expected: string[] = ["AND"];
    const actual: string[] = aliasHelper.getKeywordsByAliasKeys(
      AliasKey.AND,
      AliasKey.CONSTRAINT
    );

    expect(actual).toEqual(expected);
  });

  test("getLogicalOperators with default aliases, expect both operators", () => {
    setDefaultAliases();

    const expected: string[] = ["OR", "AND"];
    const actual: string[] = aliasHelper.getLogicalOperators();

    expect(actual).toEqual(expected);
  });

  test("getCommentKeyword with default aliases, expect comment keyword", () => {
    setDefaultAliases();

    const expected: string = "COMMENT";
    const actual: string | null = aliasHelper.getCommentKeyword();

    expect(actual).toEqual(expected);
  });

  test("getFunctions with default aliases, expect comment keyword", () => {
    setDefaultAliases();

    const expected: string[] = ["SUM OF"];
    const actual: string[] = aliasHelper.getFunctions();

    expect(actual).toEqual(expected);
  });

  test("getLengthOfLongestLogicalOperator with default aliases, expect comment keyword", () => {
    setDefaultAliases();

    const expected: number = 4;
    const actual: number = aliasHelper.getLengthOfLongestLogicalOperator();

    expect(actual).toEqual(expected);
  });

  test("getOperators, expect one operator", () => {
    setDefaultAliases();

    const expected: number = 1;
    const actualMap: Map<string, [string, string]> = aliasHelper.getOperators();
    const actual: number = actualMap.size;

    expect(actual).toEqual(expected);
  });

  test("getOperators with two operators with the same key, expect both operators", () => {
    setDefaultAliases();

    const expected: number = 2;
    aliasHelper.$aliases = aliasHelper.$aliases.set(
      "Equals2",
      "ʬoperatorʬequals"
    );
    const actualMap: Map<string, [string, string]> = aliasHelper.getOperators();
    const actual: number = actualMap.size;

    expect(actual).toEqual(expected);
  });

  test("getOperators starting with `Eq` with two operators with the same key, expect the matching operator", () => {
    setDefaultAliases();

    const expected: number = 1;
    aliasHelper.$aliases = aliasHelper.$aliases.set(
      "Equals2",
      "ʬoperatorʬequals"
    );
    const actualMap: Map<string, [string, string]> = aliasHelper.getOperators(
      "Eq"
    );
    const actual: number = actualMap.size;

    expect(actual).toEqual(expected);
  });

  test("getOperators starting with `Eq` with operator with unkown datatype, expect no operator", () => {
    setDefaultAliases();

    const expected: number = 0;
    aliasHelper.$aliases = aliasHelper.$aliases.set("Equals2", "invalid-key");
    const actualMap: Map<string, [string, string]> = aliasHelper.getOperators(
      "Eq"
    );
    const actual: number = actualMap.size;

    expect(actual).toEqual(expected);
  });
});
