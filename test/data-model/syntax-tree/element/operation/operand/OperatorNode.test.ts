import "jest";
import { Position } from "vscode-languageserver";
import { OperatorNode } from "../../../../../../src/data-model/syntax-tree/element/operation/operand/OperatorNode";
import { GenericNode } from "../../../../../../src/data-model/syntax-tree/GenericNode";
import { IndexRange } from "../../../../../../src/data-model/syntax-tree/IndexRange";
import { ScopeEnum } from "../../../../../../src/enums/ScopeEnum";
import { StateTransition } from "../../../../../../src/provider/code-completion/states/StateTransition";
import { SyntaxHighlightingCapture } from "../../../../../../src/provider/syntax-highlighting/SyntaxHighlightingCapture";
import { TestInitializer } from "../../../../../Testinitializer";

describe("OperatorNode Tests", () => {
    var initializer: TestInitializer;

    beforeEach(() => {
        initializer = new TestInitializer(true);
    });

    test("OperatorNode get dataType and validType test", () => {
        var operator: string = "Test";
        var operatorNode: OperatorNode = new OperatorNode([operator], IndexRange.create(0, 0, 0, operator.length), "Boolean", operator, "Decimal");

        expect(operatorNode.$dataType).toEqual("Boolean");
        expect(operatorNode.$validType).toEqual("Decimal");
    })

    test("getChildren test, expect no children", () => {
        var operator: string = "Test";
        var operatorNode: OperatorNode = new OperatorNode([operator], IndexRange.create(0, 0, 0, operator.length), "Boolean", operator, "Decimal");

        var actual: GenericNode[] = operatorNode.getChildren();
        var expected: GenericNode[] = [];

        expect(actual).toEqual(expected);
    })

    test("getHoverContent test, expect not empty content", () => {
        var operator: string = "Test";
        var operatorNode: OperatorNode = new OperatorNode([operator], IndexRange.create(0, 0, 0, operator.length), "Boolean", operator, "Decimal");

        var actual = operatorNode.getHoverContent();

        expect(actual).not.toBeNull();
    })

    test("getBeautifiedContent test, expect not empty content", () => {
        var operator: string = "Test";
        var operatorNode: OperatorNode = new OperatorNode([operator], IndexRange.create(0, 0, 0, operator.length), "Boolean", operator, "Decimal");

        var actual = operatorNode.getBeautifiedContent(initializer.server.aliasHelper);

        expect(actual).toEqual(operator);
    })

    test("getCompletionContainer test, expect empty transition list", () => {
        var operator: string = "Test";
        var operatorNode: OperatorNode = new OperatorNode([operator], IndexRange.create(0, 0, 0, operator.length), "Boolean", operator, "Decimal");

        var actual: StateTransition[] = operatorNode.getCompletionContainer(Position.create(0, 5)).$transitions;
        var expected: StateTransition[] = [];

        expect(actual).toEqual(expected);
    })

    test("isComplete test, expect true", () => {
        var operator: string = "Test";
        var operatorNode: OperatorNode = new OperatorNode([operator], IndexRange.create(0, 0, 0, operator.length), "Boolean", operator, "Decimal");

        var actual: boolean = operatorNode.isComplete();
        var expected: boolean = true;

        expect(actual).toEqual(expected);
    })

    test("getPatternInformation with empty lines, expect null", () => {
        var operator: string = "";
        var operatorNode: OperatorNode = new OperatorNode([operator], IndexRange.create(0, 0, 0, operator.length), "Boolean", operator, "Decimal");

        var actual: SyntaxHighlightingCapture | null = operatorNode.getPatternInformation(initializer.server.aliasHelper);
        var expected: SyntaxHighlightingCapture | null = null;

        expect(actual).toEqual(expected);
    })

    test("getPatternInformation with empty lines, expect keyword", () => {
        var operator: string = "SMALLER THAN";
        var operatorNode: OperatorNode = new OperatorNode([operator], IndexRange.create(0, 0, 0, operator.length), "Boolean", operator, "Decimal");

        var actual: ScopeEnum[] = operatorNode.getPatternInformation(initializer.server.aliasHelper)!.$capture;
        var expected: ScopeEnum[] = [ScopeEnum.Keyword];

        expect(actual).toEqual(expected);
    })
});