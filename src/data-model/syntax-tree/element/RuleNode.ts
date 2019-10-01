import { Type } from "class-transformer";
import { String } from "typescript-string-operations";
import { Position } from "vscode-languageserver";
import { AliasHelper } from "../../../aliases/AliasHelper";
import { AliasKey } from "../../../aliases/AliasKey";
import { FormattingHelper } from "../../../helper/FormattingHelper";
import { HoverContent } from "../../../helper/HoverContent";
import { CompletionContainer } from "../../../provider/code-completion/CompletionContainer";
import { GenericNode } from "../GenericNode";
import { IndexRange } from "../IndexRange";
import { ActionErrorNode } from "./ActionErrorNode";
import { ConditionNode } from "./operation/ConditionNode";
import { ConnectedOperationNode } from "./operation/ConnectedOperationNode";
import { OperationNode } from "./operation/OperationNode";

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
    private condition: ConditionNode | null;

    @Type(() => ActionErrorNode)
    private errorNode: ActionErrorNode | null;

    constructor(errorNode: ActionErrorNode | null, condition: ConditionNode | null, line: string[], range: IndexRange) {
        super(line, range);
        this.errorNode = errorNode;
        this.condition = condition;
    }

    /**
     * Getter errorMessage
     * @return {string}
     */
    public getErrorNode(): ActionErrorNode | null {
        return this.errorNode;
    }

    /**
     * Getter condition
     * @return {ConditionNode}
     */
    public getCondition(): ConditionNode | null {
        return this.condition;
    }

    /**
     * Setter errorMessage
     * @param {string} value
     */
    public setErrorNode(value: ActionErrorNode) {
        this.errorNode = value;
    }

    /**
     * Setter condition
     * @param {ConditionNode} value
     */
    public setCondition(value: ConditionNode) {
        this.condition = value;
    }

    public getChildren(): GenericNode[] {
        var childList: GenericNode[] = [];

        if (!!this.condition)
            childList.push(this.condition);

        return childList;
    }

    public getHoverContent(): HoverContent | null {
        var content: HoverContent = new HoverContent(this.$range, "Rule");
        return content;
    }

    public getCompletionContainer(position: Position): CompletionContainer {
        // Then we are inside the error-node and we don't want completion
        if (!!this.errorNode
                && !!this.errorNode.$range
                && !this.errorNode.$range.startsAfter(position)
                && (!this.condition || !this.condition.isConstrained())) {
            return CompletionContainer.init().emptyTransition();
        }

        if (!this.condition) return CompletionContainer.init().operandTransition();

        if (!this.condition.$range.startsAfter(position)) {
            var container: CompletionContainer = this.condition.getCompletionContainer(position);

            if (this.condition.isComplete() && this.errorNode == null) {
                container.thenKeywordTransition();
            }

            return container;
        } else if (this.condition.isConstrained()) {
            return this.condition.getCompletionContainer(position);
        }

        return CompletionContainer.init().emptyTransition();
    }

    public getBeautifiedContent(aliasesHelper: AliasHelper): string {
        var ruleString: string = this.$lines.join("\n");
        if (!this.condition) return ruleString;

        var splittedRule: string[] = ruleString.split(this.condition.$lines.join("\n"));
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
            var spaceLength: number = highestLength + 1;

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
