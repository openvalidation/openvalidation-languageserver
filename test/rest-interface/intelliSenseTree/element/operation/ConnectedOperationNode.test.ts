import "jest";
import { Position } from "vscode-languageserver";
import { CompletionState } from "../../../../../src/provider/code-completion/CompletionStates";
import { IndexRange } from "../../../../../src/rest-interface/intelliSenseTree/IndexRange";
import { ConnectedOperationNode } from "../../../../../src/rest-interface/intelliSenseTree/element/operation/ConnectedOperationNode";
import { OperationNode } from "../../../../../src/rest-interface/intelliSenseTree/element/operation/OperationNode";
import { OperandNode } from "../../../../../src/rest-interface/intelliSenseTree/element/operation/operand/OperandNode";
import { OperatorNode } from "../../../../../src/rest-interface/intelliSenseTree/element/operation/operand/OperatorNode";

describe("ConnectedOperationNode Tests", () => {
    beforeEach(() => {
    });

    test("getCompletionContainer with empty ConnectedOperationNode, expected Empty", () => {
        // var operation: OperationNode = new OperationNode(null, null, null, [], IndexRange.create(0, 0, 0, 0));
        var connectOperation: ConnectedOperationNode = new ConnectedOperationNode([], [], IndexRange.create(0, 0, 0, 0));

        var positionParameter = Position.create(0, 0);

        var expected: CompletionState[] = [CompletionState.OperandMissing];
        var actual: CompletionState[] = connectOperation.getCompletionContainer(positionParameter).getStates();

        expect(actual).toEqual(expected);
    });

    test("getCompletionContainer with empty OperationNode and an empty OperationNode, expected Empty", () => {
        var operation: OperationNode = new OperationNode(null, null, null, [], IndexRange.create(0, 0, 0, 0));
        var connectOperation: ConnectedOperationNode = new ConnectedOperationNode([operation], [], IndexRange.create(0, 0, 0, 0));

        var positionParameter = Position.create(0, 0);

        var expected: CompletionState[] = [CompletionState.OperandMissing];
        var actual: CompletionState[] = connectOperation.getCompletionContainer(positionParameter).getStates();

        expect(actual).toEqual(expected);
    });

    test("getCompletionContainer with ConnectedOperationNode and OperationNode with only an Operand, expected Operator", () => {
        var leftOperand: OperandNode = new OperandNode(["Alter"], IndexRange.create(0, 0, 0, 5), "Decimal", "Alter");
        var operation = new OperationNode(leftOperand, null, null, [], IndexRange.create(0, 0, 0, 12));
        var connectOperation: ConnectedOperationNode = new ConnectedOperationNode([operation], [], IndexRange.create(0, 0, 0, 12));

        var positionParameter = Position.create(0, 13);

        var expected: CompletionState[] = [CompletionState.Operand];
        var actual: CompletionState[] = connectOperation.getCompletionContainer(positionParameter).getStates();

        expect(actual).toEqual(expected);
    });

    test("getCompletionContainer with ConnectedOperationNode and half full OperationNode, expected Operator", () => {
        var leftOperand: OperandNode = new OperandNode(["Alter"], IndexRange.create(0, 0, 0, 5), "Decimal", "Alter");
        var operator: OperatorNode = new OperatorNode(["gleich"], IndexRange.create(0, 6, 0, 12), "Boolean", "EQUALS", "Object");
        var operation = new OperationNode(leftOperand, operator, null, [], IndexRange.create(0, 0, 0, 12));
        var connectOperation: ConnectedOperationNode = new ConnectedOperationNode([operation], [], IndexRange.create(0, 0, 0, 12));

        var positionParameter = Position.create(0, 13);

        var expected: CompletionState[] = [CompletionState.Operator];
        var actual: CompletionState[] = connectOperation.getCompletionContainer(positionParameter).getStates();

        expect(actual).toEqual(expected);
    });

    test("getCompletionContainer with ConnectedOperationNode and full OperationNode, expected ConnectedOperation", () => {        
        var leftOperand: OperandNode = new OperandNode(["Alter"], IndexRange.create(0, 0, 0, 5), "Decimal", "Alter");
        var operator: OperatorNode = new OperatorNode(["gleich"], IndexRange.create(0, 6, 0, 12), "Boolean", "EQUALS", "Object");
        var rightOperand: OperandNode = new OperandNode(["18"], IndexRange.create(0, 13, 0, 15), "Decimal", "18.0");
        var operation = new OperationNode(leftOperand, operator, rightOperand, ["Alter gleich 18"], IndexRange.create(0, 0, 0, 15));

        var connectOperation: ConnectedOperationNode = new ConnectedOperationNode([operation], [], IndexRange.create(0, 0, 0, 15));

        var positionParameter = Position.create(0, 16);

        var expected: CompletionState[] = [CompletionState.OperationEnd];
        var actual: CompletionState[] = connectOperation.getCompletionContainer(positionParameter).getStates();

        expect(actual).toEqual(expected);
    });

    
    test("getCompletionContainer with ConnectedOperationNode and 2 OperationNodes and position after ConnectedOperation, expected ConnectedOperation", () => {        
        var leftOperand: OperandNode = new OperandNode(["Alter"], IndexRange.create(0, 0, 0, 5), "Decimal", "Alter");
        var operator: OperatorNode = new OperatorNode(["gleich"], IndexRange.create(0, 6, 0, 12), "Boolean", "EQUALS", "Object");
        var rightOperand: OperandNode = new OperandNode(["18"], IndexRange.create(0, 13, 0, 15), "Decimal", "18.0");
        var firstOperation = new OperationNode(leftOperand, operator, rightOperand, ["Alter gleich 18"], IndexRange.create(0, 0, 0, 15));
 
        var secleftOperand: OperandNode = new OperandNode(["Alter"], IndexRange.create(0, 19, 0, 25), "Decimal", "Alter");
        var secoperator: OperatorNode = new OperatorNode(["gleich"], IndexRange.create(0, 26, 0, 32), "Boolean", "EQUALS", "Object");
        var secrightOperand: OperandNode = new OperandNode(["18"], IndexRange.create(0, 33, 0, 35), "Decimal", "18.0");
        var secondOperation = new OperationNode(secleftOperand, secoperator, secrightOperand, ["UND  Alter gleich 18"], IndexRange.create(0, 16, 0, 35));

        var connectOperation: ConnectedOperationNode = new ConnectedOperationNode([firstOperation, secondOperation], [], IndexRange.create(0, 0, 0, 35));

        var positionParameter = Position.create(0, 36);

        var expected: CompletionState[] = [CompletionState.OperationEnd];
        var actual: CompletionState[] = connectOperation.getCompletionContainer(positionParameter).getStates();

        expect(actual).toEqual(expected);
    });

    test("getCompletionContainer with ConnectedOperationNode and 2 OperationNodes and position inside first Operation, expected Empty", () => {        
        var leftOperand: OperandNode = new OperandNode(["Alter"], IndexRange.create(0, 0, 0, 5), "Decimal", "Alter");
        var operator: OperatorNode = new OperatorNode(["gleich"], IndexRange.create(0, 6, 0, 12), "Boolean", "EQUALS", "Object");
        var rightOperand: OperandNode = new OperandNode(["18"], IndexRange.create(0, 13, 0, 15), "Decimal", "18.0");
        var firstOperation = new OperationNode(leftOperand, operator, rightOperand, ["Alter gleich 18"], IndexRange.create(0, 0, 0, 15));
 
        var secleftOperand: OperandNode = new OperandNode(["Alter"], IndexRange.create(0, 19, 0, 25), "Decimal", "Alter");
        var secoperator: OperatorNode = new OperatorNode(["gleich"], IndexRange.create(0, 26, 0, 32), "Boolean", "EQUALS", "Object");
        var secrightOperand: OperandNode = new OperandNode(["18"], IndexRange.create(0, 33, 0, 35), "Decimal", "18.0");
        var secondOperation = new OperationNode(secleftOperand, secoperator, secrightOperand, ["UND  Alter gleich 18"], IndexRange.create(0, 16, 0, 35));

        var connectOperation: ConnectedOperationNode = new ConnectedOperationNode([firstOperation, secondOperation], [], IndexRange.create(0, 0, 0, 35));

        var positionParameter = Position.create(0, 6);

        var expected: CompletionState[] = [];
        var actual: CompletionState[] = connectOperation.getCompletionContainer(positionParameter).getStates();

        expect(actual).toEqual(expected);
    });

    test("getCompletionContainer with ConnectedOperationNode and 2 OperationNodes and position inside second Operation, expected Empty", () => {        
        var leftOperand: OperandNode = new OperandNode(["Alter"], IndexRange.create(0, 0, 0, 5), "Decimal", "Alter");
        var operator: OperatorNode = new OperatorNode(["gleich"], IndexRange.create(0, 6, 0, 12), "Boolean", "EQUALS", "Object");
        var rightOperand: OperandNode = new OperandNode(["18"], IndexRange.create(0, 13, 0, 15), "Decimal", "18.0");
        var firstOperation = new OperationNode(leftOperand, operator, rightOperand, ["Alter gleich 18"], IndexRange.create(0, 0, 0, 15));
 
        var secleftOperand: OperandNode = new OperandNode(["Alter"], IndexRange.create(0, 19, 0, 25), "Decimal", "Alter");
        var secoperator: OperatorNode = new OperatorNode(["gleich"], IndexRange.create(0, 26, 0, 32), "Boolean", "EQUALS", "Object");
        var secrightOperand: OperandNode = new OperandNode(["18"], IndexRange.create(0, 33, 0, 35), "Decimal", "18.0");
        var secondOperation = new OperationNode(secleftOperand, secoperator, secrightOperand, ["UND  Alter gleich 18"], IndexRange.create(0, 16, 0, 35));

        var connectOperation: ConnectedOperationNode = new ConnectedOperationNode([firstOperation, secondOperation], [], IndexRange.create(0, 0, 0, 35));

        var positionParameter = Position.create(0, 32);

        var expected: CompletionState[] = [];
        var actual: CompletionState[] = connectOperation.getCompletionContainer(positionParameter).getStates();

        expect(actual).toEqual(expected);
    });

    test("getCompletionContainer with ConnectedOperationNode and 2 OperationNodes and one falsy OperationNode and position inside second Operation, expected Empty", () => {        
        var leftOperand: OperandNode = new OperandNode(["Alter"], IndexRange.create(0, 0, 0, 5), "Decimal", "Alter");
        var operator: OperatorNode = new OperatorNode(["gleich"], IndexRange.create(0, 6, 0, 12), "Boolean", "EQUALS", "Object");
        var firstOperation = new OperationNode(leftOperand, operator, null, ["Alter gleich 18"], IndexRange.create(0, 0, 0, 15));
 
        var secleftOperand: OperandNode = new OperandNode(["Alter"], IndexRange.create(0, 19, 0, 25), "Decimal", "Alter");
        var secoperator: OperatorNode = new OperatorNode(["gleich"], IndexRange.create(0, 26, 0, 32), "Boolean", "EQUALS", "Object");
        var secrightOperand: OperandNode = new OperandNode(["18"], IndexRange.create(0, 33, 0, 35), "Decimal", "18.0");
        var secondOperation = new OperationNode(secleftOperand, secoperator, secrightOperand, ["UND  Alter gleich 18"], IndexRange.create(0, 16, 0, 35));

        var connectOperation: ConnectedOperationNode = new ConnectedOperationNode([firstOperation, secondOperation], [], IndexRange.create(0, 0, 0, 35));

        var positionParameter = Position.create(0, 32);

        var expected: CompletionState[] = [];
        var actual: CompletionState[] = connectOperation.getCompletionContainer(positionParameter).getStates();

        expect(actual).toEqual(expected);
    });

    test("getCompletionContainer with ConnectedOperationNode and 2 OperationNodes and one falsy OperationNode and position after second Operation, expected Empty", () => {        
        var leftOperand: OperandNode = new OperandNode(["Alter"], IndexRange.create(0, 0, 0, 5), "Decimal", "Alter");
        var operator: OperatorNode = new OperatorNode(["gleich"], IndexRange.create(0, 6, 0, 12), "Boolean", "EQUALS", "Object");
        var firstOperation = new OperationNode(leftOperand, operator, null, ["Alter gleich 18"], IndexRange.create(0, 0, 0, 15));
 
        var secleftOperand: OperandNode = new OperandNode(["Alter"], IndexRange.create(0, 19, 0, 25), "Decimal", "Alter");
        var secoperator: OperatorNode = new OperatorNode(["gleich"], IndexRange.create(0, 26, 0, 32), "Boolean", "EQUALS", "Object");
        var secrightOperand: OperandNode = new OperandNode(["18"], IndexRange.create(0, 33, 0, 35), "Decimal", "18.0");
        var secondOperation = new OperationNode(secleftOperand, secoperator, secrightOperand, ["UND  Alter gleich 18"], IndexRange.create(0, 16, 0, 35));

        var connectOperation: ConnectedOperationNode = new ConnectedOperationNode([firstOperation, secondOperation], [], IndexRange.create(0, 0, 0, 35));

        var positionParameter = Position.create(0, 36);

        var expected: CompletionState[] = [CompletionState.OperationEnd];
        var actual: CompletionState[] = connectOperation.getCompletionContainer(positionParameter).getStates();

        expect(actual).toEqual(expected);
    });

    test("getCompletionContainer with ConnectedOperationNode and 2 OperationNodes and one falsy OperationNode and position before second Operation, expected Empty", () => {        
        var leftOperand: OperandNode = new OperandNode(["Alter"], IndexRange.create(0, 0, 0, 5), "Decimal", "Alter");
        var operator: OperatorNode = new OperatorNode(["gleich"], IndexRange.create(0, 6, 0, 12), "Boolean", "EQUALS", "Object");
        var firstOperation = new OperationNode(leftOperand, operator, null, ["Alter gleich 18"], IndexRange.create(0, 0, 0, 15));
 
        var secleftOperand: OperandNode = new OperandNode(["Alter"], IndexRange.create(0, 19, 0, 25), "Decimal", "Alter");
        var secoperator: OperatorNode = new OperatorNode(["gleich"], IndexRange.create(0, 26, 0, 32), "Boolean", "EQUALS", "Object");
        var secrightOperand: OperandNode = new OperandNode(["18"], IndexRange.create(0, 33, 0, 35), "Decimal", "18.0");
        var secondOperation = new OperationNode(secleftOperand, secoperator, secrightOperand, ["UND  Alter gleich 18"], IndexRange.create(0, 17, 0, 35));

        var connectOperation: ConnectedOperationNode = new ConnectedOperationNode([firstOperation, secondOperation], [], IndexRange.create(0, 0, 0, 35));

        var positionParameter = Position.create(0, 16);

        var expected: CompletionState[] = [CompletionState.Operator];
        var actual: CompletionState[] = connectOperation.getCompletionContainer(positionParameter).getStates();

        expect(actual).toEqual(expected);
    });

    test("getCompletionContainer with ConnectedOperationNode and 2 OperationNodes and one falsy OperationNode and position after second Operation, expected Operator", () => {        
        var leftOperand: OperandNode = new OperandNode(["Alter"], IndexRange.create(0, 0, 0, 5), "Decimal", "Alter");
        var operator: OperatorNode = new OperatorNode(["gleich"], IndexRange.create(0, 6, 0, 12), "Boolean", "EQUALS", "Object");
        var rightOperand: OperandNode = new OperandNode(["18"], IndexRange.create(0, 13, 0, 15), "Decimal", "18.0");
        var firstOperation = new OperationNode(leftOperand, operator, rightOperand, ["Alter gleich 18"], IndexRange.create(0, 0, 0, 15));
 
        var secleftOperand: OperandNode = new OperandNode(["Alter"], IndexRange.create(0, 19, 0, 25), "Decimal", "Alter");
        var secoperator: OperatorNode = new OperatorNode(["gleich"], IndexRange.create(0, 26, 0, 32), "Boolean", "EQUALS", "Object");
        var secondOperation = new OperationNode(secleftOperand, secoperator, null, ["UND  Alter gleich 18"], IndexRange.create(0, 17, 0, 35));

        var connectOperation: ConnectedOperationNode = new ConnectedOperationNode([firstOperation, secondOperation], [], IndexRange.create(0, 0, 0, 35));

        var positionParameter = Position.create(0, 36);

        var expected: CompletionState[] = [CompletionState.Operator];
        var actual: CompletionState[] = connectOperation.getCompletionContainer(positionParameter).getStates();

        expect(actual).toEqual(expected);
    });

    test("getCompletionContainer with ConnectedOperationNode and 2 OperationNodes and one falsy OperationNode and position after second Operation, expected Operator", () => {        
        var leftOperand: OperandNode = new OperandNode(["Alter"], IndexRange.create(0, 0, 0, 5), "Decimal", "Alter");
        var operator: OperatorNode = new OperatorNode(["gleich"], IndexRange.create(0, 6, 0, 12), "Boolean", "EQUALS", "Object");
        var rightOperand: OperandNode = new OperandNode(["18"], IndexRange.create(0, 13, 0, 15), "Decimal", "18.0");
        var firstOperation = new OperationNode(leftOperand, operator, rightOperand, ["Alter gleich 18"], IndexRange.create(0, 0, 0, 15));
 
        var secleftOperand: OperandNode = new OperandNode(["Alter"], IndexRange.create(0, 19, 0, 25), "Decimal", "Alter");
        var secondOperation = new OperationNode(secleftOperand, null, null, ["UND  Alter gleich 18"], IndexRange.create(0, 17, 0, 35));

        var connectOperation: ConnectedOperationNode = new ConnectedOperationNode([firstOperation, secondOperation], [], IndexRange.create(0, 0, 0, 35));

        var positionParameter = Position.create(0, 36);

        var expected: CompletionState[] = [CompletionState.Operand];
        var actual: CompletionState[] = connectOperation.getCompletionContainer(positionParameter).getStates();

        expect(actual).toEqual(expected);
    });
});