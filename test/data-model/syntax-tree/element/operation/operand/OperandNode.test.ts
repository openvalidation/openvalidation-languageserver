import "jest";
import { Position } from "vscode-languageserver";
import { OperandNode } from "../../../../../../src/data-model/syntax-tree/element/operation/operand/OperandNode";
import { GenericNode } from "../../../../../../src/data-model/syntax-tree/GenericNode";
import { IndexRange } from "../../../../../../src/data-model/syntax-tree/IndexRange";
import { ScopeEnum } from "../../../../../../src/enums/ScopeEnum";
import { StateTransition } from "../../../../../../src/provider/code-completion/states/StateTransition";
import { TestInitializer } from "../../../../../Testinitializer";
import { SyntaxHighlightingCapture } from "../../../../../../src/provider/syntax-highlighting/SyntaxHighlightingCapture";

describe("OperandNode Tests", () => {
    var initializer: TestInitializer;

    beforeEach(() => {
        initializer = new TestInitializer(true);
    });

    test("OperandNode get isStatic test", () => {
        var operand: string = "Test";
        var operandNode: OperandNode = new OperandNode([operand], IndexRange.create(0, 0, 0, operand.length), "String", operand);

        expect(operandNode.$isStatic).toEqual(false);
    })

    test("getChildren test, expect no children", () => {
        var operand: string = "Test";
        var operandNode: OperandNode = new OperandNode([operand], IndexRange.create(0, 0, 0, operand.length), "String", operand);

        var actual: GenericNode[] = operandNode.getChildren();
        var expected: GenericNode[] = [];

        expect(actual).toEqual(expected);
    })

    test("getHoverContent test, expect not empty content", () => {
        var operand: string = "Test";
        var operandNode: OperandNode = new OperandNode([operand], IndexRange.create(0, 0, 0, operand.length), "String", operand);

        var actual = operandNode.getHoverContent();

        expect(actual).not.toBeNull();
    })

    test("getBeautifiedContent test, expect not empty content", () => {
        var operand: string = "Test";
        var operandNode: OperandNode = new OperandNode([operand], IndexRange.create(0, 0, 0, operand.length), "String", operand);

        var actual = operandNode.getBeautifiedContent(initializer.server.aliasHelper);

        expect(actual).toEqual(operand);
    })

    test("getCompletionContainer test, expect empty transition list", () => {
        var operand: string = "Test";
        var operandNode: OperandNode = new OperandNode([operand], IndexRange.create(0, 0, 0, operand.length), "String", operand);

        var actual: StateTransition[] = operandNode.getCompletionContainer(Position.create(0, 5)).$transitions;
        var expected: StateTransition[] = [];

        expect(actual).toEqual(expected);
    })

    test("isComplete test, expect false", () => {
        var operand: string = "Test";
        var operandNode: OperandNode = new OperandNode([operand], IndexRange.create(0, 0, 0, operand.length), "String", operand);

        var actual: boolean = operandNode.isComplete();
        var expected: boolean = false;

        expect(actual).toEqual(expected);
    })

    test("getPatternInformation with single operand, expect variable", () => {
        var operand: string = "Test";
        var operandNode: OperandNode = new OperandNode([operand], IndexRange.create(0, 0, 0, operand.length), "String", operand);

        var actual: ScopeEnum[] = operandNode.getPatternInformation(initializer.server.aliasHelper)!.$capture;
        var expected: ScopeEnum[] = [ScopeEnum.Variable];

        expect(actual).toEqual(expected);
    })

    test("getPatternInformation with single static string operand, expect static string", () => {
        var operand: string = "Test";
        var operandNode: OperandNode = new OperandNode([operand], IndexRange.create(0, 0, 0, operand.length), "String", operand, true);

        var actual: ScopeEnum[] = operandNode.getPatternInformation(initializer.server.aliasHelper)!.$capture;
        var expected: ScopeEnum[] = [ScopeEnum.StaticString];

        expect(actual).toEqual(expected);
    })

    test("getPatternInformation with single static decimal operand, expect static number", () => {
        var operand: string = "100";
        var operandNode: OperandNode = new OperandNode([operand], IndexRange.create(0, 0, 0, operand.length), "Decimal", operand, true);

        var actual: ScopeEnum[] = operandNode.getPatternInformation(initializer.server.aliasHelper)!.$capture;
        var expected: ScopeEnum[] = [ScopeEnum.StaticNumber];

        expect(actual).toEqual(expected);
    });

    test("getPatternInformation with complex static decimal operand, expect empty and static number", () => {
        var operand: string = "Alter kleiner 100";
        var operandNode: OperandNode = new OperandNode([operand], IndexRange.create(0, 0, 0, operand.length), "Decimal", "100", true);

        var actual: ScopeEnum[] = operandNode.getPatternInformation(initializer.server.aliasHelper)!.$capture;
        var expected: ScopeEnum[] = [ScopeEnum.Empty, ScopeEnum.StaticNumber];

        expect(actual).toEqual(expected);
    });

    test("getPatternInformation with complex static decimal operand, expect empty, static number and empty", () => {
        var operand: string = "Alter kleiner 100 test";
        var operandNode: OperandNode = new OperandNode([operand], IndexRange.create(0, 0, 0, operand.length), "Decimal", "100", true);

        var actual: ScopeEnum[] = operandNode.getPatternInformation(initializer.server.aliasHelper)!.$capture;
        var expected: ScopeEnum[] = [ScopeEnum.Empty, ScopeEnum.StaticNumber, ScopeEnum.Empty];

        expect(actual).toEqual(expected);
    });

    test("getPatternInformation with complex static decimal operand which appears two times, expect empty, static number and empty", () => {
        var operand: string = "Alter kleiner 100 test 100 test";
        var operandNode: OperandNode = new OperandNode([operand], IndexRange.create(0, 0, 0, operand.length), "Decimal", "100", true);

        var actual: ScopeEnum[] = operandNode.getPatternInformation(initializer.server.aliasHelper)!.$capture;
        var expected: ScopeEnum[] = [ScopeEnum.Empty, ScopeEnum.StaticNumber, ScopeEnum.Empty];

        expect(actual).toEqual(expected);
    });

    test("getPatternInformation with complex schema operand, expect empty, variable", () => {
        var operand: string = "Alter kleiner Student.Alter";
        var operandNode: OperandNode = new OperandNode([operand], IndexRange.create(0, 0, 0, operand.length), "Decimal", "Student.Alter");

        var actual: ScopeEnum[] = operandNode.getPatternInformation(initializer.server.aliasHelper)!.$capture;
        var expected: ScopeEnum[] = [ScopeEnum.Empty, ScopeEnum.Variable];

        expect(actual).toEqual(expected);
    });

    test("getPatternInformation with complex schema operand, expect empty, variable", () => {
        var operand: string = "Test kleiner Alter OF Student";
        var operandNode: OperandNode = new OperandNode([operand], IndexRange.create(0, 0, 0, operand.length), "Decimal", "Student.Alter");

        var actual: ScopeEnum[] = operandNode.getPatternInformation(initializer.server.aliasHelper)!.$capture;
        var expected: ScopeEnum[] = [ScopeEnum.Empty, ScopeEnum.Variable, ScopeEnum.Keyword, ScopeEnum.Variable, ScopeEnum.Empty];

        expect(actual).toEqual(expected);
    });

    test("getPatternInformation with empty lines, expect null", () => {
        var operand: string = "";
        var operandNode: OperandNode = new OperandNode([operand], IndexRange.create(0, 0, 0, operand.length), "Decimal", "Student.Alter");

        var actual: SyntaxHighlightingCapture | null = operandNode.getPatternInformation(initializer.server.aliasHelper);
        var expected: SyntaxHighlightingCapture | null = null;

        expect(actual).toEqual(expected);
    });
});