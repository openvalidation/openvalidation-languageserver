import { Type } from "class-transformer";
import { Position } from "vscode-languageserver";
import { AliasHelper } from "../../../../aliases/AliasHelper";
import { HoverContent } from "../../../../helper/HoverContent";
import { CompletionContainer } from "../../../../provider/code-completion/CompletionContainer";
import { GenericNode } from "../../GenericNode";
import { IndexRange } from "../../IndexRange";
import { ConditionNode } from "./ConditionNode";
import { ConnectedOperationNode } from "./ConnectedOperationNode";
import { ArrayOperandNode } from "./operand/ArrayOperandNode";
import { BaseOperandNode } from "./operand/BaseOperandNode";
import { FunctionOperandNode } from "./operand/FunctionOperandNode";
import { OperandNode } from "./operand/OperandNode";
import { OperatorNode } from "./operand/OperatorNode";
import { SyntaxHighlightingCapture } from "../../../../provider/syntax-highlighting/SyntaxHighlightingCapture";
import { ScopeEnum } from "../../../../enums/ScopeEnum";
import { String } from "typescript-string-operations";

export class OperationNode extends ConditionNode {
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
    private leftOperand: BaseOperandNode | null;

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
    private rightOperand: BaseOperandNode | null;

    @Type(() => OperatorNode)
    private operator: OperatorNode | null;

    private constrained: boolean;

    constructor(leftOperand: BaseOperandNode | null, operator: OperatorNode | null, rightOperand: BaseOperandNode | null, lines: string[], range: IndexRange) {
        super(lines, range);
        this.leftOperand = leftOperand;
        this.rightOperand = rightOperand;
        this.operator = operator;
        this.constrained = false;
    }

    /**
     * Getter leftOperand
     * @return {BaseOperandNode}
     */
    public getLeftOperand(): BaseOperandNode | null {
        return this.leftOperand;
    }

    /**
     * Getter rightOperand
     * @return {BaseOperandNode}
     */
    public getRightOperand(): BaseOperandNode | null {
        return this.rightOperand;
    }

    /**
     * Getter operator
     * @return {string}
     */
    public getOperator(): OperatorNode | null {
        return this.operator;
    }

    public isConstrained(): boolean {
        return this.constrained;
    }

    /**
     * Setter leftOperand
     * @param {BaseOperandNode} value
     */
    public setLeftOperand(value: BaseOperandNode) {
        this.leftOperand = value;
    }

    /**
     * Setter rightOperand
     * @param {BaseOperandNode} value
     */
    public setRightOperand(value: BaseOperandNode) {
        this.rightOperand = value;
    }

    /**
     * Setter operator
     * @param {string} value
     */
    public setOperator(value: OperatorNode) {
        this.operator = value;
    }

    public setConstrained(value: boolean) {
        this.constrained = value;
    }

    public getChildren(): GenericNode[] {
        var childList: GenericNode[] = [];

        if (!!this.leftOperand)
            childList.push(this.leftOperand);

        if (!!this.rightOperand)
            childList.push(this.rightOperand);

        if (!!this.operator)
            childList.push(this.operator);

        return childList;
    }

    public getHoverContent(): HoverContent | null {
        var content: HoverContent = new HoverContent(this.$range, "Operation");
        return content;
    }

    public getCompletionContainer(position: Position): CompletionContainer {
        if (!this.leftOperand) {
            return CompletionContainer.init().operandTransition();
        }

        if (!!this.leftOperand.$range && this.leftOperand.$range.endsBefore(position) && !this.operator) {
            var container = this.leftOperand.getCompletionContainer(position);

            if (container.isEmpty())
                container.operatorTransition(this.leftOperand.getDataType());

            return container;
        }

        if (!!this.operator && !!this.operator.$range && this.operator.$range.endsBefore(position) && !this.rightOperand) {
            var container = this.operator.getCompletionContainer(position);
            container.operandTransition(this.leftOperand.getDataType(), this.leftOperand.getName())
            return container;
        }

        if (!!this.rightOperand && !!this.rightOperand.$range && this.rightOperand.$range.endsBefore(position)) {
            var container = this.rightOperand.getCompletionContainer(position);

            if (container.isEmpty())
                container.connectionTransition();

            return container;
        }

        if (this.$range.includesPosition(position))
            return CompletionContainer.init().emptyTransition();

        return CompletionContainer.init().connectionTransition();
    }

    public isComplete(): boolean {
        return !!this.leftOperand && !!this.operator && !!this.rightOperand;
    }

    public getBeautifiedContent(aliasesHelper: AliasHelper): string {
        var returnString = this.defaultFormatting();

        if (!!this.leftOperand) {
            returnString = returnString.replace(this.leftOperand.defaultFormatting(), this.leftOperand.getBeautifiedContent(aliasesHelper));
        }

        if (!!this.rightOperand) {
            returnString = returnString.replace(this.rightOperand.defaultFormatting(), this.rightOperand.getBeautifiedContent(aliasesHelper));
        }

        if (!!this.operator) {
            returnString = returnString.replace(this.operator.defaultFormatting(), this.operator.getBeautifiedContent(aliasesHelper));
        }

        return returnString;
    }

    public getPatternInformation(aliasesHelper: AliasHelper): SyntaxHighlightingCapture | null {
        var capture: SyntaxHighlightingCapture | null = new SyntaxHighlightingCapture();

        if (!!this.leftOperand) {
            var tempCapture = this.leftOperand.getPatternInformation(aliasesHelper);
            if (!!tempCapture) {
                capture.addCapture(...tempCapture.$capture);
                capture.addRegexToMatch(tempCapture.$match);
            }
        }

        if (!!this.operator) {
            var shadowOperator = this.$lines.join("\n");
            shadowOperator = shadowOperator.replace(new RegExp(this.operator.$lines.join("\n"), "g"), "");

            if (!!this.leftOperand) {
                var operandString = this.leftOperand.$lines.join("\n");
                var startIndex = shadowOperator.indexOf(operandString) + operandString.length;
                var endIndex = shadowOperator.length;
                shadowOperator = shadowOperator.substring(startIndex, endIndex);
            }

            if (!!this.rightOperand) {
                var operandString = this.rightOperand.$lines.join("\n");
                var startIndex = 0;
                var endIndex = shadowOperator.indexOf(operandString);
                shadowOperator = shadowOperator.substring(startIndex, endIndex);
            }

            if (!String.IsNullOrWhiteSpace(shadowOperator.trim())) {
                capture.addRegexToMatch(`(${shadowOperator.trim()})`);
                capture.addCapture(ScopeEnum.Empty);
            }

            var tempCapture = this.operator.getPatternInformation(aliasesHelper);
            if (!!tempCapture) {
                capture.addCapture(...tempCapture.$capture);
                capture.addRegexToMatch(tempCapture.$match);
            }
        }

        if (!!this.rightOperand && (!this.leftOperand || !this.leftOperand.$range.includesRange(this.rightOperand.$range))) {
            var tempCapture = this.rightOperand.getPatternInformation(aliasesHelper);
            if (!!tempCapture) {
                capture.addCapture(...tempCapture.$capture);
                capture.addRegexToMatch(tempCapture.$match);
            }
        }

        return capture;
    }
}
