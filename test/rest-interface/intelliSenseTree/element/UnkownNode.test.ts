import "jest";
import { UnkownNode } from "../../../../src/rest-interface/intelliSenseTree/element/UnkownNode";
import { IndexRange } from "../../../../src/rest-interface/intelliSenseTree/IndexRange";
import { CompletionState } from "../../../../src/provider/code-completion/CompletionStates";
import { Position } from "vscode-languageserver";
import { OperandNode } from "../../../../src/rest-interface/intelliSenseTree/element/operation/operand/OperandNode";
import { OperatorNode } from "../../../../src/rest-interface/intelliSenseTree/element/operation/operand/OperatorNode";
import { OperationNode } from "../../../../src/rest-interface/intelliSenseTree/element/operation/OperationNode";
import { ConnectedOperationNode } from "../../../../src/rest-interface/intelliSenseTree/element/operation/ConnectedOperationNode";

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

        var positionParameter = Position.create(0, 6);

        var expected: CompletionState[] = [CompletionState.Operand, CompletionState.UnkownOperand];
        var actual: CompletionState[] = unkown.getCompletionContainer(positionParameter).getStates();

        expect(actual).toEqual(expected);
    });

    test("getCompletionContainer with half-full OperationNode, expected Operator", () => {
        var leftOperand: OperandNode = new OperandNode(["Alter"], IndexRange.create(0, 0, 0, 5), "Decimal", "Alter");
        var operator: OperatorNode = new OperatorNode(["gleich"], IndexRange.create(0, 6, 0, 12), "Boolean", "EQUALS", "Object");
        var operation = new OperationNode(leftOperand, operator, null, [], IndexRange.create(0, 0, 0, 12));
        var unkown: UnkownNode = new UnkownNode(operation, [], IndexRange.create(0, 0, 0, 12));

        var positionParameter = Position.create(0, 13);

        var expected: CompletionState[] = [CompletionState.Operator];
        var actual: CompletionState[] = unkown.getCompletionContainer(positionParameter).getStates();

        expect(actual).toEqual(expected);
    });

    test("getCompletionContainer with full OperationNode,  expected RuleEnd and Variable", () => {
        var leftOperand: OperandNode = new OperandNode(["Alter"], IndexRange.create(0, 0, 0, 5), "Decimal", "Alter");
        var operator: OperatorNode = new OperatorNode(["gleich"], IndexRange.create(0, 6, 0, 12), "Boolean", "EQUALS", "Object");
        var rightOperand: OperandNode = new OperandNode(["18"], IndexRange.create(0, 13, 0, 15), "Decimal", "18.0");
        var operation = new OperationNode(leftOperand, operator, rightOperand, ["Alter gleich 18"], IndexRange.create(0, 0, 0, 15));
        
        var unkown: UnkownNode = new UnkownNode(operation, [], IndexRange.create(0, 0, 0, 15));

        var positionParameter = Position.create(0, 16);

        var expected: CompletionState[] = [CompletionState.OperationEnd, CompletionState.RuleEnd, CompletionState.UnkownOperand];
        var actual: CompletionState[] = unkown.getCompletionContainer(positionParameter).getStates();

        expect(actual).toEqual(expected);
    });

    test("getCompletionContainer with full OperationNode, expected RuleEnd and Variable", () => {
        var leftOperand: OperandNode = new OperandNode(["Alter"], IndexRange.create(0, 0, 0, 5), "Decimal", "Alter");
        var operator: OperatorNode = new OperatorNode(["gleich"], IndexRange.create(0, 6, 0, 12), "Boolean", "EQUALS", "Object");
        var rightOperand: OperandNode = new OperandNode(["18"], IndexRange.create(0, 13, 0, 15), "Decimal", "18.0");
        var operation = new OperationNode(leftOperand, operator, rightOperand, ["Alter gleich 18"], IndexRange.create(0, 0, 0, 15));
        
        var unkown: UnkownNode = new UnkownNode(operation, [], IndexRange.create(0, 0, 0, 15));

        var positionParameter = Position.create(0, 16);

        var expected: CompletionState[] = [CompletionState.OperationEnd, CompletionState.RuleEnd, CompletionState.UnkownOperand];
        var actual: CompletionState[] = unkown.getCompletionContainer(positionParameter).getStates();

        expect(actual).toEqual(expected);
    });

    test("getCompletionContainer with full OperationNode, expected RuleEnd and Variable", () => {
        var leftOperand: OperandNode = new OperandNode(["Alter"], IndexRange.create(0, 0, 0, 5), "Decimal", "Alter");
        var operator: OperatorNode = new OperatorNode(["gleich"], IndexRange.create(0, 6, 0, 12), "Boolean", "EQUALS", "Object");
        var rightOperand: OperandNode = new OperandNode(["18"], IndexRange.create(0, 13, 0, 15), "Decimal", "18.0");
        var firstOperation = new OperationNode(leftOperand, operator, rightOperand, ["Alter gleich 18"], IndexRange.create(0, 0, 0, 15));
 
        var secondOperation = new OperationNode(null, null, null, ["UND "], IndexRange.create(0, 17, 0, 21));

        var connectOperation: ConnectedOperationNode = new ConnectedOperationNode([firstOperation, secondOperation], [], IndexRange.create(0, 0, 0, 22));

        var unkown: UnkownNode = new UnkownNode(connectOperation, [], IndexRange.create(0, 0, 0, 22));

        var positionParameter = Position.create(0, 22);

        var expected: CompletionState[] = [CompletionState.OperandMissing];
        var actual: CompletionState[] = unkown.getCompletionContainer(positionParameter).getStates();

        expect(actual).toEqual(expected);
    });

    test("getCompletionContainer with ConnectedOperationNode and 2 OperationNodes and one falsy OperationNode and position after second Operation, expected RuleEnd and Variable", () => {
        var leftOperand: OperandNode = new OperandNode(["Alter"], IndexRange.create(0, 0, 0, 5), "Decimal", "Alter");
        var operator: OperatorNode = new OperatorNode(["gleich"], IndexRange.create(0, 6, 0, 12), "Boolean", "EQUALS", "Object");
        var rightOperand: OperandNode = new OperandNode(["18"], IndexRange.create(0, 13, 0, 15), "Decimal", "18.0");
        var firstOperation = new OperationNode(leftOperand, operator, rightOperand, ["Alter gleich 18"], IndexRange.create(0, 0, 0, 15));
 
        var secleftOperand: OperandNode = new OperandNode(["Alter"], IndexRange.create(0, 19, 0, 25), "Decimal", "Alter");
        var secondOperation = new OperationNode(secleftOperand, null, null, ["UND  Alter gleich 18"], IndexRange.create(0, 17, 0, 35));

        var connectOperation: ConnectedOperationNode = new ConnectedOperationNode([firstOperation, secondOperation], [], IndexRange.create(0, 0, 0, 35));

        var unkown: UnkownNode = new UnkownNode(connectOperation, [], IndexRange.create(0, 0, 0, 35));

        var positionParameter = Position.create(0, 36);

        var expected: CompletionState[] = [CompletionState.Operand];
        var actual: CompletionState[] = unkown.getCompletionContainer(positionParameter).getStates();

        expect(actual).toEqual(expected);
    });
});