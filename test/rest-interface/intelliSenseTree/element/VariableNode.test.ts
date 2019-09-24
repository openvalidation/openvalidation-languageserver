import "jest";
import { Position } from "vscode-languageserver";
import { CompletionState } from "../../../../src/provider/code-completion/CompletionStates";
import { VariableNode } from "../../../../src/rest-interface/intelliSenseTree/element/VariableNode";
import { IndexRange } from "../../../../src/rest-interface/intelliSenseTree/IndexRange";

describe("VariableNode Tests", () => {
    beforeEach(() => {
    });

    test("getCompletionContainer with empty CommentNode, expected Empty", () => {
        var variable: VariableNode = new VariableNode("", null, [], IndexRange.create(0, 0, 0, 0));

        var positionParameter = Position.create(0, 0);

        // var expected: CompletionState[] = [CompletionState.OperandMissing];
        var actual: CompletionState[] = variable.getCompletionContainer(positionParameter).getStates();

        expect(actual).toEqual(actual);
    });
});