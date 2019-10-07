import "jest"
import { TestInitializer } from "../../../Testinitializer";
import { VariableNameNode } from "../../../../src/data-model/syntax-tree/element/VariableNameNode";
import { IndexRange } from "../../../../src/data-model/syntax-tree/IndexRange";
import { GenericNode } from "../../../../src/data-model/syntax-tree/GenericNode";
import { StateTransition } from "../../../../src/provider/code-completion/states/StateTransition";
import { Position } from "vscode-languageserver";
import { EmptyTransition } from "../../../../src/provider/code-completion/states/EmptyTransition";

describe("VariableNameNode Tests", () => {
    var initializer: TestInitializer;

    beforeEach(() => {
        initializer = new TestInitializer(true);
    });

    test("VariableNameNode get errorMessage test", () => {
        var variableName: string = "Test";
        var variableNode: VariableNameNode = new VariableNameNode([variableName], IndexRange.create(0, 0, 0, variableName.length), variableName);

        expect(variableNode.$name).toEqual(variableName);
    })

    test("getChildren test, expect no children", () => {
        var variableName: string = "Test";
        var variableNode: VariableNameNode = new VariableNameNode([variableName], IndexRange.create(0, 0, 0, variableName.length), variableName);

        var actual: GenericNode[] = variableNode.getChildren();
        var expected: GenericNode[] = [];

        expect(actual).toEqual(expected);
    })

    test("getHoverContent test, expect not empty content", () => {
        var variableName: string = "Test";
        var variableNode: VariableNameNode = new VariableNameNode([variableName], IndexRange.create(0, 0, 0, variableName.length), variableName);

        var actual = variableNode.getHoverContent();

        expect(actual).not.toBeNull();
    })

    test("getBeautifiedContent test, expect not empty content", () => {
        var variableName: string = "Test";
        var variableNode: VariableNameNode = new VariableNameNode([variableName], IndexRange.create(0, 0, 0, variableName.length), variableName);

        var actual = variableNode.getBeautifiedContent(initializer.server.aliasHelper);

        expect(actual).toEqual(variableName);
    })

    test("getCompletionContainer test, empty transition", () => {
        var variableName: string = "Test";
        var variableNode: VariableNameNode = new VariableNameNode([variableName], IndexRange.create(0, 0, 0, variableName.length), variableName);

        var actual: StateTransition = variableNode.getCompletionContainer(Position.create(0, 5)).$transitions[0];
        var expected: StateTransition = new EmptyTransition();

        expect(actual).toEqual(expected);
    })
});