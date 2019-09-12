import { Type } from "class-transformer";
import { Position, Range } from "vscode-languageserver";
import { AliasHelper } from "../../../aliases/AliasHelper";
import { AliasKey } from "../../../aliases/AliasKey";
import { CompletionType } from "../../../enums/CompletionType";
import { FormattingHelper } from "../../../helper/FormattingHelper";
import { HoverContent } from "../../../helper/HoverContent";
import { CompletionContainer } from "../../../provider/code-completion/CompletionContainer";
import { GenericNode } from "../GenericNode";
import { IndexRange } from "../IndexRange";
import { ArrayOperandNode } from "./operation/operand/ArrayOperandNode";
import { FunctionOperandNode } from "./operation/operand/FunctionOperandNode";
import { OperandNode } from "./operation/operand/OperandNode";
import { ConnectedOperationNode } from "./operation/ConnectedOperationNode";
import { OperationNode } from "./operation/OperationNode";

export class VariableNode extends GenericNode {
    @Type(() => OperandNode, {
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
    private value: OperandNode;

    private name: string;

    constructor(name: string, value: OperandNode, lines: string[], range: IndexRange) {
        super(lines, range);
        this.name = name;
        this.value = value;
    }

    public getChilds(): GenericNode[] {
        var childList: GenericNode[] = [];

        if (!!this.value)
            childList.push(this.value);

        return childList;
    }

    /**
     * Getter value
     * @return {ValueNode}
     */
    public getValue(): OperandNode {
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
    public setValue(value: OperandNode) {
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


    public getHoverContent(): HoverContent {
        var content: HoverContent = new HoverContent(this.getRange());

        var contentText = "Variable " + this.getName();
        if (!!this.getValue())
            contentText += ": " + this.getValue().getDataType();

        content.setContent(contentText);

        return content;
    }

    //TODO: Should be more like a state-machine (safer)
    /**
     * Formats the line completely and tries to split the lines
     *
     * @private
     * @param {string} line line to format
     * @param {string} spaces spaced to add before each line (except the name-declaration)
     * @returns {string} formatted line
     * @memberof OvVariable
     */
    public formatLine(line: string, aliasesHelper: AliasHelper): string {
        var splittedLine = line.split(' ');
        var firstKeyword = splittedLine[0].trim();

        var asKeyword: string | null = aliasesHelper.getKeywordByAliasKey(AliasKey.AS);
        var spaces: string = !asKeyword ? "" : FormattingHelper.generateSpaces(asKeyword.length + 1);

        // For the linking-operators like or/and 
        if (aliasesHelper.isLinkingOperator(firstKeyword)) {
            line = spaces + " " + line;
        }
        // Not the last line
        else if (!aliasesHelper.isAs(firstKeyword)) {
            var splittedKeywords: string[] = aliasesHelper.getLogicalOperators();
            var thenKeyword: string | null = aliasesHelper.getKeywordByAliasKey(AliasKey.AS);
            if (!!thenKeyword)
                splittedKeywords.push(thenKeyword);

            line = this.splitLineByKeywordsAndFormatCode(line, aliasesHelper, splittedKeywords, spaces);
        }

        return line;
    }

    public getCompletionContainer(): CompletionContainer {
        if (!this.value)
            return new CompletionContainer(CompletionType.Operand);

        return this.value.getCompletionContainer();
    }
}
