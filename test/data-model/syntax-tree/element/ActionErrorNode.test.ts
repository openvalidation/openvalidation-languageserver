import "jest";
import { ActionErrorNode } from "../../../../src/data-model/syntax-tree/element/ActionErrorNode";
import { IndexRange } from "../../../../src/data-model/syntax-tree/IndexRange";
import { TestInitializer } from "../../../Testinitializer";
import { Position } from "vscode-languageserver";
import { StateTransition } from "../../../../src/provider/code-completion/states/StateTransition";
import { EmptyTransition } from "../../../../src/provider/code-completion/states/EmptyTransition";
import { GenericNode } from "../../../../src/data-model/syntax-tree/GenericNode";

describe("ActionErrorNode Tests", () => {
    var initializer: TestInitializer;

    beforeEach(() => {
        initializer = new TestInitializer(true);
    });
    
    test("ActionErrorNode get errorMessage test", () => {
        var errorMessage: string = "This is an error";
        var errorNode: ActionErrorNode = new ActionErrorNode([errorMessage], IndexRange.create(0, 0, 0, errorMessage.length), errorMessage);

        expect(errorNode.$errorMessage).toEqual(errorMessage);
    })

    test("getChildren test, expect no children", () => {
        var errorMessage: string = "This is an error";
        var errorNode: ActionErrorNode = new ActionErrorNode([errorMessage], IndexRange.create(0, 0, 0, errorMessage.length), errorMessage);

        var actual: GenericNode[] = errorNode.getChildren();
        var expected: GenericNode[] = [];

        expect(actual).toEqual(expected);
    })

    test("getHoverContent test, expect not empty content", () => {
        var errorMessage: string = "This is an error";
        var errorNode: ActionErrorNode = new ActionErrorNode([errorMessage], IndexRange.create(0, 0, 0, errorMessage.length), errorMessage);

        var actual = errorNode.getHoverContent();

        expect(actual).not.toBeNull();
    })   
    
    test("getBeautifiedContent test, expect not empty content", () => {
        var errorMessage: string = "This is an error";
        var errorNode: ActionErrorNode = new ActionErrorNode([errorMessage], IndexRange.create(0, 0, 0, errorMessage.length), errorMessage);

        var actual = errorNode.getBeautifiedContent(initializer.server.aliasHelper);

        expect(actual).toEqual(errorMessage);
    })

    test("getCompletionContainer test, expect empty transition", () => {
        var errorMessage: string = "This is an error";
        var errorNode: ActionErrorNode = new ActionErrorNode([errorMessage], IndexRange.create(0, 0, 0, errorMessage.length), errorMessage);

        var actual: StateTransition = errorNode.getCompletionContainer(Position.create(0, 5)).$transitions[0];
        var expected: StateTransition = new EmptyTransition();

        expect(actual).toEqual(expected);
    })
});