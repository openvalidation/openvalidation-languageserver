import "jest";
import { Position } from "vscode-languageserver";
import { StateTransitionEnum } from "../../../../src/provider/code-completion/states/StateTransitionEnum";
import { VariableNode } from "../../../../src/data-model/syntax-tree/element/VariableNode";
import { IndexRange } from "../../../../src/data-model/syntax-tree/IndexRange";
import { OperandNode } from "../../../../src/data-model/syntax-tree/element/operation/operand/OperandNode";
import { OperatorNode } from "../../../../src/data-model/syntax-tree/element/operation/operand/OperatorNode";
import { OperationNode } from "../../../../src/data-model/syntax-tree/element/operation/OperationNode";
import { ConnectedOperationNode } from "../../../../src/data-model/syntax-tree/element/operation/ConnectedOperationNode";
import { VariableNameNode } from "../../../../src/data-model/syntax-tree/element/VariableNameNode";

describe("VariableNode Tests", () => {
    beforeEach(() => {
    });

    test("getCompletionContainer with empty VariableNode, expected OperandMissing", () => {
        var variableNameNode: VariableNameNode = new VariableNameNode(["Als Test"], IndexRange.create(0, 1, 0, 9), "Test");
        var variable: VariableNode = new VariableNode(variableNameNode, null, [], IndexRange.create(0, 1, 0, 9));

        var positionParameter = Position.create(0, 0);

        var expected: StateTransitionEnum[] = [StateTransitionEnum.Operand];
        var actual: StateTransitionEnum[] = variable.getCompletionContainer(positionParameter).getTransitions().map(t => t.getState());

        expect(actual).toEqual(expected);
    });

    test("getCompletionContainer with VariableNode and OperandNode, expected Operand", () => {
        var variableNameNode: VariableNameNode = new VariableNameNode(["Als Test"], IndexRange.create(0, 7, 0, 15), "Test");

        var leftOperand: OperandNode = new OperandNode(["Alter"], IndexRange.create(0, 0, 0, 5), "Decimal", "Alter");
        var variable: VariableNode = new VariableNode(variableNameNode, leftOperand, ["Alter  Als Test"], IndexRange.create(0, 0, 0, "Alter  Als Test".length));

        var positionParameter = Position.create(0, 6);

        var expected: StateTransitionEnum[] = [StateTransitionEnum.Operator];
        var actual: StateTransitionEnum[] = variable.getCompletionContainer(positionParameter).getTransitions().map(t => t.getState());

        expect(actual).toEqual(expected);
    });

    test("getCompletionContainer with VariableNode and OperandNode and position after variable, expected Empty", () => {
        var variableNameNode: VariableNameNode = new VariableNameNode(["Als Test"], IndexRange.create(0, 6, 0, 14), "Test");

        var leftOperand: OperandNode = new OperandNode(["Alter"], IndexRange.create(0, 0, 0, 5), "Decimal", "Alter");
        var variable: VariableNode = new VariableNode(variableNameNode, leftOperand, ["Alter  Als Test"], IndexRange.create(0, 0, 0, "Alter  Als Test".length));

        var positionParameter = Position.create(0, 15);

        var expected: StateTransitionEnum[] = [StateTransitionEnum.Empty];
        var actual: StateTransitionEnum[] = variable.getCompletionContainer(positionParameter).getTransitions().map(t => t.getState());

        expect(actual).toEqual(expected);
    });

    test("getCompletionContainer with VariableNode and ConnectedOperationNode and half full OperationNode, expected Operator", () => {
        var variableNameNode: VariableNameNode = new VariableNameNode(["Als Test"], IndexRange.create(0, 14, 0, 22), "Test");

        var leftOperand: OperandNode = new OperandNode(["Alter"], IndexRange.create(0, 0, 0, 5), "Decimal", "Alter");
        var operator: OperatorNode = new OperatorNode(["gleich"], IndexRange.create(0, 6, 0, 12), "Boolean", "EQUALS", "Object");
        var operation = new OperationNode(leftOperand, operator, null, [], IndexRange.create(0, 0, 0, 12));
        var connectOperation: ConnectedOperationNode = new ConnectedOperationNode([operation], ["Alter gleich"], IndexRange.create(0, 0, 0, 12));

        var variable: VariableNode = new VariableNode(variableNameNode, connectOperation, ["Alter gleich  Als Test"], IndexRange.create(0, 0, 0, "Alter gleich  Als Test".length));

        var positionParameter = Position.create(0, 13);

        var expected: StateTransitionEnum[] = [StateTransitionEnum.Operand];
        var actual: StateTransitionEnum[] = variable.getCompletionContainer(positionParameter).getTransitions().map(t => t.getState());

        expect(actual).toEqual(expected);
    });

    test("getCompletionContainer with VariableNode and ConnectedOperationNode and half full OperationNode and position after variable, expected Empty", () => {
        var variableNameNode: VariableNameNode = new VariableNameNode(["Als Test"], IndexRange.create(0, 14, 0, 22), "Test");

        var leftOperand: OperandNode = new OperandNode(["Alter"], IndexRange.create(0, 0, 0, 5), "Decimal", "Alter");
        var operator: OperatorNode = new OperatorNode(["gleich"], IndexRange.create(0, 6, 0, 12), "Boolean", "EQUALS", "Object");
        var operation = new OperationNode(leftOperand, operator, null, [], IndexRange.create(0, 0, 0, 12));
        var connectOperation: ConnectedOperationNode = new ConnectedOperationNode([operation], ["Alter gleich"], IndexRange.create(0, 0, 0, 12));

        var variable: VariableNode = new VariableNode(variableNameNode, connectOperation, ["Alter gleich  Als Test"], IndexRange.create(0, 0, 0, "Alter gleich  Als Test".length));

        var positionParameter = Position.create(0, 23);

        var expected: StateTransitionEnum[] = [StateTransitionEnum.Empty];
        var actual: StateTransitionEnum[] = variable.getCompletionContainer(positionParameter).getTransitions().map(t => t.getState());

        expect(actual).toEqual(expected);
    });

    test("getCompletionContainer with VariableNode and ConnectedOperationNode and half full OperationNode, expected empty", () => {
        var leftOperand: OperandNode = new OperandNode(["Alter"], IndexRange.create(0, 0, 0, 5), "Decimal", "Alter");
        var operator: OperatorNode = new OperatorNode(["gleich"], IndexRange.create(0, 6, 0, 12), "Boolean", "EQUALS", "Object");
        var firstOperation = new OperationNode(leftOperand, operator, null, ["Alter gleich 18"], IndexRange.create(0, 0, 0, 15));
 
        var secleftOperand: OperandNode = new OperandNode(["Alter"], IndexRange.create(0, 19, 0, 25), "Decimal", "Alter");
        var secoperator: OperatorNode = new OperatorNode(["gleich"], IndexRange.create(0, 26, 0, 32), "Boolean", "EQUALS", "Object");
        var secrightOperand: OperandNode = new OperandNode(["18"], IndexRange.create(0, 33, 0, 35), "Decimal", "18.0");
        var secondOperation = new OperationNode(secleftOperand, secoperator, secrightOperand, ["UND  Alter gleich 18"], IndexRange.create(0, 17, 0, 35));

        var connectOperation: ConnectedOperationNode = new ConnectedOperationNode([firstOperation, secondOperation], ["Alter gleich 18 UND  Alter gleich 18"], IndexRange.create(0, 0, 0, 35));

        var variableNameNode: VariableNameNode = new VariableNameNode(["Als Test"], IndexRange.create(0, 37, 0, 44), "Test");
        var variable: VariableNode = new VariableNode(variableNameNode, connectOperation, ["Alter gleich  Als Test"], IndexRange.create(0, 0, 0, 44));

        var positionParameter = Position.create(0, 16);

        var expected: StateTransitionEnum[] = [StateTransitionEnum.Operand];
        var actual: StateTransitionEnum[] = variable.getCompletionContainer(positionParameter).getTransitions().map(t => t.getState());

        expect(actual).toEqual(expected);
    });

    test("getCompletionContainer with VariableNode and ConnectedOperationNode and half full OperationNode and position after variable, expected Operator", () => {
        var leftOperand: OperandNode = new OperandNode(["Alter"], IndexRange.create(0, 0, 0, 5), "Decimal", "Alter");
        var operator: OperatorNode = new OperatorNode(["gleich"], IndexRange.create(0, 6, 0, 12), "Boolean", "EQUALS", "Object");
        var firstOperation = new OperationNode(leftOperand, operator, null, ["Alter gleich 18"], IndexRange.create(0, 0, 0, 15));
 
        var secleftOperand: OperandNode = new OperandNode(["Alter"], IndexRange.create(0, 19, 0, 25), "Decimal", "Alter");
        var secoperator: OperatorNode = new OperatorNode(["gleich"], IndexRange.create(0, 26, 0, 32), "Boolean", "EQUALS", "Object");
        var secrightOperand: OperandNode = new OperandNode(["18"], IndexRange.create(0, 33, 0, 35), "Decimal", "18.0");
        var secondOperation = new OperationNode(secleftOperand, secoperator, secrightOperand, ["UND  Alter gleich 18"], IndexRange.create(0, 16, 0, 35));

        var connectOperation: ConnectedOperationNode = new ConnectedOperationNode([firstOperation, secondOperation], ["Alter gleich 18 UND  Alter gleich 18"], IndexRange.create(0, 0, 0, 35));

        var variableNameNode: VariableNameNode = new VariableNameNode(["Als Test"], IndexRange.create(0, 36, 0, 44), "Test");
        var variable: VariableNode = new VariableNode(variableNameNode, connectOperation, ["Alter gleich  Als Test"], IndexRange.create(0, 0, 0, 44));

        var positionParameter = Position.create(0, 45);

        var expected: StateTransitionEnum[] = [StateTransitionEnum.Empty];
        var actual: StateTransitionEnum[] = variable.getCompletionContainer(positionParameter).getTransitions().map(t => t.getState());

        expect(actual).toEqual(expected);
    });
});