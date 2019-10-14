import "jest";
import { Pattern } from "../../../src/provider/syntax-highlighting/TextMateJson";
import { TextMateParameter } from "../../../src/provider/syntax-highlighting/TextMateParameter";
import { TestInitializer } from "../../Testinitializer";

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

  test("getOperationAndOperandPatterns with not empty response with as-keyword", () => {
    const parameter = new TextMateParameter(
      testInitializer.mockNotEmptyLintingResponse(),
      testInitializer.$server
    );

    const actual: Pattern[] = parameter.getOperationAndOperandPatterns("AS");
    const expected: Pattern[] = [];

    expect(actual).not.toEqual(expected);
  });
});
