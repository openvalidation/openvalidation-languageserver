import { Position } from "vscode-languageserver";
import { BaseOperandNode } from "../data-model/syntax-tree/element/operation/operand/BaseOperandNode";
import { OperationNode } from "../data-model/syntax-tree/element/operation/OperationNode";
import { GenericNode } from "../data-model/syntax-tree/GenericNode";
import { ConditionNode } from "../data-model/syntax-tree/element/operation/ConditionNode";

/**
 * Class for the traversal of the syntax-tree
 *
 * @export
 * @class TreeTraversal
 */
export class TreeTraversal {

    /**
     * Creates an instance of TreeTraversal.
     * @memberof TreeTraversal
     */
    constructor() { }

    /**
     * Start point of the traversal.
     * We try to find a child where we start traversal with
     *
     * @param {GenericNode[]} nodes all nodes that are suitable
     * @param {Position} position position we will look for
     * @returns {(GenericNode | null)} found node or null if we found nothing
     * @memberof TreeTraversal
     */
    public traverseTree(nodes: GenericNode[], position: Position): GenericNode | null {
        var child: GenericNode | null = this.methodFilterElements(nodes, position);
        if (!child) return null;

        return this.traverseNode(child, position);
    }

    /**
     * Recursive method for the next qualified node
     *
     * @param {GenericNode} node node that will be checked
     * @param {Position} position position we will look for 
     * @returns {(GenericNode | null)} found node or null if we found nothing
     * @memberof TreeTraversal
     */
    public traverseNode(node: GenericNode, position: Position): GenericNode | null {
        var nextChild = this.methodFilterElements(node.getChildren(), position);
        if (!nextChild) {
            return node;
        }
        return this.traverseNode(nextChild, position);
    }

    /**
     * Filtering of elements by the given position
     *
     * @private
     * @param {GenericNode[]} nodes we want to filter
     * @param {Position} position position we will look for 
     * @returns {(GenericNode | null)} found node or null if we found nothing
     * @memberof TreeTraversal
     */
    private methodFilterElements(nodes: GenericNode[], position: Position): GenericNode | null {
        for (const node of nodes) {
            var range = node.$range;
            if (!range) continue;

            if (range.includesPosition(position))
                return node;
        }

        return null;
    }

    /**
     * Tries to find all conditions recursive
     *
     * @param {GenericNode[]} genericNodes all known nodes
     * @returns {ConditionNode[]} found conditions
     * @memberof TreeTraversal
     */
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

    /**
     * Tries to find all operandNodes that aren't inside an operation recursive
     *
     * @param {GenericNode[]} genericNodes all known nodes
     * @returns {BaseOperandNode[]} found operandNodes
     * @memberof TreeTraversal
     */
    public getLonelyOperands(genericNodes: GenericNode[]): BaseOperandNode[] {
        var childs: GenericNode[] = genericNodes;
        var operands: BaseOperandNode[] = [];

        for (const child of childs) {
            if (child instanceof ConditionNode) {
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