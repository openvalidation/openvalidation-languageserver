import { Type } from "class-transformer";
import { CompletionType } from "../../../../enums/CompletionType";
import { HoverContent } from "../../../../helper/HoverContent";
import { CompletionContainer } from "../../../../provider/code-completion/CompletionContainer";
import { GenericNode } from "../../GenericNode";
import { IndexRange } from "../../IndexRange";
import { ArrayOperandNode } from "./operand/ArrayOperandNode";
import { FunctionOperandNode } from "./operand/FunctionOperandNode";
import { OperandNode } from "./operand/OperandNode";
import { OperatorNode } from "./operand/OperatorNode";
import { ConditionNode } from "./ConditionNode";
import { ConnectedOperationNode } from "./ConnectedOperationNode";
import { Position } from "vscode-languageserver";
import { AliasHelper } from "src/aliases/AliasHelper";
import { BaseOperandNode } from "./operand/BaseOperandNode";

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
    private leftOperand: BaseOperandNode;

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
    private rightOperand: BaseOperandNode;

    @Type(() => OperatorNode)
    private operator: OperatorNode;

    private constrained: boolean;

    constructor(leftOperand: BaseOperandNode, rightOperand: BaseOperandNode, operator: OperatorNode, lines: string[], range: IndexRange) {
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
    public getLeftOperand(): BaseOperandNode {
        return this.leftOperand;
    }

    /**
     * Getter rightOperand
     * @return {BaseOperandNode}
     */
    public getRightOperand(): BaseOperandNode {
        return this.rightOperand;
    }

    /**
     * Getter operator
     * @return {string}
     */
    public getOperator(): OperatorNode {
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
        var content: HoverContent = new HoverContent(this.getRange());

        content.setContent("Operation");

        return content;
    }

    public completionBeforeNode(): CompletionContainer {
        return CompletionContainer.empty();
    }
    public completionAfterNode(): CompletionContainer {
        return CompletionContainer.logicalOperator();
    }

    public completionInsideNode(position: Position): CompletionContainer {
        if (!this.leftOperand) return new CompletionContainer(CompletionType.Operand);

        var container: CompletionContainer = this.leftOperand.getCompletionContainer(position);
        if (!this.leftOperand.isComplete() && !this.operator) {
            return container;
        }

        if (!this.operator) {
            if (!this.leftOperand.getRange().endsBefore(position)) {
                return CompletionContainer.empty(); 
            }

            container.addType(CompletionType.Operator);
            container.specificDataType(this.leftOperand.getDataType());
            return container;
        }

        if (!this.rightOperand) {
            container = new CompletionContainer(CompletionType.Operand);
            container.specificDataType(this.leftOperand.getDataType());
            container.specifyNameFiltering(this.leftOperand.getName());
            return container;
        }

        container = this.rightOperand.getCompletionContainer(position);
        if (!this.rightOperand.isComplete() && !container.containsOperator()) {
            return container;
        }
        return new CompletionContainer(CompletionType.LogicalOperator);
    }

    public isComplete(): boolean {
        return !!this.leftOperand && !!this.operator && !!this.rightOperand;
    }
    
    public getBeautifiedContent(aliasesHelper: AliasHelper): string {
        return this.getLines().join("\n");
    }
}
