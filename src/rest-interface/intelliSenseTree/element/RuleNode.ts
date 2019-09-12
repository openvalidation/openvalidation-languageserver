import { Type } from "class-transformer";
import { Position } from "vscode-languageserver";
import { AliasHelper } from "../../../aliases/AliasHelper";
import { AliasKey } from "../../../aliases/AliasKey";
import { CompletionType } from "../../../enums/CompletionType";
import { FormattingHelper } from "../../../helper/FormattingHelper";
import { HoverContent } from "../../../helper/HoverContent";
import { CompletionContainer } from "../../../provider/code-completion/CompletionContainer";
import { GenericNode } from "../GenericNode";
import { IndexRange } from "../IndexRange";
import { ConnectedOperationNode } from "./operation/ConnectedOperationNode";
import { OperationNode } from "./operation/OperationNode";
import { ConditionNode } from "./operation/ConditionNode";

export class RuleNode extends GenericNode {

    @Type(() => ConditionNode, {
        discriminator: {
            property: "type",
            subTypes: [
                { value: OperationNode, name: "OperationNode" },
                { value: ConnectedOperationNode, name: "ConnectedOperationNode" }
            ]
        }
    })
    private condition: ConditionNode;

    private errorMessage: string;
    private spacesForMultiLineAction: string;

    constructor(errorMessage: string, condition: ConditionNode, line: string[], range: IndexRange) {
        super(line, range);
        this.errorMessage = errorMessage;
        this.condition = condition;
        this.spacesForMultiLineAction = "";
    }

    /**
     * Getter errorMessage
     * @return {string}
     */
    public getErrorMessage(): string {
        return this.errorMessage;
    }

    /**
     * Getter condition
     * @return {ConditionNode}
     */
    public getCondition(): ConditionNode {
        return this.condition;
    }

    /**
     * Setter errorMessage
     * @param {string} value
     */
    public setErrorMessage(value: string) {
        this.errorMessage = value;
    }

    /**
     * Setter condition
     * @param {ConditionNode} value
     */
    public setCondition(value: ConditionNode) {
        this.condition = value;
    }

    // TODO: Refactor
    public isLastWordLogicalOperator(position: Position, aliasesHelper: AliasHelper): boolean {
        var line = this.getLines()[position.line - this.getStartLineNumber()];
        var wordList = line.trim().split(" ");
        var lastWord = wordList[wordList.length - 1];

        return aliasesHelper.getLogicalOperators().indexOf(lastWord.toUpperCase()) != -1;
    }

    public getChilds(): GenericNode[] {
        var childList: GenericNode[] = [];

        if (!!this.condition)
            childList.push(this.condition);

        return childList;
    }

    public getHoverContent(): HoverContent | null {
        var content: HoverContent = new HoverContent(this.getRange());

        content.setContent("Rule");

        return content;
    }

    //TODO: Should be more like a state-machine (safer)
    /**
     * Formats the line completely and tries to split the lines
     *
     * @private
     * @param {string} line line to format
     * @returns {string} formatted line
     * @memberof OvRule
     */
    public formatLine(line: string, aliasesHelper: AliasHelper, spaces: string = ""): string {
        var firstKeyword = line.trim().split(' ')[0];

        var splittedKeywords: string[] = aliasesHelper.getLogicalOperators();
        var thenKeyword: string | null = aliasesHelper.getKeywordByAliasKey(AliasKey.THEN);
        if (!!thenKeyword)
            splittedKeywords.push(thenKeyword);

        // For the first if-line
        if (aliasesHelper.isIf(firstKeyword)) {
            line = this.splitLineByKeywordsAndFormatCode(line, aliasesHelper, splittedKeywords);
        }
        // For the linking-operators like or/and 
        else if (aliasesHelper.isLinkingOperator(firstKeyword)) {
            line = this.splitLineByKeywordsAndFormatCode(line, aliasesHelper, splittedKeywords, " ");
        }
        // For the last then-line
        else if (aliasesHelper.isThen(firstKeyword)) {
            this.spacesForMultiLineAction = FormattingHelper.generateSpaces(firstKeyword.length + 1);
        }
        // For multiline-actions
        else {
            line = this.spacesForMultiLineAction + line;
        }

        return line;
    }

    public getCompletionContainer(): CompletionContainer {
        if (!this.condition) {
            return new CompletionContainer(CompletionType.Operand);
        } else {
            var container: CompletionContainer = this.condition.getCompletionContainer();

            // Then the operand is already finished
            if (container.isEmpty()) {
                if (this.errorMessage == null) {
                    container = new CompletionContainer(CompletionType.Then, CompletionType.LogicalOperator);
                } else if (this.errorMessage == "") {
                    container = new CompletionContainer(CompletionType.None);
                }
                else {
                    container = new CompletionContainer(CompletionType.LogicalOperator);
                }
            }

            return container;
        }
    }
}
