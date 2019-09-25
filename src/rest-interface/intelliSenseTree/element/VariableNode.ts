import { Type } from "class-transformer";
import { String } from "typescript-string-operations";
import { Position, Range } from "vscode-languageserver";
import { AliasHelper } from "../../../aliases/AliasHelper";
import { AliasKey } from "../../../aliases/AliasKey";
import { FormattingHelper } from "../../../helper/FormattingHelper";
import { HoverContent } from "../../../helper/HoverContent";
import { CompletionContainer } from "../../../provider/code-completion/CompletionContainer";
import { GenericNode } from "../GenericNode";
import { IndexRange } from "../IndexRange";
import { ConnectedOperationNode } from "./operation/ConnectedOperationNode";
import { ArrayOperandNode } from "./operation/operand/ArrayOperandNode";
import { BaseOperandNode } from "./operation/operand/BaseOperandNode";
import { FunctionOperandNode } from "./operation/operand/FunctionOperandNode";
import { OperandNode } from "./operation/operand/OperandNode";
import { OperationNode } from "./operation/OperationNode";
import { VariableNameNode } from "./VariableNameNode";

export class VariableNode extends GenericNode {
    @Type(() => BaseOperandNode, {
        discriminator: {
            property: "type",
            subTypes: [
                { value: OperationNode, name: "OperationNode" },
                { value: ConnectedOperationNode, name: "ConnectedOperationNode" },
                { value: FunctionOperandNode, name: "FunctionOperandNode" },
                { value: OperandNode, name: "OperandNode" },
                { value: ArrayOperandNode, name: "ArrayOperandNode" }
            ]
        }
    })
    private value: BaseOperandNode | null;

    @Type(() => VariableNameNode)
    private nameNode: VariableNameNode | null;

    constructor(nameNode: VariableNameNode | null, value: BaseOperandNode | null, lines: string[], range: IndexRange) {
        super(lines, range);
        this.nameNode = nameNode;
        this.value = value;
    }

    public getChildren(): GenericNode[] {
        var childList: GenericNode[] = [];

        if (!!this.value)
            childList.push(this.value);

        return childList;
    }

    /**
     * Getter value
     * @return {ValueNode}
     */
    public getValue(): BaseOperandNode | null {
        return this.value;
    }

    /**
     * Getter name
     * @return {string}
     */
    public getNameNode(): VariableNameNode | null {
        return this.nameNode;
    }

    /**
     * Setter value
     * @param {ValueNode} value
     */
    public setValue(value: BaseOperandNode) {
        this.value = value;
    }

    /**
     * Setter name
     * @param {string} value
     */
    public setNameNode(value: VariableNameNode | null) {
        this.nameNode = value;
    }

    /**
     * Returns the Range of the name of this variable
     *
     * @returns {(IndexRange | null)}
     * @memberof OvVariable
     */
    public getRangeOfVariableName(): Range {
        if (!this.getNameNode()) return this.getRange().asRange();

        return this.getNameNode()!.getRange().asRange();
    }

    public getHoverContent(): HoverContent | null {
        var contentText = "Variable" + !this.getNameNode() ? " " : " "  + this.getNameNode()!.getName();
        if (!!this.getValue())
            contentText += ": " + this.getValue()!.getDataType();

        var content: HoverContent = new HoverContent(this.getRange(), contentText);
        return content;
    }

    public getCompletionContainer(position: Position): CompletionContainer {
        if (!!this.getNameNode() && !this.getNameNode()!.getRange().startsAfter(position))
            return CompletionContainer.init().emptyTransition();

        if (!this.value)
            return CompletionContainer.init().operandTransition();

        var container = this.value.getCompletionContainer(position);
        if (container.isEmpty()) {
            container.operatorTransition(this.value.getDataType());
        }
        return container;
    }

    public isComplete(): boolean {
        return !!this.value && this.value.isComplete();
    }

    public getBeautifiedContent(aliasesHelper: AliasHelper): string {
        var variableString: string = this.getLines().join("\n");
        if (!this.value) return variableString;

        var asKeyword: string | null = aliasesHelper.getKeywordByAliasKey(AliasKey.AS);
        if (!asKeyword) return variableString;

        var splittedVariable: string[] = variableString.split(this.value.getLines().join("\n"));
        var returnString: string = "";

        var spaces = FormattingHelper.generateSpaces(asKeyword.length + 1);
        var conditionString: string = this.value.getBeautifiedContent(aliasesHelper);
        conditionString = conditionString.replace(new RegExp("\n", 'g'), "\n" + spaces);
        returnString += spaces + conditionString + "\n";

        for (const splittedLine of splittedVariable) {
            if (!String.IsNullOrWhiteSpace(splittedLine))
                returnString += FormattingHelper.removeDuplicateWhitespacesFromLine(splittedLine);
        }
        return returnString;
    }
}
