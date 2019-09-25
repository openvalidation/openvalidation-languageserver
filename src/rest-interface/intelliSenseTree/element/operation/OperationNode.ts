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
        var content: HoverContent = new HoverContent(this.getRange(), "Operation");
        return content;
    }

    public getCompletionContainer(position: Position): CompletionContainer {
        if (!this.leftOperand) {
            return CompletionContainer.init().operandTransition();
        }

        // TODO: Can be done in a loop?!
        if (!!this.leftOperand.getRange() && this.leftOperand.getRange().endsBefore(position) && !this.operator) {
            var container = this.leftOperand.getCompletionContainer(position);
            container.operatorTransition(this.leftOperand.getDataType());
            return container;
        }

        if (!!this.operator && !!this.operator.getRange() && this.operator.getRange().endsBefore(position) && !this.rightOperand) {
            var container = this.operator.getCompletionContainer(position);
            container.operandTransition(this.leftOperand.getDataType(), this.leftOperand.getName())
            return container;
        }

        if (!!this.rightOperand && !!this.rightOperand.getRange() && this.rightOperand.getRange().endsBefore(position)) {
            var container = this.rightOperand.getCompletionContainer(position);
            container.connectionTransition();
            return container;
        }

        if (this.getRange().includesPosition(position))
            return CompletionContainer.init().emptyTransition();

        return CompletionContainer.init().connectionTransition();
    }

    public isComplete(): boolean {
        return !!this.leftOperand && !!this.operator && !!this.rightOperand;
    }

    public getBeautifiedContent(aliasesHelper: AliasHelper): string {
        return this.getLines().join("\n");
    }
}
