import "jest";
import { Pattern } from "ov-language-server-types";
import { TextMateParameter } from "../../../src/provider/syntax-highlighting/TextMateParameter";
import { TestInitializer } from "../../Testinitializer";
import { LintingResponse } from "../../../src/rest-interface/response/LintingResponse";
import { OperandNode } from "../../../src/data-model/syntax-tree/element/operation/operand/OperandNode";
import { IndexRange } from "../../../src/data-model/syntax-tree/IndexRange";
import { OperationNode } from "../../../src/data-model/syntax-tree/element/operation/OperationNode";

describe("TextMateParameter Tests", () => {
  let testInitializer: TestInitializer;

  beforeEach(() => {
    testInitializer = new TestInitializer(true);
  });

  test("getIdentifier with empty response, expect no identifier", () => {
    const parameter = new TextMateParameter(
      testInitializer.mockEmptyLintingResponse(),
      testInitializer.$server
    );

    const actual: string[] = parameter["getIdentifier"]();
    const expected: string[] = [];

    expect(actual).toEqual(expected);
  });

  test("getIdentifier with not empty response, expect one identifier", () => {
    const parameter = new TextMateParameter(
      testInitializer.mockNotEmptyLintingResponse(),
      testInitializer.$server
    );

    const actualLength = parameter["getIdentifier"]().length;
    const expectedLength = 1;

    expect(actualLength).toEqual(expectedLength);
  });

  test("getOperationAndOperandPatterns with not empty response but no as-keyword", () => {
    const parameter = new TextMateParameter(
      testInitializer.mockNotEmptyLintingResponse(),
      testInitializer.$server
    );

    const actual: Pattern[] = parameter.getOperationAndOperandPatterns(null);
    const expected: Pattern[] = [];

    expect(actual).not.toEqual(expected);
  });

  test("getOperationAndOperandPatterns with not empty response with as-keyword, expect list of pattern", () => {
    const parameter = new TextMateParameter(
      testInitializer.mockNotEmptyLintingResponse(),
      testInitializer.$server
    );

    const actual: Pattern[] = parameter.getOperationAndOperandPatterns("AS");
    const expected: Pattern[] = [];

    expect(actual).not.toEqual(expected);
  });

  test("getOperationAndOperandPatterns with not empty response with as-keyword and additional empty operand, expect list of pattern", () => {
    const lintingResponse: LintingResponse = testInitializer.mockNotEmptyLintingResponse();
    lintingResponse.$mainAstNode.$scopes = lintingResponse.$mainAstNode.$scopes.concat(
      new OperandNode([], IndexRange.create(0, 0, 0, 0), "", "")
    );

    const parameter = new TextMateParameter(
      lintingResponse,
      testInitializer.$server
    );

    const actual: Pattern[] = parameter.getOperationAndOperandPatterns("AS");
    const expected: Pattern[] = [];

    expect(actual).not.toEqual(expected);
  });

  test("getOperationAndOperandPatterns with not empty response with as-keyword and additional empty operation, expect list of pattern", () => {
    const lintingResponse: LintingResponse = testInitializer.mockNotEmptyLintingResponse();
    lintingResponse.$mainAstNode.$scopes = lintingResponse.$mainAstNode.$scopes.concat(
      new OperationNode(null, null, null, [], IndexRange.create(0, 0, 0, 0))
    );

    const parameter = new TextMateParameter(
      lintingResponse,
      testInitializer.$server
    );

    const actual: Pattern[] = parameter.getOperationAndOperandPatterns("AS");
    const expected: Pattern[] = [];

    expect(actual).not.toEqual(expected);
  });
});
