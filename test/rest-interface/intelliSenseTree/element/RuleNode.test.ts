import "jest";
import { RuleNode } from "../../../../src/rest-interface/intelliSenseTree/element/RuleNode";
import { IndexRange } from "../../../../src/rest-interface/intelliSenseTree/IndexRange";
import { Position } from "vscode-languageserver-types";
import { CompletionState } from "../../../../src/provider/code-completion/CompletionStates";
import { OperationNode } from "../../../../src/rest-interface/intelliSenseTree/element/operation/OperationNode";
import { OperandNode } from "../../../../src/rest-interface/intelliSenseTree/element/operation/operand/OperandNode";
import { OperatorNode } from "../../../../src/rest-interface/intelliSenseTree/element/operation/operand/OperatorNode";
import { ActionErrorNode } from "../../../../src/rest-interface/intelliSenseTree/element/ActionErrorNode";
import { ConnectedOperationNode } from "../../../../src/rest-interface/intelliSenseTree/element/operation/ConnectedOperationNode";

describe("RuleNode Tests", () => {
    beforeEach(() => {
    });

    test("getCompletionContainer with empty RuleNode, expected RuleStart", () => {
        var rule: RuleNode = new RuleNode(null, null, ["Wenn"], IndexRange.create(0, 0, 0, 4));

        var positionParameter = Position.create(0, 5);

        var expected: CompletionState[] = [CompletionState.OperandMissing];
        var actual: CompletionState[] = rule.getCompletionContainer(positionParameter).getStates();

        expect(actual).toEqual(expected);
    });

    test("getCompletionContainer with empty Operation, expected RuleStart", () => {
        var operation: OperationNode = new OperationNode(null, null, null, [], IndexRange.create(0, 4, 0, 4));
        var rule: RuleNode = new RuleNode(null, operation, ["Wenn"], IndexRange.create(0, 0, 0, 4));

        var positionParameter = Position.create(0, 5);

        var expected: CompletionState[] = [CompletionState.OperandMissing];
        var actual: CompletionState[] = rule.getCompletionContainer(positionParameter).getStates();

        expect(actual).toEqual(expected);
    });

    test("getCompletionContainer with complete Operation but invalid position, expected Empty State", () => {
        var leftOperand: OperandNode = new OperandNode(["Alte"], IndexRange.create(0, 6, 0, 10), "Decimal", "Alter");
        var operator: OperatorNode = new OperatorNode(["gleich"], IndexRange.create(0, 11, 0, 17), "Boolean", "EQUALS", "Object");
        var rightOperand: OperandNode = new OperandNode(["18"], IndexRange.create(0, 18, 0, 20), "Decimal", "18.0");
        var operation = new OperationNode(leftOperand, operator, rightOperand, ["Alter gleich 18"], IndexRange.create(0, 6, 0, 20));

        var rule: RuleNode = new RuleNode(null, operation, ["Wenn  Alte gleich 18"], IndexRange.create(0, 0, 0, 20));

        var positionParameter = Position.create(0, 5);

        var expected: CompletionState[] = [];
        var actual: CompletionState[] = rule.getCompletionContainer(positionParameter).getStates();

        expect(actual).toEqual(expected);
    });

    test("getCompletionContainer with complete Operation, expected ConnectedOperation and RuleEnd", () => {
        var leftOperand: OperandNode = new OperandNode(["Alter"], IndexRange.create(0, 5, 0, 10), "Decimal", "Alter");
        var operator: OperatorNode = new OperatorNode(["gleich"], IndexRange.create(0, 11, 0, 17), "Boolean", "EQUALS", "Object");
        var rightOperand: OperandNode = new OperandNode(["18"], IndexRange.create(0, 18, 0, 20), "Decimal", "18.0");
        var operation = new OperationNode(leftOperand, operator, rightOperand, ["Alter gleich 18"], IndexRange.create(0, 5, 0, 20));

        var rule: RuleNode = new RuleNode(null, operation, ["Wenn Alter gleich 18"], IndexRange.create(0, 0, 0, 20));

        var positionParameter = Position.create(0, 21);

        var expected: CompletionState[] = [CompletionState.OperationEnd, CompletionState.RuleEnd];
        var actual: CompletionState[] = rule.getCompletionContainer(positionParameter).getStates();

        expect(actual).toEqual(expected);
    });

    test("getCompletionContainer with complete Operation and empty message, expected Emptylist", () => {
        var leftOperand: OperandNode = new OperandNode(["Alter"], IndexRange.create(0, 5, 0, 10), "Decimal", "Alter");
        var operator: OperatorNode = new OperatorNode(["gleich"], IndexRange.create(0, 11, 0, 17), "Boolean", "EQUALS", "Object");
        var rightOperand: OperandNode = new OperandNode(["18"], IndexRange.create(0, 18, 0, 20), "Decimal", "18.0");
        var operation = new OperationNode(leftOperand, operator, rightOperand, ["Alter gleich 18"], IndexRange.create(0, 5, 0, 20));

        var actionNode = new ActionErrorNode(["Dann "], IndexRange.create(0, 0, 0, 21), "");
        var rule: RuleNode = new RuleNode(actionNode, operation, ["Wenn Alter gleich 18 Dann "], IndexRange.create(0, 0, 0, 26));

        var positionParameter = Position.create(0, 27);

        var expected: CompletionState[] = [];
        var actual: CompletionState[] = rule.getCompletionContainer(positionParameter).getStates();

        expect(actual).toEqual(expected);
    });

    test("getCompletionContainer with complete Operation and empty message with position before message, expected ConnectedOperation", () => {
        var leftOperand: OperandNode = new OperandNode(["Alter"], IndexRange.create(0, 5, 0, 10), "Decimal", "Alter");
        var operator: OperatorNode = new OperatorNode(["gleich"], IndexRange.create(0, 11, 0, 17), "Boolean", "EQUALS", "Object");
        var rightOperand: OperandNode = new OperandNode(["18"], IndexRange.create(0, 18, 0, 20), "Decimal", "18.0");
        var operation = new OperationNode(leftOperand, operator, rightOperand, ["Alter gleich 18"], IndexRange.create(0, 5, 0, 20));

        var actionNode = new ActionErrorNode(["Dann "], IndexRange.create(0, 22, 0, 27), "");
        var rule: RuleNode = new RuleNode(actionNode, operation, ["Wenn Alter gleich 18  Dann "], IndexRange.create(0, 0, 0, 27));

        var positionParameter = Position.create(0, 21);

        var expected: CompletionState[] = [CompletionState.OperationEnd];
        var actual: CompletionState[] = rule.getCompletionContainer(positionParameter).getStates();

        expect(actual).toEqual(expected);
    });

    test("getCompletionContainer with complete Operation and with position before condition, expected empty list", () => {
        var leftOperand: OperandNode = new OperandNode(["Alte"], IndexRange.create(0, 6, 0, 10), "Decimal", "Alte");
        var operator: OperatorNode = new OperatorNode(["gleich"], IndexRange.create(0, 11, 0, 17), "Boolean", "EQUALS", "Object");
        var rightOperand: OperandNode = new OperandNode(["18"], IndexRange.create(0, 18, 0, 20), "Decimal", "18.0");
        var operation = new OperationNode(leftOperand, operator, rightOperand, ["Alter gleich 18"], IndexRange.create(0, 5, 0, 20));

        var actionNode = new ActionErrorNode(["Dann "], IndexRange.create(0, 22, 0, 27), "");
        var rule: RuleNode = new RuleNode(actionNode, operation, ["Wenn  Alte gleich 18  Dann "], IndexRange.create(0, 0, 0, 27));

        var positionParameter = Position.create(0, 5);

        var expected: CompletionState[] = [];
        var actual: CompletionState[] = rule.getCompletionContainer(positionParameter).getStates();

        expect(actual).toEqual(expected);
    });

    test("getCompletionContainer with ConnectedOperation and with position after action, expected empty list", () => {     
        var leftOperand: OperandNode = new OperandNode(["Alter"], IndexRange.create(0, 5, 0, 10), "Decimal", "Alter");
        var operator: OperatorNode = new OperatorNode(["gleich"], IndexRange.create(0, 11, 0, 17), "Boolean", "EQUALS", "Object");
        var rightOperand: OperandNode = new OperandNode(["18"], IndexRange.create(0, 18, 0, 20), "Decimal", "18.0");
        var firstOperation = new OperationNode(leftOperand, operator, rightOperand, ["Alter gleich 18"], IndexRange.create(0, 5, 0, 20));
 
        var secleftOperand: OperandNode = new OperandNode(["Alter"], IndexRange.create(0, 24, 0, 30), "Decimal", "Alter");
        var secoperator: OperatorNode = new OperatorNode(["gleich"], IndexRange.create(0, 31, 0, 37), "Boolean", "EQUALS", "Object");
        var secrightOperand: OperandNode = new OperandNode(["18"], IndexRange.create(0, 38, 0, 40), "Decimal", "18.0");
        var secondOperation = new OperationNode(secleftOperand, secoperator, secrightOperand, ["UND  Alter gleich 18"], IndexRange.create(0, 21, 0, 40));

        var connectOperation: ConnectedOperationNode = new ConnectedOperationNode([firstOperation, secondOperation], ["Alter gleich 18 UND Alter gleich 18"], IndexRange.create(0, 5, 0, 40));

        var actionNode = new ActionErrorNode(["Dann "], IndexRange.create(0, 41, 0, 46), "");
        var rule: RuleNode = new RuleNode(actionNode, connectOperation, ["Wenn Alter gleich 18 UND Alter gleich 18 Dann "], IndexRange.create(0, 0, 0, 46));

        var positionParameter = Position.create(0, 47);

        var expected: CompletionState[] = [];
        var actual: CompletionState[] = rule.getCompletionContainer(positionParameter).getStates();

        expect(actual).toEqual(expected);
    });

    test("getCompletionContainer with ConnectedOperation and with position before action, expected empty list", () => {     
        var leftOperand: OperandNode = new OperandNode(["Alter"], IndexRange.create(0, 5, 0, 10), "Decimal", "Alter");
        var operator: OperatorNode = new OperatorNode(["gleich"], IndexRange.create(0, 11, 0, 17), "Boolean", "EQUALS", "Object");
        var rightOperand: OperandNode = new OperandNode(["18"], IndexRange.create(0, 18, 0, 20), "Decimal", "18.0");
        var firstOperation = new OperationNode(leftOperand, operator, rightOperand, ["Alter gleich 18"], IndexRange.create(0, 5, 0, 20));
 
        var secleftOperand: OperandNode = new OperandNode(["Alter"], IndexRange.create(0, 24, 0, 30), "Decimal", "Alter");
        var secoperator: OperatorNode = new OperatorNode(["gleich"], IndexRange.create(0, 31, 0, 37), "Boolean", "EQUALS", "Object");
        var secrightOperand: OperandNode = new OperandNode(["18"], IndexRange.create(0, 38, 0, 40), "Decimal", "18.0");
        var secondOperation = new OperationNode(secleftOperand, secoperator, secrightOperand, ["UND  Alter gleich 18"], IndexRange.create(0, 21, 0, 40));

        var connectOperation: ConnectedOperationNode = new ConnectedOperationNode([firstOperation, secondOperation], ["Alter gleich 18 UND Alter gleich 18 "], IndexRange.create(0, 5, 0, 40));

        var actionNode = new ActionErrorNode(["Dann "], IndexRange.create(0, 42, 0, 46), "");
        var rule: RuleNode = new RuleNode(actionNode, connectOperation, ["Wenn Alter gleich 18 UND Alter gleich 18 Dann "], IndexRange.create(0, 0, 0, 46));

        var positionParameter = Position.create(0, 41);

        var expected: CompletionState[] = [CompletionState.OperationEnd];
        var actual: CompletionState[] = rule.getCompletionContainer(positionParameter).getStates();

        expect(actual).toEqual(expected);
    });

    test("getCompletionContainer with ConnectedOperation and with position before second operation, expected empty list", () => {     
        var leftOperand: OperandNode = new OperandNode(["Alter"], IndexRange.create(0, 5, 0, 10), "Decimal", "Alter");
        var operator: OperatorNode = new OperatorNode(["gleich"], IndexRange.create(0, 11, 0, 17), "Boolean", "EQUALS", "Object");
        var rightOperand: OperandNode = new OperandNode(["18"], IndexRange.create(0, 18, 0, 20), "Decimal", "18.0");
        var firstOperation = new OperationNode(leftOperand, operator, rightOperand, ["Alter gleich 18"], IndexRange.create(0, 5, 0, 20));
 
        var secleftOperand: OperandNode = new OperandNode(["Alter"], IndexRange.create(0, 24, 0, 30), "Decimal", "Alter");
        var secoperator: OperatorNode = new OperatorNode(["gleich"], IndexRange.create(0, 31, 0, 37), "Boolean", "EQUALS", "Object");
        var secrightOperand: OperandNode = new OperandNode(["18"], IndexRange.create(0, 38, 0, 40), "Decimal", "18.0");
        var secondOperation = new OperationNode(secleftOperand, secoperator, secrightOperand, ["UND  Alter gleich 18"], IndexRange.create(0, 22, 0, 40));

        var connectOperation: ConnectedOperationNode = new ConnectedOperationNode([firstOperation, secondOperation], ["Alter gleich 18 UND Alter gleich 18 "], IndexRange.create(0, 5, 0, 40));

        var actionNode = new ActionErrorNode(["Dann "], IndexRange.create(0, 42, 0, 46), "");
        var rule: RuleNode = new RuleNode(actionNode, connectOperation, ["Wenn Alter gleich 18 UND Alter gleich 18 Dann "], IndexRange.create(0, 0, 0, 46));

        var positionParameter = Position.create(0, 21);

        var expected: CompletionState[] = [CompletionState.OperationEnd];
        var actual: CompletionState[] = rule.getCompletionContainer(positionParameter).getStates();

        expect(actual).toEqual(expected);
    });
});