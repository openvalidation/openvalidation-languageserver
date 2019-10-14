import "jest";
import { Position } from "vscode-languageserver-types";
import { ActionErrorNode } from "../../../../src/data-model/syntax-tree/element/ActionErrorNode";
import { ConnectedOperationNode } from "../../../../src/data-model/syntax-tree/element/operation/ConnectedOperationNode";
import { OperandNode } from "../../../../src/data-model/syntax-tree/element/operation/operand/OperandNode";
import { OperatorNode } from "../../../../src/data-model/syntax-tree/element/operation/operand/OperatorNode";
import { OperationNode } from "../../../../src/data-model/syntax-tree/element/operation/OperationNode";
import { RuleNode } from "../../../../src/data-model/syntax-tree/element/RuleNode";
import { GenericNode } from "../../../../src/data-model/syntax-tree/GenericNode";
import { IndexRange } from "../../../../src/data-model/syntax-tree/IndexRange";
import { ConnectionTransition } from "../../../../src/provider/code-completion/states/ConnectionTransition";
import { EmptyTransition } from "../../../../src/provider/code-completion/states/EmptyTransition";
import { OperandTransition } from "../../../../src/provider/code-completion/states/OperandTransition";
import { StateTransition } from "../../../../src/provider/code-completion/states/StateTransition";
import { ThenKeywordTransition } from "../../../../src/provider/code-completion/states/ThenKeywordTransition";
import { TestInitializer } from "../../../Testinitializer";

