import { Type } from "class-transformer";
import { Position } from "vscode-languageserver";
import { AliasHelper } from "../../../../aliases/AliasHelper";
import { HoverContent } from "../../../../helper/HoverContent";
import { CompletionContainer } from "../../../../provider/code-completion/CompletionContainer";
import { GenericNode } from "../../GenericNode";
import { IndexRange } from "../../IndexRange";
import { ConditionNode } from "./ConditionNode";
import { OperationNode } from "./OperationNode";

export class ConnectedOperationNode extends ConditionNode {
    @Type(() => OperationNode)
    private conditions: ConditionNode[];

    constructor(conditions: ConditionNode[], lines: string[], range: IndexRange) {
        super(lines, range)
        this.conditions = conditions;
    }

    /**
     * Getter conditions
     * @return {ConditionNode}
     */
    public getConditions(): ConditionNode[] {
        return this.conditions;
    }

    /**
     * Setter conditions
     * @param {ConditionNode} value
     */
    public setConditions(value: ConditionNode[]) {
        this.conditions = value;
    }

    public isConstrained(): boolean {
        return this.getConditions().map(cond => cond.isConstrained()).some(bool => bool);
    }

    public getChildren(): GenericNode[] {
        var childList: GenericNode[] = [];

        childList = childList.concat(this.conditions);

        return childList;
    }

    public getHoverContent(): HoverContent | null {
        var content: HoverContent = new HoverContent(this.getRange(), "ConnectedOperation");
        return content;
    }

    public getCompletionContainer(position: Position): CompletionContainer {
        if (this.getConditions().length == 0) {
            return CompletionContainer.init().operandTransition();
        }

        for (let index = 0; index < this.getConditions().length - 1; index++) {
            const firstElement = this.getConditions()[index];

            if (firstElement.getRange().includesPosition(position))
                return firstElement.getCompletionContainer(position);

            const secondElement = this.getConditions()[index + 1];

            // Position is between both elements
            if (firstElement.getRange().endsBefore(position) &&
                secondElement.getRange().startsAfter(position)) {
                return firstElement.getCompletionContainer(position);
            }
        }

        return this.getConditions()[this.getConditions().length - 1].getCompletionContainer(position);
    }

    public getBeautifiedContent(aliasHelper: AliasHelper): string {
        if (this.getConditions().length == 0) return this.getLines().join("\n");
        var returnString: string = "";
        var index = 0;
        for (; index < this.getConditions().length - 1; index++) {
            const element = this.getConditions()[index];
            returnString += element.getBeautifiedContent(aliasHelper) + "\n";
        }
        returnString += this.getConditions()[index].getBeautifiedContent(aliasHelper);

        return returnString;
    }

    public isComplete(): boolean {
        return this.conditions.map(cond => cond.isComplete()).every(bool => bool);
    }
}
