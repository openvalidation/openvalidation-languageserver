import { plainToClass } from "class-transformer";
import "jest";
import { IndexRange } from "../../../src/data-model/syntax-tree/IndexRange";
import { LintingError } from "../../../src/rest-interface/response/LintingError";

describe("Dummy Tests", () => {
  test("check type of an LintingError, expect LintingError", async () => {
    const actualMessage: string = "Error";
    const actualRange: IndexRange = IndexRange.create(0, 5, 0, 30);

    const lintingError = {
      message: actualMessage,
      range: {
        start: {
          line: 0,
          column: 5
        },
        end: {
          line: 0,
          column: 30
        }
      }
    };
    const actual = plainToClass(LintingError, lintingError);
    const expectedType = LintingError;

    expect(actual).toBeInstanceOf(expectedType);
    expect(actual.$message).toEqual(actualMessage);
    expect(actual.$range).toEqual(actualRange);
  });
});
