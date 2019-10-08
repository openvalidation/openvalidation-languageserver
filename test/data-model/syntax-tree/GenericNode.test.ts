import "jest";
import { OperandNode } from "../../../src/data-model/syntax-tree/element/operation/operand/OperandNode";
import { GenericNode } from "../../../src/data-model/syntax-tree/GenericNode";
import { IndexRange } from "../../../src/data-model/syntax-tree/IndexRange";
import { TestInitializer } from "../../Testinitializer";

describe("GenericNode Tests", () => {
    var initializer: TestInitializer;

    beforeEach(() => {
        initializer = new TestInitializer(true);
    });

    test("GenericNode getter/setter test", () => {
        var operandNode = new OperandNode([], IndexRange.create(0, 0, 0, 0), "", "");

        var expectedLines: string[] = ["Hello"];
        operandNode.$lines = expectedLines;
        var expectedRange: IndexRange = IndexRange.create(10, 10, 10, 10);
        operandNode.$range = expectedRange;

        expect(operandNode.$lines).toEqual(expectedLines);
        expect(operandNode.$range).toEqual(expectedRange);
    });

    test("formatCode with good formatted OperandNode, expect no edit", () => {
        var node: GenericNode = new OperandNode(["Test"], IndexRange.create(0, 0, 0, 4), "String", "Test");

        var expected: string = "Test";
        var actual: string = node.formatCode(initializer.server.aliasHelper)[0].newText;

        expect(actual).toEqual(expected);
    });

    test("formatCode with bad formatted OperandNode, expect no edit", () => {
        var node: GenericNode = new OperandNode(["   Test"], IndexRange.create(0, 0, 0, 4), "String", "Test");

        var expected: string = " Test";
        var actual: string = node.formatCode(initializer.server.aliasHelper)[0].newText;

        expect(actual).not.toEqual(expected);
    });
});