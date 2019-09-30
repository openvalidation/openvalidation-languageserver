import { Type } from "class-transformer";
import { Position } from "vscode-languageserver";
import { AliasHelper } from "../../../../aliases/AliasHelper";
import { FormattingHelper } from "../../../../helper/FormattingHelper";
import { HoverContent } from "../../../../helper/HoverContent";
import { CompletionContainer } from "../../../../provider/code-completion/CompletionContainer";
import { SyntaxHighlightingCapture } from "../../../../provider/syntax-highlighting/SyntaxHighlightingCapture";
import { GenericNode } from "../../GenericNode";
import { IndexRange } from "../../IndexRange";
import { ConditionNode } from "./ConditionNode";
import { OperationNode } from "./OperationNode";

export class ConnectedOperationNode extends ConditionNode {
    @Type(() => ConditionNode, {
        discriminator: {
            property: "type",
            subTypes: [
                { value: OperationNode, name: "OperationNode" },
                { value: ConnectedOperationNode, name: "ConnectedOperationNode" }
            ]
        }
    })
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

        childList.push(...this.conditions);

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

        var extraSpacesForNestedOperation: string = !!this.getConnector()
            ? FormattingHelper.generateSpaces(this.getConnector()!.length + 1)
            : "";

        for (let index = 0; index < this.getConditions().length; index++) {
            const element = this.getConditions()[index];

            returnString += element.getBeautifiedContent(aliasHelper);
            returnString = returnString.replace(/(?:\r\n|\r|\n)/g, ("\n" + extraSpacesForNestedOperation));

            if (index != this.getConditions().length - 1)
                returnString += "\n";
        }

        return returnString;
    }

    public isComplete(): boolean {
        return this.conditions.map(cond => cond.isComplete()).every(bool => bool);
    }

    public getPatternInformation(): SyntaxHighlightingCapture | null {
        if (this.conditions.length == 0) return null;

        var capture = new SyntaxHighlightingCapture();
        for (const condition of this.conditions) {
            var tmpCapture = condition.getPatternInformation();
            if (!tmpCapture) return null;

            capture.addCapture(...tmpCapture.capture);
            capture.addRegexToMatch(tmpCapture.match)
        }

        return capture;
    }
}
