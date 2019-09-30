import { Position } from "vscode-languageserver";
import { OperationNode } from "../data-model/syntax-tree/element/operation/OperationNode";
import { GenericNode } from "../data-model/syntax-tree/GenericNode";
import { OperandNode } from "../data-model/syntax-tree/element/operation/operand/OperandNode";
import { BaseOperandNode } from "../data-model/syntax-tree/element/operation/operand/BaseOperandNode";

export class TreeTraversal {
    constructor() { }

    public traverseTree(nodes: GenericNode[], position: Position): GenericNode | null {
        var child: GenericNode | null = this.methodFilterElements(nodes, position);
        if (!child) return null;

        return this.traverseNode(child, position);
    }

    /**
     * traverse
     */
    public traverseNode(node: GenericNode, position: Position): GenericNode | null {
        var nextChild = this.methodFilterElements(node.getChildren(), position);
        if (!nextChild) {
            return node;
        }
        return this.traverseNode(nextChild, position);
    }

    private methodFilterElements(nodes: GenericNode[], position: Position): GenericNode | null {
        for (const node of nodes) {
            var range = node.getRange();
            if (!range) continue;

            if (range.includesPosition(position))
                return node;
        }

        return null;
    }

    public getOperations(genericNodes: GenericNode[]): OperationNode[] {
        var childs: GenericNode[] = genericNodes;
        var operations: OperationNode[] = [];

        for (const child of childs) {
            if (child instanceof OperationNode) {
                operations.push(child);
                continue;
            }

            if (child != null) {
                var nextChilds = child.getChildren();
                if (nextChilds.length != 0) {
                    operations.push(...this.getOperations(nextChilds));
                }
            }
        }

        return operations;
    }

    public getLonelyOperands(genericNodes: GenericNode[]): OperandNode[] {
        var childs: GenericNode[] = genericNodes;
        var operands: OperandNode[] = [];

        for (const child of childs) {
            if (child instanceof OperationNode) {
                continue;
            } else if (child instanceof BaseOperandNode) {
                operands.push(child);
                continue;
            }

            if (child != null) {
                var nextChilds = child.getChildren();
                if (nextChilds.length != 0) {
                    operands.push(...this.getLonelyOperands(nextChilds));
                }
            }
        }

        return operands;
    }
}