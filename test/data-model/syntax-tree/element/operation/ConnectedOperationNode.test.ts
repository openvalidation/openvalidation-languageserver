import "jest";
import { Position } from "vscode-languageserver";
import { IndexRange } from "../../../../../src/data-model/syntax-tree/IndexRange";
import { ConnectedOperationNode } from "../../../../../src/data-model/syntax-tree/element/operation/ConnectedOperationNode";
import { OperationNode } from "../../../../../src/data-model/syntax-tree/element/operation/OperationNode";
import { OperandNode } from "../../../../../src/data-model/syntax-tree/element/operation/operand/OperandNode";
import { OperatorNode } from "../../../../../src/data-model/syntax-tree/element/operation/operand/OperatorNode";
import { OperandTransition } from "../../../../../src/provider/code-completion/states/OperandTransition";
import { StateTransition } from "../../../../../src/provider/code-completion/states/StateTransition";
import { OperatorTransition } from "../../../../../src/provider/code-completion/states/OperatorTransition";
import { ConnectionTransition } from "../../../../../src/provider/code-completion/states/ConnectionTransition";
import { EmptyTransition } from "../../../../../src/provider/code-completion/states/EmptyTransition";

describe("ConnectedOperationNode Tests", () => {
    beforeEach(() => {
    });

    test("getCompletionContainer with empty ConnectedOperationNode, expected Empty", () => {
        // var operation: OperationNode = new OperationNode(null, null, null, [], IndexRange.create(0, 0, 0, 0));
        var connectOperation: ConnectedOperationNode = new ConnectedOperationNode([], [], IndexRange.create(0, 0, 0, 0));

        var positionParameter = Position.create(0, 0);

        var actual: StateTransition[] = connectOperation.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(OperandTransition);
    });

    test("getCompletionContainer with empty OperationNode and an empty OperationNode, expected Empty", () => {
        var operation: OperationNode = new OperationNode(null, null, null, [], IndexRange.create(0, 0, 0, 0));
        var connectOperation: ConnectedOperationNode = new ConnectedOperationNode([operation], [], IndexRange.create(0, 0, 0, 0));

        var positionParameter = Position.create(0, 0);

        var actual: StateTransition[] = connectOperation.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(OperandTransition);
    });

    test("getCompletionContainer with ConnectedOperationNode and OperationNode with only an Operand, expected Operator", () => {
        var leftOperand: OperandNode = new OperandNode(["Alter"], IndexRange.create(0, 0, 0, 5), "Decimal", "Alter");
        var operation = new OperationNode(leftOperand, null, null, [], IndexRange.create(0, 0, 0, 12));
        var connectOperation: ConnectedOperationNode = new ConnectedOperationNode([operation], [], IndexRange.create(0, 0, 0, 12));

        var positionParameter = Position.create(0, 13);

        var actual: StateTransition[] = connectOperation.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(OperatorTransition);
    });

    test("getCompletionContainer with ConnectedOperationNode and half full OperationNode, expected Operator", () => {
        var leftOperand: OperandNode = new OperandNode(["Alter"], IndexRange.create(0, 0, 0, 5), "Decimal", "Alter");
        var operator: OperatorNode = new OperatorNode(["gleich"], IndexRange.create(0, 6, 0, 12), "Boolean", "EQUALS", "Object");
        var operation = new OperationNode(leftOperand, operator, null, [], IndexRange.create(0, 0, 0, 12));
        var connectOperation: ConnectedOperationNode = new ConnectedOperationNode([operation], [], IndexRange.create(0, 0, 0, 12));

        var positionParameter = Position.create(0, 13);

        var actual: StateTransition[] = connectOperation.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(OperandTransition);
    });

    test("getCompletionContainer with ConnectedOperationNode and full OperationNode, expected ConnectedOperation", () => {        
        var leftOperand: OperandNode = new OperandNode(["Alter"], IndexRange.create(0, 0, 0, 5), "Decimal", "Alter");
        var operator: OperatorNode = new OperatorNode(["gleich"], IndexRange.create(0, 6, 0, 12), "Boolean", "EQUALS", "Object");
        var rightOperand: OperandNode = new OperandNode(["18"], IndexRange.create(0, 13, 0, 15), "Decimal", "18.0");
        var operation = new OperationNode(leftOperand, operator, rightOperand, ["Alter gleich 18"], IndexRange.create(0, 0, 0, 15));

        var connectOperation: ConnectedOperationNode = new ConnectedOperationNode([operation], [], IndexRange.create(0, 0, 0, 15));

        var positionParameter = Position.create(0, 16);

        var actual: StateTransition[] = connectOperation.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(ConnectionTransition);
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

        var actual: StateTransition[] = connectOperation.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(ConnectionTransition);
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

        var actual: StateTransition[] = connectOperation.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(EmptyTransition);
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

        var actual: StateTransition[] = connectOperation.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(EmptyTransition);
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

        var actual: StateTransition[] = connectOperation.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(EmptyTransition);
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

        var actual: StateTransition[] = connectOperation.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(ConnectionTransition);
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

        var actual: StateTransition[] = connectOperation.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(OperandTransition);
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

        var actual: StateTransition[] = connectOperation.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(OperandTransition);
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

        var actual: StateTransition[] = connectOperation.getCompletionContainer(positionParameter).$transitions;
        expect(actual[0]).toBeInstanceOf(OperatorTransition);
    });
});