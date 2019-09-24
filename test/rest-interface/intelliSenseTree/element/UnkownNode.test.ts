import "jest";
import { UnkownNode } from "../../../../src/rest-interface/intelliSenseTree/element/UnkownNode";
import { IndexRange } from "../../../../src/rest-interface/intelliSenseTree/IndexRange";
import { CompletionState } from "../../../../src/provider/code-completion/CompletionStates";
import { Position } from "vscode-languageserver";
import { OperandNode } from "../../../../src/rest-interface/intelliSenseTree/element/operation/operand/OperandNode";

describe("UnkownNode Tests", () => {
    beforeEach(() => {
    });

    test("getCompletionContainer with empty UnkownNode, expected OperandMissing", () => {
        var unkown: UnkownNode = new UnkownNode(null, [], IndexRange.create(0, 0, 0, 0));

        var positionParameter = Position.create(0, 0);

        var expected: CompletionState[] = [CompletionState.OperandMissing];
        var actual: CompletionState[] = unkown.getCompletionContainer(positionParameter).getStates();

        expect(actual).toEqual(expected);
    });

    test("getCompletionContainer with OperandNode, expected Operand", () => {
        var operand: OperandNode = new OperandNode(["Alter"], IndexRange.create(0, 0, 0, 5), "Decimal", "Alter");
        var unkown: UnkownNode = new UnkownNode(operand, [], IndexRange.create(0, 0, 0, 5));

        var positionParameter = Position.create(0, 0);

        var expected: CompletionState[] = [CompletionState.Operand];
        var actual: CompletionState[] = unkown.getCompletionContainer(positionParameter).getStates();

        expect(actual).toEqual(expected);
    });
});