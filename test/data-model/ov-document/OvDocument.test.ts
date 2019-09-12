import "jest";
import { Position } from "vscode-languageserver";
import { AliasHelper } from "../../../src/aliases/AliasHelper";
import { OvDocument } from "../../../src/data-model/ov-document/OvDocument";
import { CommentNode } from "../../../src/rest-interface/intelliSenseTree/element/CommentNode";
import { OperandNode } from "../../../src/rest-interface/intelliSenseTree/element/operation/operand/OperandNode";
import { OperatorNode } from "../../../src/rest-interface/intelliSenseTree/element/operation/operand/OperatorNode";
import { OperationNode } from "../../../src/rest-interface/intelliSenseTree/element/operation/OperationNode";
import { RuleNode } from "../../../src/rest-interface/intelliSenseTree/element/RuleNode";
import { VariableNode } from "../../../src/rest-interface/intelliSenseTree/element/VariableNode";
import { GenericNode } from "../../../src/rest-interface/intelliSenseTree/GenericNode";
import { IndexPosition } from "../../../src/rest-interface/intelliSenseTree/IndexPosition";
import { IndexRange } from "../../../src/rest-interface/intelliSenseTree/IndexRange";
import { TestInitializer } from "../../TestInitializer";

describe("OvDocument Tests", () => {
    var aliasHelper: AliasHelper;
    var ovDocument: OvDocument;
    var testInitializer: TestInitializer;

    beforeEach(() => {
        testInitializer = new TestInitializer(true);
        aliasHelper = testInitializer.server.aliasHelper;

        var tempDocument = testInitializer.server.ovDocuments.get("test.ov");
        if (!!tempDocument) {
            ovDocument = tempDocument;
        } else {
            ovDocument = new OvDocument([], [], new AliasHelper());
        }
    });

    test("Create Empty OvDocument, expect no error", () => {
        var document = new OvDocument([], [], new AliasHelper());
        expect(document).not.toBeNull();
    });

    test("Create Empty OvDocument with initialized aliasHelper, expect no error", () => {
        var document = new OvDocument([], [], aliasHelper);
        expect(document).not.toBeNull();
    });

    test("Create Empty OvDocument with sample text, expect no error", () => {
        var document = new OvDocument([], [], aliasHelper);
        expect(document).not.toBeNull();
    });

    test("Create OvDocument with text and multiple AstElements, expect no error", () => {
        var document = new OvDocument(getListOfAllKnownAstElements(), [], aliasHelper);
        expect(document).not.toBeNull();
    });

    test("getStringByPosition, expect correct string", () => {
        var document = new OvDocument(getListOfAllKnownAstElements(), [], aliasHelper);
        expect(document).not.toBeNull();
    });

    test("getStringByPosition with correct created OvDocument, expect correct string", () => {
        var actual = ovDocument.getStringByPosition(Position.create(4, 9));
        var expected = "Minderjährig";

        expect(actual![0]).toEqual(expected);
    });

    function getListOfAllKnownAstElements(): GenericNode[] {
        return [
            getAstComment(),
            getAstElement(),
            getAstRule(),
            getAstVariable()
        ];
    }

    function getDefaultRange(): IndexRange {
        return new IndexRange(new IndexPosition(0, 0), new IndexPosition(0, 0));
    }

    function getAstVariable(): VariableNode {
        return new VariableNode("Alter", new OperandNode(["Value"], getDefaultRange(), "", ""), ["Das ist ein Alter Test"], getDefaultRange());
    }

    function getAstRule(): RuleNode {
        var tmpOperand = new OperandNode(["Value"], getDefaultRange(), "", "");
        var operator = new OperatorNode(["KLEINER"],  getDefaultRange(), "Boolean", "EQUALS", "String");
        var operation = new OperationNode(tmpOperand, tmpOperand, operator, ["Operation"], getDefaultRange());
        return new RuleNode("Error", operation, ["Das ist ein Alter Test"], getDefaultRange());
    }

    function getAstComment(): CommentNode {
        return new CommentNode("test", ["Kommentar test"], getDefaultRange());
    }

    function getAstElement(): OperandNode {
        return new OperandNode(["Value"], getDefaultRange(), "", "");
    }
})