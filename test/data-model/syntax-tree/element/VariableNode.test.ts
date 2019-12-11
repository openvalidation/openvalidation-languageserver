import "jest";
import { Position } from "vscode-languageserver";
import { ConnectedOperationNode } from "../../../../src/data-model/syntax-tree/element/operation/ConnectedOperationNode";
import { OperandNode } from "../../../../src/data-model/syntax-tree/element/operation/operand/OperandNode";
import { OperatorNode } from "../../../../src/data-model/syntax-tree/element/operation/operand/OperatorNode";
import { OperationNode } from "../../../../src/data-model/syntax-tree/element/operation/OperationNode";
import { VariableNameNode } from "../../../../src/data-model/syntax-tree/element/VariableNameNode";
import { VariableNode } from "../../../../src/data-model/syntax-tree/element/VariableNode";
import { GenericNode } from "../../../../src/data-model/syntax-tree/GenericNode";
import { IndexRange } from "../../../../src/data-model/syntax-tree/IndexRange";
import { EmptyTransition } from "../../../../src/provider/code-completion/states/EmptyTransition";
import { OperandTransition } from "../../../../src/provider/code-completion/states/OperandTransition";
import { OperatorTransition } from "../../../../src/provider/code-completion/states/OperatorTransition";
import { StateTransition } from "../../../../src/provider/code-completion/states/StateTransition";
import { TestInitializer } from "../../../Testinitializer";

