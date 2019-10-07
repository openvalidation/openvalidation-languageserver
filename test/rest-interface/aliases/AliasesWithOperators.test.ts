import { plainToClass } from "class-transformer";
import "jest";
import { AliasesWithOperators } from "../../../src/rest-interface/aliases/AliasesWithOperators";

describe("AliasesWithOperators Tests", () => {
    test("check type of an AliasesWithOperators, expect AliasesWithOperators", async () => {
        var actual = plainToClass(AliasesWithOperators, aliasesWithOperatorsJson());
        var expectedType = AliasesWithOperators;

        expect(actual).toBeInstanceOf(expectedType);
        expect(actual.$aliases).toBeInstanceOf(Map);
        expect(actual.$operators).toBeInstanceOf(Map);
    });


    function aliasesWithOperatorsJson() {
        return {
            "aliases": {
                "HÖHER ALS": "ʬoperatorʬgreater_than",
                "GEGEBEN": "ʬoperatorʬexists",
                "MINUS": "ʬarithmoperatorʬsubtract",
            },
            "operators": {
                "AT_LEAST_ONE_OF": "Array",
                "IS_BETWEEN": "Unknown",
                "EXISTS": "Array",
            }
        };
    }
});