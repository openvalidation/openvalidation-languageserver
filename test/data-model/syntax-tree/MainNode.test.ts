import "jest"
import { MainNode } from "../../../src/data-model/syntax-tree/MainNode";
import { IndexRange } from "../../../src/data-model/syntax-tree/IndexRange";
import { Variable } from "../../../src/data-model/syntax-tree/Variable";
import { OperandNode } from "../../../src/data-model/syntax-tree/element/operation/operand/OperandNode";

describe("MainNode Tests", () => {
    beforeEach(() => {
    });

    test("MainNode getter/setter Tests", () => {
        var mainNode = new MainNode(IndexRange.create(0, 0, 0, 0));

        var expectedDeclarations = [new Variable("Test", "String")];
        mainNode.$declarations = expectedDeclarations;

        var expectedScopes = [new OperandNode([], IndexRange.create(0, 0, 0, 0), "", "")];
        mainNode.$scopes = expectedScopes;

        var expectedRange = IndexRange.create(10, 10, 10, 10);
        mainNode.$range = expectedRange;

        expect(mainNode.$declarations).toEqual(expectedDeclarations);
        expect(mainNode.$scopes).toEqual(expectedScopes);
        expect(mainNode.$range).toEqual(expectedRange);
    })
});