import "jest";
import { Position } from "vscode-languageserver";
import { AliasHelper } from "../../../src/aliases/AliasHelper";
import { OvDocument } from "../../../src/data-model/ov-document/OvDocument";
import { ActionErrorNode } from "../../../src/data-model/syntax-tree/element/ActionErrorNode";
import { CommentNode } from "../../../src/data-model/syntax-tree/element/CommentNode";
import { OperandNode } from "../../../src/data-model/syntax-tree/element/operation/operand/OperandNode";
import { OperatorNode } from "../../../src/data-model/syntax-tree/element/operation/operand/OperatorNode";
import { OperationNode } from "../../../src/data-model/syntax-tree/element/operation/OperationNode";
import { RuleNode } from "../../../src/data-model/syntax-tree/element/RuleNode";
import { VariableNameNode } from "../../../src/data-model/syntax-tree/element/VariableNameNode";
import { VariableNode } from "../../../src/data-model/syntax-tree/element/VariableNode";
import { GenericNode } from "../../../src/data-model/syntax-tree/GenericNode";
import { IndexPosition } from "../../../src/data-model/syntax-tree/IndexPosition";
import { IndexRange } from "../../../src/data-model/syntax-tree/IndexRange";
import { TestInitializer } from "../../TestInitializer";

describe("OvDocument Tests", () => {
  let aliasHelper: AliasHelper;
  let ovDocument: OvDocument;
  let testInitializer: TestInitializer;

  beforeEach(() => {
    testInitializer = new TestInitializer(true);
    aliasHelper = testInitializer.$server.aliasHelper;

    const tempDocument = testInitializer.$server.ovDocuments.get("test.ov");
    if (!!tempDocument) {
      ovDocument = tempDocument;
    } else {
      ovDocument = new OvDocument([], [], new AliasHelper());
    }
  });

  test("Create Empty OvDocument, expect no error", () => {
    const document = new OvDocument([], [], new AliasHelper());
    expect(document).not.toBeNull();
  });

  test("Create Empty OvDocument with initialized aliasHelper, expect no error", () => {
    const document = new OvDocument([], [], aliasHelper);
    expect(document).not.toBeNull();
  });

  test("Create Empty OvDocument with sample text, expect no error", () => {
    const document = new OvDocument([], [], aliasHelper);
    expect(document).not.toBeNull();
  });

  test("Create OvDocument with text and multiple AstElements, expect no error", () => {
    const document = new OvDocument(
      getListOfAllKnownAstElements(),
      [],
      aliasHelper
    );
    expect(document).not.toBeNull();
  });

  test("getStringByPosition, expect correct string", () => {
    const document = new OvDocument(
      getListOfAllKnownAstElements(),
      [],
      aliasHelper
    );
    expect(document).not.toBeNull();
  });

  test("getStringByPosition with correct created OvDocument, expect correct string", () => {
    const actual = ovDocument.getStringByPosition(Position.create(4, 9));
    const expected = "Minderjährig";

    expect(actual![0]).toEqual(expected);
  });

  function getListOfAllKnownAstElements(): GenericNode[] {
    return [getAstComment(), getAstElement(), getAstRule(), getAstVariable()];
  }

  function getDefaultRange(): IndexRange {
    return new IndexRange(new IndexPosition(0, 0), new IndexPosition(0, 0));
  }

  function getAstVariable(): VariableNode {
    return new VariableNode(
      new VariableNameNode(["Als Test"], IndexRange.create(0, 0, 0, 0), "Test"),
      new OperandNode(["Value"], getDefaultRange(), "", ""),
      ["Das ist ein Alter Test"],
      getDefaultRange()
    );
  }

  function getAstRule(): RuleNode {
    const tmpOperand = new OperandNode(["Value"], getDefaultRange(), "", "");
    const operator = new OperatorNode(
      ["KLEINER"],
      getDefaultRange(),
      "Boolean",
      "EQUALS",
      "String"
    );
    const operation = new OperationNode(
      tmpOperand,
      operator,
      tmpOperand,
      ["Operation"],
      getDefaultRange()
    );
    return new RuleNode(
      new ActionErrorNode(
        ["Dann Error"],
        IndexRange.create(0, 0, 0, 0),
        "Error"
      ),
      operation,
      ["Das ist ein Alter Test"],
      getDefaultRange()
    );
  }

  function getAstComment(): CommentNode {
    return new CommentNode(["Kommentar test"], getDefaultRange(), "test");
  }

  function getAstElement(): OperandNode {
    return new OperandNode(["Value"], getDefaultRange(), "", "");
  }
});
