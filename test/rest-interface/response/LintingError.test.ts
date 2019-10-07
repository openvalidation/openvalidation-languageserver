import { plainToClass } from "class-transformer";
import "jest";
import { LintingError } from "../../../src/rest-interface/response/LintingError";
import { IndexRange } from "../../../src/data-model/syntax-tree/IndexRange";

describe("Dummy Tests", () => {
    test("check type of an LintingError, expect LintingError", async () => {
        var actualMessage: string = "Error";
        var actualRange: IndexRange = IndexRange.create(0, 5, 0, 30);

        var lintingError = {
            "message": actualMessage,
            "range": {
                "start": {
                    "line": 0,
                    "column": 5
                },
                "end": {
                    "line": 0,
                    "column": 30
                }
            },
        }
        var actual = plainToClass(LintingError, lintingError);
        var expectedType = LintingError;

        expect(actual).toBeInstanceOf(expectedType);
        expect(actual.$message).toEqual(actualMessage);
        expect(actual.$range).toEqual(actualRange);
    });
});