describe("VariableNode Tests", () => {
  let initializer: TestInitializer;

  beforeEach(() => {
    initializer = new TestInitializer(true);
  });

  test("getCompletionContainer with empty VariableNode, expected OperandMissing", () => {
    const variableNameNode: VariableNameNode = new VariableNameNode(
      ["Als Test"],
      IndexRange.create(0, 1, 0, 9),
      "Test",
      IndexRange.create(0, 5, 0, 9)
    );
    const variable: VariableNode = new VariableNode(
      variableNameNode,
      null,
      [],
      IndexRange.create(0, 1, 0, 9)
    );

    const positionParameter = Position.create(0, 0);

    const actual: StateTransition[] = variable.getCompletionContainer(
      positionParameter
    ).$transitions;
    expect(actual[0]).toBeInstanceOf(OperandTransition);
  });

  test("getCompletionContainer with VariableNode and OperandNode, expected Operand", () => {
    const variableNameNode: VariableNameNode = new VariableNameNode(
      ["Als Test"],
      IndexRange.create(0, 7, 0, 15),
      "Test",
      IndexRange.create(0, 11, 0, 15)
    );

    const leftOperand: OperandNode = new OperandNode(
      ["Alter"],
      IndexRange.create(0, 0, 0, 5),
      "Decimal",
      "Alter"
    );
    const variable: VariableNode = new VariableNode(
      variableNameNode,
      leftOperand,
      ["Alter  Als Test"],
      IndexRange.create(0, 0, 0, "Alter  Als Test".length)
    );

    const positionParameter = Position.create(0, 6);

    const actual: StateTransition[] = variable.getCompletionContainer(
      positionParameter
    ).$transitions;
    expect(actual[0]).toBeInstanceOf(OperatorTransition);
  });

  test("getCompletionContainer with VariableNode and OperandNode and position after variable, expected Empty", () => {
    const variableNameNode: VariableNameNode = new VariableNameNode(
      ["Als Test"],
      IndexRange.create(0, 6, 0, 14),
      "Test",
      IndexRange.create(0, 10, 0, 14)
    );

    const leftOperand: OperandNode = new OperandNode(
      ["Alter"],
      IndexRange.create(0, 0, 0, 5),
      "Decimal",
      "Alter"
    );
    const variable: VariableNode = new VariableNode(
      variableNameNode,
      leftOperand,
      ["Alter  Als Test"],
      IndexRange.create(0, 0, 0, "Alter  Als Test".length)
    );

    const positionParameter = Position.create(0, 15);

    const actual: StateTransition[] = variable.getCompletionContainer(
      positionParameter
    ).$transitions;
    expect(actual[0]).toBeInstanceOf(EmptyTransition);
  });

  test("getCompletionContainer with VariableNode and ConnectedOperationNode and half full OperationNode, expected Operator", () => {
    const variableNameNode: VariableNameNode = new VariableNameNode(
      ["Als Test"],
      IndexRange.create(0, 14, 0, 22),
      "Test",
      IndexRange.create(0, 18, 0, 22)
    );

    const leftOperand: OperandNode = new OperandNode(
      ["Alter"],
      IndexRange.create(0, 0, 0, 5),
      "Decimal",
      "Alter"
    );
    const operator: OperatorNode = new OperatorNode(
      ["gleich"],
      IndexRange.create(0, 6, 0, 12),
      "Boolean",
      "EQUALS",
      "Object"
    );
    const operation = new OperationNode(
      leftOperand,
      operator,
      null,
      [],
      IndexRange.create(0, 0, 0, 12)
    );
    const connectOperation: ConnectedOperationNode = new ConnectedOperationNode(
      [operation],
      ["Alter gleich"],
      IndexRange.create(0, 0, 0, 12)
    );

    const variable: VariableNode = new VariableNode(
      variableNameNode,
      connectOperation,
      ["Alter gleich  Als Test"],
      IndexRange.create(0, 0, 0, "Alter gleich  Als Test".length)
    );

    const positionParameter = Position.create(0, 13);

    const actual: StateTransition[] = variable.getCompletionContainer(
      positionParameter
    ).$transitions;
    expect(actual[0]).toBeInstanceOf(OperandTransition);
  });

  test("getCompletionContainer with VariableNode and ConnectedOperationNode and half full OperationNode and position after variable, expected Empty", () => {
    const variableNameNode: VariableNameNode = new VariableNameNode(
      ["Als Test"],
      IndexRange.create(0, 10, 0, 22),
      "Test",
      IndexRange.create(0, 14, 0, 22)
    );

    const leftOperand: OperandNode = new OperandNode(
      ["Alter"],
      IndexRange.create(0, 0, 0, 5),
      "Decimal",
      "Alter"
    );
    const operator: OperatorNode = new OperatorNode(
      ["gleich"],
      IndexRange.create(0, 6, 0, 12),
      "Boolean",
      "EQUALS",
      "Object"
    );
    const operation = new OperationNode(
      leftOperand,
      operator,
      null,
      [],
      IndexRange.create(0, 0, 0, 12)
    );
    const connectOperation: ConnectedOperationNode = new ConnectedOperationNode(
      [operation],
      ["Alter gleich"],
      IndexRange.create(0, 0, 0, 12)
    );

    const variable: VariableNode = new VariableNode(
      variableNameNode,
      connectOperation,
      ["Alter gleich  Als Test"],
      IndexRange.create(0, 0, 0, "Alter gleich  Als Test".length)
    );

    const positionParameter = Position.create(0, 23);

    const actual: StateTransition[] = variable.getCompletionContainer(
      positionParameter
    ).$transitions;
    expect(actual[0]).toBeInstanceOf(EmptyTransition);
  });

  test("getCompletionContainer with VariableNode and ConnectedOperationNode and half full OperationNode, expected empty", () => {
    const leftOperand: OperandNode = new OperandNode(
      ["Alter"],
      IndexRange.create(0, 0, 0, 5),
      "Decimal",
      "Alter"
    );
    const operator: OperatorNode = new OperatorNode(
      ["gleich"],
      IndexRange.create(0, 6, 0, 12),
      "Boolean",
      "EQUALS",
      "Object"
    );
    const firstOperation = new OperationNode(
      leftOperand,
      operator,
      null,
      ["Alter gleich 18"],
      IndexRange.create(0, 0, 0, 15)
    );

    const secleftOperand: OperandNode = new OperandNode(
      ["Alter"],
      IndexRange.create(0, 19, 0, 25),
      "Decimal",
      "Alter"
    );
    const secoperator: OperatorNode = new OperatorNode(
      ["gleich"],
      IndexRange.create(0, 26, 0, 32),
      "Boolean",
      "EQUALS",
      "Object"
    );
    const secrightOperand: OperandNode = new OperandNode(
      ["18"],
      IndexRange.create(0, 33, 0, 35),
      "Decimal",
      "18.0"
    );
    const secondOperation = new OperationNode(
      secleftOperand,
      secoperator,
      secrightOperand,
      ["UND  Alter gleich 18"],
      IndexRange.create(0, 17, 0, 35)
    );

    const connectOperation: ConnectedOperationNode = new ConnectedOperationNode(
      [firstOperation, secondOperation],
      ["Alter gleich 18 UND  Alter gleich 18"],
      IndexRange.create(0, 0, 0, 35)
    );

    const variableNameNode: VariableNameNode = new VariableNameNode(
      ["Als Test"],
      IndexRange.create(0, 33, 0, 44),
      "Test",
      IndexRange.create(0, 37, 0, 44)
    );
    const variable: VariableNode = new VariableNode(
      variableNameNode,
      connectOperation,
      ["Alter gleich  Als Test"],
      IndexRange.create(0, 0, 0, 44)
    );

    const positionParameter = Position.create(0, 16);

    const actual: StateTransition[] = variable.getCompletionContainer(
      positionParameter
    ).$transitions;
    expect(actual[0]).toBeInstanceOf(OperandTransition);
  });

  test("getCompletionContainer with VariableNode and ConnectedOperationNode and half full OperationNode and position after variable, expected Operator", () => {
    const leftOperand: OperandNode = new OperandNode(
      ["Alter"],
      IndexRange.create(0, 0, 0, 5),
      "Decimal",
      "Alter"
    );
    const operator: OperatorNode = new OperatorNode(
      ["gleich"],
      IndexRange.create(0, 6, 0, 12),
      "Boolean",
      "EQUALS",
      "Object"
    );
    const firstOperation = new OperationNode(
      leftOperand,
      operator,
      null,
      ["Alter gleich 18"],
      IndexRange.create(0, 0, 0, 15)
    );

    const secleftOperand: OperandNode = new OperandNode(
      ["Alter"],
      IndexRange.create(0, 19, 0, 25),
      "Decimal",
      "Alter"
    );
    const secoperator: OperatorNode = new OperatorNode(
      ["gleich"],
      IndexRange.create(0, 26, 0, 32),
      "Boolean",
      "EQUALS",
      "Object"
    );
    const secrightOperand: OperandNode = new OperandNode(
      ["18"],
      IndexRange.create(0, 33, 0, 35),
      "Decimal",
      "18.0"
    );
    const secondOperation = new OperationNode(
      secleftOperand,
      secoperator,
      secrightOperand,
      ["UND  Alter gleich 18"],
      IndexRange.create(0, 16, 0, 35)
    );

    const connectOperation: ConnectedOperationNode = new ConnectedOperationNode(
      [firstOperation, secondOperation],
      ["Alter gleich 18 UND  Alter gleich 18"],
      IndexRange.create(0, 0, 0, 35)
    );

    const variableNameNode: VariableNameNode = new VariableNameNode(
      ["Als Test"],
      IndexRange.create(0, 32, 0, 44),
      "Test",
      IndexRange.create(0, 36, 0, 44)
    );
    const variable: VariableNode = new VariableNode(
      variableNameNode,
      connectOperation,
      ["Alter gleich  Als Test"],
      IndexRange.create(0, 0, 0, 44)
    );

    const positionParameter = Position.create(0, 45);

    const actual: StateTransition[] = variable.getCompletionContainer(
      positionParameter
    ).$transitions;
    expect(actual[0]).toBeInstanceOf(EmptyTransition);
  });

  test("VariableNode get/set value/nameNode test", () => {
    const variableNode: VariableNode = new VariableNode(
      null,
      null,
      ["Wenn Alter gleich 18  Dann "],
      IndexRange.create(0, 0, 0, 27)
    );

    const leftOperand: OperandNode = new OperandNode(
      ["Alter"],
      IndexRange.create(0, 5, 0, 10),
      "Decimal",
      "Alter"
    );
    const operator: OperatorNode = new OperatorNode(
      ["gleich"],
      IndexRange.create(0, 11, 0, 17),
      "Boolean",
      "EQUALS",
      "Object"
    );
    const rightOperand: OperandNode = new OperandNode(
      ["18"],
      IndexRange.create(0, 18, 0, 20),
      "Decimal",
      "18.0"
    );
    const operation = new OperationNode(
      leftOperand,
      operator,
      rightOperand,
      ["Alter gleich 18"],
      IndexRange.create(0, 5, 0, 20)
    );
    variableNode.$value = operation;

    const variableNameNode: VariableNameNode = new VariableNameNode(
      ["Als Test"],
      IndexRange.create(0, 0, 0, 15),
      "Test",
      IndexRange.create(0, 7, 0, 15)
    );
    variableNode.$nameNode = variableNameNode;

    expect(variableNode.$value).toEqual(operation);
    expect(variableNode.$nameNode).toEqual(variableNameNode);
  });
  test("getChildren without child, expect no children", () => {
    const variable: VariableNode = new VariableNode(
      null,
      null,
      [" Als Test"],
      IndexRange.create(0, 0, 0, " Als Test".length)
    );

    const actual: GenericNode[] = variable.getChildren();
    const expected: GenericNode[] = [];

    expect(actual).toEqual(expected);
  });

  test("getChildren with one child, expect one child", () => {
    const variableNameNode: VariableNameNode = new VariableNameNode(
      ["Als Test"],
      IndexRange.create(0, 0, 0, 15),
      "Test",
      IndexRange.create(0, 7, 0, 15)
    );

    const leftOperand: OperandNode = new OperandNode(
      ["Alter"],
      IndexRange.create(0, 0, 0, 5),
      "Decimal",
      "Alter"
    );
    const operator: OperatorNode = new OperatorNode(
      ["gleich"],
      IndexRange.create(0, 6, 0, 12),
      "Boolean",
      "EQUALS",
      "Object"
    );
    const rightOperand: OperandNode = new OperandNode(
      ["18"],
      IndexRange.create(0, 13, 0, 15),
      "Decimal",
      "18"
    );
    const operation = new OperationNode(
      leftOperand,
      operator,
      rightOperand,
      ["Alter gleich 18"],
      IndexRange.create(0, 0, 0, 15)
    );

    const variable: VariableNode = new VariableNode(
      variableNameNode,
      operation,
      ["Alter gleich 18  Als Test"],
      IndexRange.create(0, 0, 0, "Alter  Als Test".length)
    );

    const actual: GenericNode[] = variable.getChildren();
    const expected: GenericNode[] = [operation, variableNameNode];

    expect(actual).toEqual(expected);
  });

  test("getHoverContent without content, expect not empty content", () => {
    const variable: VariableNode = new VariableNode(
      null,
      null,
      ["Alter  Als Test"],
      IndexRange.create(0, 0, 0, "Alter  Als Test".length)
    );

    const actual = variable.getHoverContent();

    expect(actual).not.toBeNull();
  });

  test("getHoverContent with content which is incomplete, expect not empty content", () => {
    const variableNameNode: VariableNameNode = new VariableNameNode(
      ["Als Test"],
      IndexRange.create(0, 0, 0, 15),
      "Test",
      IndexRange.create(0, 7, 0, 15)
    );

    const leftOperand: OperandNode = new OperandNode(
      ["Alter"],
      IndexRange.create(0, 0, 0, 5),
      "Decimal",
      "Alter"
    );
    const variable: VariableNode = new VariableNode(
      variableNameNode,
      leftOperand,
      ["Alter  Als Test"],
      IndexRange.create(0, 0, 0, "Alter  Als Test".length)
    );

    const actual = variable.getHoverContent();

    expect(actual).not.toBeNull();
  });

  test("getHoverContent with content which is complete, expect not empty content", () => {
    const variableNameNode: VariableNameNode = new VariableNameNode(
      ["Als Test"],
      IndexRange.create(0, 0, 0, 15),
      "Test",
      IndexRange.create(0, 7, 0, 15)
    );

    const leftOperand: OperandNode = new OperandNode(
      ["Alter"],
      IndexRange.create(0, 0, 0, 5),
      "Decimal",
      "Alter"
    );
    const operator: OperatorNode = new OperatorNode(
      ["gleich"],
      IndexRange.create(0, 6, 0, 12),
      "Boolean",
      "EQUALS",
      "Object"
    );
    const rightOperand: OperandNode = new OperandNode(
      ["18"],
      IndexRange.create(0, 13, 0, 15),
      "Decimal",
      "18"
    );
    const operation = new OperationNode(
      leftOperand,
      operator,
      rightOperand,
      ["Alter gleich 18"],
      IndexRange.create(0, 0, 0, 15)
    );

    const variable: VariableNode = new VariableNode(
      variableNameNode,
      operation,
      ["Alter gleich 18  Als Test"],
      IndexRange.create(0, 0, 0, "Alter  Als Test".length)
    );

    const actual = variable.getHoverContent();

    expect(actual).not.toBeNull();
  });

  test("getBeautifiedContent without children, expect not empty content", () => {
    const variable: VariableNode = new VariableNode(
      null,
      null,
      [" As Test"],
      IndexRange.create(0, 0, 0, "Alter  Als Test".length)
    );

    const actual = variable.getBeautifiedContent(
      initializer.$server.getAliasHelper()
    );

    expect(actual).toEqual(" As Test");
  });

  test("getBeautifiedContent with children, expect not empty content", () => {
    const variableNameNode: VariableNameNode = new VariableNameNode(
      ["Als Test"],
      IndexRange.create(0, 0, 0, 15),
      "Test",
      IndexRange.create(0, 7, 0, 15)
    );

    const leftOperand: OperandNode = new OperandNode(
      ["Alter"],
      IndexRange.create(0, 0, 0, 5),
      "Decimal",
      "Alter"
    );
    const variable: VariableNode = new VariableNode(
      variableNameNode,
      leftOperand,
      ["Alter  As Test"],
      IndexRange.create(0, 0, 0, "Alter  Als Test".length)
    );

    const actual = variable.getBeautifiedContent(
      initializer.$server.getAliasHelper()
    );

    expect(actual).toEqual("   Alter\nAs Test");
  });
});
