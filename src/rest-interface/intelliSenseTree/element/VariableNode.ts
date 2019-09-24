import { Type } from "class-transformer";
import { String } from "typescript-string-operations";
import { Position, Range } from "vscode-languageserver";
import { AliasHelper } from "../../../aliases/AliasHelper";
import { AliasKey } from "../../../aliases/AliasKey";
import { CompletionType } from "../../../enums/CompletionType";
import { FormattingHelper } from "../../../helper/FormattingHelper";
import { HoverContent } from "../../../helper/HoverContent";
import { CompletionContainer } from "../../../provider/code-completion/CompletionContainer";
import { GenericNode } from "../GenericNode";
import { IndexRange } from "../IndexRange";
import { ConnectedOperationNode } from "./operation/ConnectedOperationNode";
import { ArrayOperandNode } from "./operation/operand/ArrayOperandNode";
import { FunctionOperandNode } from "./operation/operand/FunctionOperandNode";
import { OperandNode } from "./operation/operand/OperandNode";
import { OperationNode } from "./operation/OperationNode";
import { BaseOperandNode } from "./operation/operand/BaseOperandNode";

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
    private value: BaseOperandNode;

    private name: string;

    constructor(name: string, value: BaseOperandNode, lines: string[], range: IndexRange) {
        super(lines, range);
        this.name = name;
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
    public getValue(): BaseOperandNode {
        return this.value;
    }

    /**
     * Getter name
     * @return {string}
     */
    public getName(): string {
        return this.name;
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
    public setName(value: string) {
        this.name = value;
    }

    /**
     * Returns the Range of the name of this variable
     *
     * @returns {(IndexRange | null)}
     * @memberof OvVariable
     */
    public getRangeOfVariableName(): Range {
        for (let index = 0; index < this.getLines().length; index++) {
            const line = this.getLines()[index];
            var foundIndex = line.indexOf(this.name);
            if (foundIndex === -1) continue;

            var lineNumber: number = this.getStartLineNumber() + index;
            var startIndex = foundIndex;
            var endIndex = foundIndex + this.name.length;

            var startPosition: Position = Position.create(lineNumber, startIndex);
            var endPosition: Position = Position.create(lineNumber, endIndex);
            return Range.create(startPosition, endPosition);
        }

        throw Error("Variable " + this.name + " is not included in the Variable-Lines");
    }


    public getHoverContent(): HoverContent | null {
        var content: HoverContent = new HoverContent(this.getRange(), "");

        var contentText = "Variable " + this.getName();
        if (!!this.getValue())
            contentText += ": " + this.getValue().getDataType();

        content.setContent(contentText);

        return content;
    }

    public getCompletionContainer(range: Position): CompletionContainer {
        if (!this.value)
            return new CompletionContainer(CompletionType.Operand);

        return this.value.getCompletionContainer(range);
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
