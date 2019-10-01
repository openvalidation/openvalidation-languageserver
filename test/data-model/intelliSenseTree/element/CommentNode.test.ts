import "jest";
import { Position } from "vscode-languageserver";
import { CommentNode } from "../../../../src/data-model/syntax-tree/element/CommentNode";
import { IndexRange } from "../../../../src/data-model/syntax-tree/IndexRange";
import { EmptyTransition } from "../../../../src/provider/code-completion/states/EmptyTransition";
import { StateTransition } from "../../../../src/provider/code-completion/states/StateTransition";

describe("CommentNode Tests", () => {
    beforeEach(() => {
    });

    test("getCompletionContainer with empty CommentNode, expected Empty", () => {
        var comment: CommentNode = new CommentNode("", [], IndexRange.create(0, 0, 0, 0));

        var positionParameter = Position.create(0, 5);

        var actual: StateTransition[] = comment.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(EmptyTransition);
    });

    test("getCompletionContainer with full CommentNode, expected Empty", () => {
        var comment: CommentNode = new CommentNode("Das ist ein Test", ["Kommentar Das ist ein Test"], IndexRange.create(0, 0, 0, "Kommentar Das ist ein Test".length));

        var positionParameter = Position.create(0, 5);

        var actual: StateTransition[] = comment.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(EmptyTransition);
    });
});