describe("RuleNode Tests", () => {
  let initializer: TestInitializer;

  beforeEach(() => {
    initializer = new TestInitializer(true);
  });

  test("getCompletionContainer with empty RuleNode, expected RuleStart", () => {
    const rule: RuleNode = new RuleNode(
      null,
      null,
      ["Wenn"],
      IndexRange.create(0, 0, 0, 4)
    );

    const positionParameter = Position.create(0, 5);

    const actual: StateTransition[] = rule.getCompletionContainer(
      positionParameter
    ).$transitions;
    expect(actual[0]).toBeInstanceOf(OperandTransition);
  });

  test("getCompletionContainer with empty Operation, expected RuleStart", () => {
    const operation: OperationNode = new OperationNode(
      null,
      null,
      null,
      [],
      IndexRange.create(0, 4, 0, 4)
    );
    const rule: RuleNode = new RuleNode(
      null,
      operation,
      ["Wenn"],
      IndexRange.create(0, 0, 0, 4)
    );

    const positionParameter = Position.create(0, 5);

    const actual: StateTransition[] = rule.getCompletionContainer(
      positionParameter
    ).$transitions;
    expect(actual[0]).toBeInstanceOf(OperandTransition);
  });

  test("getCompletionContainer with complete Operation but invalid position, expected Empty State", () => {
    const leftOperand: OperandNode = new OperandNode(
      ["Alte"],
      IndexRange.create(0, 6, 0, 10),
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
      IndexRange.create(0, 6, 0, 20)
    );

    const rule: RuleNode = new RuleNode(
      null,
      operation,
      ["Wenn  Alte gleich 18"],
      IndexRange.create(0, 0, 0, 20)
    );

    const positionParameter = Position.create(0, 5);

    const actual: StateTransition[] = rule.getCompletionContainer(
      positionParameter
    ).$transitions;
    expect(actual[0]).toBeInstanceOf(EmptyTransition);
  });

  test("getCompletionContainer with complete Operation, expected ConnectedOperation and RuleEnd", () => {
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

    const rule: RuleNode = new RuleNode(
      null,
      operation,
      ["Wenn Alter gleich 18"],
      IndexRange.create(0, 0, 0, 20)
    );

    const positionParameter = Position.create(0, 21);

    const actual: StateTransition[] = rule.getCompletionContainer(
      positionParameter
    ).$transitions;
    expect(actual[0]).toBeInstanceOf(ConnectionTransition);
    expect(actual[1]).toBeInstanceOf(ThenKeywordTransition);
  });

  test("getCompletionContainer with complete Operation and empty message, expected Emptylist", () => {
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

    const actionNode = new ActionErrorNode(
      ["Dann "],
      IndexRange.create(0, 0, 0, 21),
      ""
    );
    const rule: RuleNode = new RuleNode(
      actionNode,
      operation,
      ["Wenn Alter gleich 18 Dann "],
      IndexRange.create(0, 0, 0, 26)
    );

    const positionParameter = Position.create(0, 27);

    const actual: StateTransition[] = rule.getCompletionContainer(
      positionParameter
    ).$transitions;
    expect(actual[0]).toBeInstanceOf(EmptyTransition);
  });

  test("getCompletionContainer with complete Operation and empty message with position before message, expected ConnectedOperation", () => {
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

    const actionNode = new ActionErrorNode(
      ["Dann "],
      IndexRange.create(0, 22, 0, 27),
      ""
    );
    const rule: RuleNode = new RuleNode(
      actionNode,
      operation,
      ["Wenn Alter gleich 18  Dann "],
      IndexRange.create(0, 0, 0, 27)
    );

    const positionParameter = Position.create(0, 21);

    const actual: StateTransition[] = rule.getCompletionContainer(
      positionParameter
    ).$transitions;
    expect(actual[0]).toBeInstanceOf(ConnectionTransition);
  });

  test("getCompletionContainer with complete Operation and with position before condition, expected empty list", () => {
    const leftOperand: OperandNode = new OperandNode(
      ["Alte"],
      IndexRange.create(0, 6, 0, 10),
      "Decimal",
      "Alte"
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

    const actionNode = new ActionErrorNode(
      ["Dann "],
      IndexRange.create(0, 22, 0, 27),
      ""
    );
    const rule: RuleNode = new RuleNode(
      actionNode,
      operation,
      ["Wenn  Alte gleich 18  Dann "],
      IndexRange.create(0, 0, 0, 27)
    );

    const positionParameter = Position.create(0, 5);

    const actual: StateTransition[] = rule.getCompletionContainer(
      positionParameter
    ).$transitions;
    expect(actual[0]).toBeInstanceOf(EmptyTransition);
  });

  test("getCompletionContainer of constrained rule, expected empty list", () => {
    const leftOperand: OperandNode = new OperandNode(
      ["Alte"],
      IndexRange.create(0, 0, 0, 5),
      "Decimal",
      "Alte"
    );
    const operator: OperatorNode = new OperatorNode(
      ["muss kleiner"],
      IndexRange.create(0, 6, 0, 18),
      "Boolean",
      "LESS_THAN",
      "Decimal"
    );
    const operation = new OperationNode(
      leftOperand,
      operator,
      null,
      ["Alter muss kleiner "],
      IndexRange.create(0, 0, 0, 18)
    );
    operation.$constrained = true;

    const actionNode = new ActionErrorNode(
      ["Alter muss kleiner "],
      IndexRange.create(0, 22, 0, 27),
      ""
    );
    const rule: RuleNode = new RuleNode(
      actionNode,
      operation,
      ["Alter muss kleiner "],
      IndexRange.create(0, 0, 0, 27)
    );

    const positionParameter = Position.create(0, 19);

    const actual: StateTransition[] = rule.getCompletionContainer(
      positionParameter
    ).$transitions;
    expect(actual[0]).toBeInstanceOf(OperandTransition);
  });

  test("getCompletionContainer with ConnectedOperation and with position after action, expected empty list", () => {
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
    const firstOperation = new OperationNode(
      leftOperand,
      operator,
      rightOperand,
      ["Alter gleich 18"],
      IndexRange.create(0, 5, 0, 20)
    );

    const secleftOperand: OperandNode = new OperandNode(
      ["Alter"],
      IndexRange.create(0, 24, 0, 30),
      "Decimal",
      "Alter"
    );
    const secoperator: OperatorNode = new OperatorNode(
      ["gleich"],
      IndexRange.create(0, 31, 0, 37),
      "Boolean",
      "EQUALS",
      "Object"
    );
    const secrightOperand: OperandNode = new OperandNode(
      ["18"],
      IndexRange.create(0, 38, 0, 40),
      "Decimal",
      "18.0"
    );
    const secondOperation = new OperationNode(
      secleftOperand,
      secoperator,
      secrightOperand,
      ["UND  Alter gleich 18"],
      IndexRange.create(0, 21, 0, 40)
    );

    const connectOperation: ConnectedOperationNode = new ConnectedOperationNode(
      [firstOperation, secondOperation],
      ["Alter gleich 18 UND Alter gleich 18"],
      IndexRange.create(0, 5, 0, 40)
    );

    const actionNode = new ActionErrorNode(
      ["Dann "],
      IndexRange.create(0, 41, 0, 46),
      ""
    );
    const rule: RuleNode = new RuleNode(
      actionNode,
      connectOperation,
      ["Wenn Alter gleich 18 UND Alter gleich 18 Dann "],
      IndexRange.create(0, 0, 0, 46)
    );

    const positionParameter = Position.create(0, 47);

    const actual: StateTransition[] = rule.getCompletionContainer(
      positionParameter
    ).$transitions;
    expect(actual[0]).toBeInstanceOf(EmptyTransition);
  });
  test("getCompletionContainer with ConnectedOperation and with position before action, expected empty list", () => {
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
    const firstOperation = new OperationNode(
      leftOperand,
      operator,
      rightOperand,
      ["Alter gleich 18"],
      IndexRange.create(0, 5, 0, 20)
    );

    const secleftOperand: OperandNode = new OperandNode(
      ["Alter"],
      IndexRange.create(0, 24, 0, 30),
      "Decimal",
      "Alter"
    );
    const secoperator: OperatorNode = new OperatorNode(
      ["gleich"],
      IndexRange.create(0, 31, 0, 37),
      "Boolean",
      "EQUALS",
      "Object"
    );
    const secrightOperand: OperandNode = new OperandNode(
      ["18"],
      IndexRange.create(0, 38, 0, 40),
      "Decimal",
      "18.0"
    );
    const secondOperation = new OperationNode(
      secleftOperand,
      secoperator,
      secrightOperand,
      ["UND  Alter gleich 18"],
      IndexRange.create(0, 21, 0, 40)
    );

    const connectOperation: ConnectedOperationNode = new ConnectedOperationNode(
      [firstOperation, secondOperation],
      ["Alter gleich 18 UND Alter gleich 18 "],
      IndexRange.create(0, 5, 0, 40)
    );

    const actionNode = new ActionErrorNode(
      ["Dann "],
      IndexRange.create(0, 42, 0, 46),
      ""
    );
    const rule: RuleNode = new RuleNode(
      actionNode,
      connectOperation,
      ["Wenn Alter gleich 18 UND Alter gleich 18 Dann "],
      IndexRange.create(0, 0, 0, 46)
    );

    const positionParameter = Position.create(0, 41);

    const actual: StateTransition[] = rule.getCompletionContainer(
      positionParameter
    ).$transitions;
    expect(actual[0]).toBeInstanceOf(ConnectionTransition);
  });

  test("getCompletionContainer with ConnectedOperation and with position before second operation, expected empty list", () => {
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
    const firstOperation = new OperationNode(
      leftOperand,
      operator,
      rightOperand,
      ["Alter gleich 18"],
      IndexRange.create(0, 5, 0, 20)
    );

    const secleftOperand: OperandNode = new OperandNode(
      ["Alter"],
      IndexRange.create(0, 24, 0, 30),
      "Decimal",
      "Alter"
    );
    const secoperator: OperatorNode = new OperatorNode(
      ["gleich"],
      IndexRange.create(0, 31, 0, 37),
      "Boolean",
      "EQUALS",
      "Object"
    );
    const secrightOperand: OperandNode = new OperandNode(
      ["18"],
      IndexRange.create(0, 38, 0, 40),
      "Decimal",
      "18.0"
    );
    const secondOperation = new OperationNode(
      secleftOperand,
      secoperator,
      secrightOperand,
      ["UND  Alter gleich 18"],
      IndexRange.create(0, 22, 0, 40)
    );

    const connectOperation: ConnectedOperationNode = new ConnectedOperationNode(
      [firstOperation, secondOperation],
      ["Alter gleich 18 UND Alter gleich 18 "],
      IndexRange.create(0, 5, 0, 40)
    );

    const actionNode = new ActionErrorNode(
      ["Dann "],
      IndexRange.create(0, 42, 0, 46),
      ""
    );
    const rule: RuleNode = new RuleNode(
      actionNode,
      connectOperation,
      ["Wenn Alter gleich 18 UND Alter gleich 18 Dann "],
      IndexRange.create(0, 0, 0, 46)
    );

    const positionParameter = Position.create(0, 21);

    const actual: StateTransition[] = rule.getCompletionContainer(
      positionParameter
    ).$transitions;
    expect(actual[0]).toBeInstanceOf(ConnectionTransition);
  });

  test("getCompletionContainer with ConnectedOperation and with position right after connector of second operation, expected empty list", () => {
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
    const firstOperation = new OperationNode(
      leftOperand,
      operator,
      rightOperand,
      ["Alter gleich 18"],
      IndexRange.create(0, 5, 0, 20)
    );

    const secleftOperand: OperandNode = new OperandNode(
      ["Alter"],
      IndexRange.create(0, 27, 0, 30),
      "Decimal",
      "Alter"
    );
    const secoperator: OperatorNode = new OperatorNode(
      ["gleich"],
      IndexRange.create(0, 31, 0, 37),
      "Boolean",
      "EQUALS",
      "Object"
    );
    const secrightOperand: OperandNode = new OperandNode(
      ["18"],
      IndexRange.create(0, 38, 0, 40),
      "Decimal",
      "18.0"
    );
    const secondOperation = new OperationNode(
      secleftOperand,
      secoperator,
      secrightOperand,
      ["UND  Alter gleich 18"],
      IndexRange.create(0, 22, 0, 40)
    );

    const connectOperation: ConnectedOperationNode = new ConnectedOperationNode(
      [firstOperation, secondOperation],
      ["Alter gleich 18 UND Alter gleich 18 "],
      IndexRange.create(0, 5, 0, 40)
    );

    const actionNode = new ActionErrorNode(
      ["Dann "],
      IndexRange.create(0, 42, 0, 46),
      ""
    );
    const rule: RuleNode = new RuleNode(
      actionNode,
      connectOperation,
      ["Wenn Alter gleich 18 UND  Alter gleich 18 Dann "],
      IndexRange.create(0, 0, 0, 46)
    );

    const positionParameter = Position.create(0, 26);

    const actual: StateTransition[] = rule.getCompletionContainer(
      positionParameter
    ).$transitions;
    expect(actual[0]).toBeInstanceOf(EmptyTransition);
  });

  test("RuleNode get/set errorNode/condition test", () => {
    const ruleNode: RuleNode = new RuleNode(
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
    ruleNode.$condition = operation;

    const actionNode = new ActionErrorNode(
      ["Dann "],
      IndexRange.create(0, 22, 0, 27),
      ""
    );
    ruleNode.$errorNode = actionNode;

    expect(ruleNode.$condition).toEqual(operation);
    expect(ruleNode.$errorNode).toEqual(actionNode);
  });

  test("getChildren without child, expect no children", () => {
    const errorMessage: string = "This is an error";
    const ruleNode: RuleNode = new RuleNode(
      null,
      null,
      [errorMessage],
      IndexRange.create(0, 0, 0, errorMessage.length)
    );

    const actual: GenericNode[] = ruleNode.getChildren();
    const expected: GenericNode[] = [];

    expect(actual).toEqual(expected);
  });

  test("getChildren with one child, expect one child", () => {
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

    const actionNode = new ActionErrorNode(
      ["Dann "],
      IndexRange.create(0, 22, 0, 27),
      ""
    );
    const ruleNode: RuleNode = new RuleNode(
      actionNode,
      operation,
      ["Wenn Alter gleich 18  Dann "],
      IndexRange.create(0, 0, 0, 27)
    );

    const actual: GenericNode[] = ruleNode.getChildren();
    const expected: GenericNode[] = [operation];

    expect(actual).toEqual(expected);
  });

  test("getHoverContent without content, expect not empty content", () => {
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

    const actionNode = new ActionErrorNode(
      ["Dann "],
      IndexRange.create(0, 22, 0, 27),
      ""
    );
    const ruleNode: RuleNode = new RuleNode(
      actionNode,
      operation,
      ["Wenn Alter gleich 18  Dann "],
      IndexRange.create(0, 0, 0, 27)
    );

    const actual = ruleNode.getHoverContent();

    expect(actual).not.toBeNull();
  });
  test("getHoverContent with content which is incomplete, expect not empty content", () => {
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
    const operation = new OperationNode(
      leftOperand,
      operator,
      null,
      ["Alter gleich 18"],
      IndexRange.create(0, 5, 0, 20)
    );

    const actionNode = new ActionErrorNode(
      ["Dann "],
      IndexRange.create(0, 22, 0, 27),
      ""
    );
    const ruleNode: RuleNode = new RuleNode(
      actionNode,
      operation,
      ["Wenn Alter gleich 18  Dann "],
      IndexRange.create(0, 0, 0, 27)
    );

    const actual = ruleNode.getHoverContent();

    expect(actual).not.toBeNull();
  });

  test("getHoverContent with content which is complete, expect not empty content", () => {
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

    const actionNode = new ActionErrorNode(
      ["Dann "],
      IndexRange.create(0, 22, 0, 27),
      ""
    );
    const ruleNode: RuleNode = new RuleNode(
      actionNode,
      operation,
      ["Wenn Alter gleich 18  Dann "],
      IndexRange.create(0, 0, 0, 27)
    );

    const actual = ruleNode.getHoverContent();

    expect(actual).not.toBeNull();
  });

  test("getBeautifiedContent without children, expect not empty content", () => {
    const ruleNode: RuleNode = new RuleNode(
      null,
      null,
      ["If  Then "],
      IndexRange.create(0, 0, 0, 27)
    );

    const actual = ruleNode.getBeautifiedContent(
      initializer.$server.aliasHelper
    );

    expect(actual).toEqual("If  Then ");
  });

  test("getBeautifiedContent with children, expect not empty content", () => {
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
      ["age equals 18"],
      IndexRange.create(0, 5, 0, 20)
    );

    const actionNode = new ActionErrorNode(
      ["Dann "],
      IndexRange.create(0, 22, 0, 27),
      ""
    );
    const ruleNode: RuleNode = new RuleNode(
      actionNode,
      operation,
      ["If age equals 18 Then "],
      IndexRange.create(0, 0, 0, 27)
    );

    const actual = ruleNode.getBeautifiedContent(
      initializer.$server.aliasHelper
    );

    expect(actual).toEqual("  If age equals 18\nThen\n");
  });
});
