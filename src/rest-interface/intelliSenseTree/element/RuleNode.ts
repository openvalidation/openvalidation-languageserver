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
}
