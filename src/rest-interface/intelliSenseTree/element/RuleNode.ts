import { Type } from "class-transformer";
import { String } from "typescript-string-operations";
import { Position } from "vscode-languageserver";
import { AliasHelper } from "../../../aliases/AliasHelper";
import { CompletionType } from "../../../enums/CompletionType";
import { HoverContent } from "../../../helper/HoverContent";
import { CompletionContainer } from "../../../provider/code-completion/CompletionContainer";
import { GenericNode } from "../GenericNode";
import { IndexRange } from "../IndexRange";
import { ConditionNode } from "./operation/ConditionNode";
import { ConnectedOperationNode } from "./operation/ConnectedOperationNode";
import { OperationNode } from "./operation/OperationNode";
import { FormattingHelper } from "../../../helper/FormattingHelper";
import { AliasKey } from "../../../aliases/AliasKey";

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

    constructor(errorMessage: string, condition: ConditionNode, line: string[], range: IndexRange) {
        super(line, range);
        this.errorMessage = errorMessage;
        this.condition = condition;
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

    public getChildren(): GenericNode[] {
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

    public getCompletionContainer(position: Position): CompletionContainer {
        if (!this.condition) {
            return new CompletionContainer(CompletionType.Operand);
        } else {
            var container: CompletionContainer = this.condition.getCompletionContainer(position);
            // if (!this.condition.getRange().positionBeforeEnd(position))


            // Then the operand is already finished
            if ((container.isEmpty() ||
                container.containsLogicalOperator()) &&
                !this.condition.getRange().includesPosition(position)) {
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

    public isComplete(): boolean {
        return !!this.condition &&
            this.condition.isComplete() &&
            String.IsNullOrWhiteSpace(this.getErrorMessage());
    }

    public getBeautifiedContent(aliasesHelper: AliasHelper): string {
        var ruleString: string = this.getLines().join("\n");
        if (!this.condition) return ruleString;

        var splittedRule: string[] = ruleString.split(this.condition.getLines().join("\n"));
        var returnString: string = "";

        if (!String.IsNullOrWhiteSpace(splittedRule[0]))
            returnString += FormattingHelper.removeDuplicateWhitespacesFromLine(splittedRule[0]) + " ";

        var conditionString: string = this.condition.getBeautifiedContent(aliasesHelper);
        returnString += conditionString + (String.IsNullOrWhiteSpace(returnString) ? "" : "\n");

        if (!String.IsNullOrWhiteSpace(splittedRule[1]))
            returnString += FormattingHelper.removeDuplicateWhitespacesFromLine(splittedRule[1]);

        if (this.condition.isConstrained()) return returnString;

        //keywords inside a not constrained rule should be right-justified
        var relevantKeywords: string[] = aliasesHelper.getKeywordsByAliasKeys(AliasKey.AND, AliasKey.OR, AliasKey.THEN, AliasKey.IF);
        var thenKeyword: string | null = aliasesHelper.getKeywordByAliasKey(AliasKey.THEN);
        var highestLength: number = Math.max.apply(null, relevantKeywords.map(word => word.length));

        var splittedLines = returnString.split("\n");
        var isErrorMessage: boolean = false;
        returnString = "";
        for (const line of splittedLines) {
            var spaceLength : number = highestLength + 1;

            var startingKeyword = relevantKeywords.filter(key => line.toLowerCase().startsWith(key.toLowerCase()));
            if (startingKeyword.length > 0 && !isErrorMessage) {
                if (startingKeyword[0] == thenKeyword) isErrorMessage = true;
                spaceLength = highestLength - startingKeyword[0].length;
            }
            returnString += FormattingHelper.generateSpaces(spaceLength) + line.trim() + "\n";
        }

        return returnString;
    }
}
