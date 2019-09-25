import "jest";
import { Position } from "vscode-languageserver";
import { CommentNode } from "../../../../src/rest-interface/intelliSenseTree/element/CommentNode";
import { IndexRange } from "../../../../src/rest-interface/intelliSenseTree/IndexRange";
import { StateTransitionEnum } from "../../../../src/provider/code-completion/states/StateTransitionEnum";

describe("CommentNode Tests", () => {
    beforeEach(() => {
    });

    test("getCompletionContainer with empty CommentNode, expected Empty", () => {
        var comment: CommentNode = new CommentNode("", [], IndexRange.create(0, 0, 0, 0));

        var positionParameter = Position.create(0, 5);

        var expected: StateTransitionEnum[] = [StateTransitionEnum.Empty];
        var actual: StateTransitionEnum[] = comment.getCompletionContainer(positionParameter).getTransitions().map(t => t.getState());

        expect(actual).toEqual(expected);
    });

    test("getCompletionContainer with full CommentNode, expected Empty", () => {
        var comment: CommentNode = new CommentNode("Das ist ein Test", ["Kommentar Das ist ein Test"], IndexRange.create(0, 0, 0, "Kommentar Das ist ein Test".length));

        var positionParameter = Position.create(0, 5);

        var expected: StateTransitionEnum[] = [StateTransitionEnum.Empty];
        var actual: StateTransitionEnum[] = comment.getCompletionContainer(positionParameter).getTransitions().map(t => t.getState());

        expect(actual).toEqual(expected);
    });
});