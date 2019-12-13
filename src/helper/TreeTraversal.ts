import { Position } from "vscode-languageserver";
import { GenericNode } from "../data-model/syntax-tree/GenericNode";

/**
 * Class for the traversal of the syntax-tree
 *
 * @export
 * @class TreeTraversal
 */
export class TreeTraversal {
  /**
   * Start point of the traversal.
   * We try to find a child where we start traversal with
   *
   * @param {GenericNode[]} nodes all nodes that are suitable
   * @param {Position} position position we will look for
   * @returns {(GenericNode | null)} found node or null if we found nothing
   * @memberof TreeTraversal
   */
  public traverseTree(
    nodes: GenericNode[],
    position: Position
  ): GenericNode | null {
    const child: GenericNode | null = this.methodFilterElements(
      nodes,
      position
    );
    if (!child) {
      return null;
    }

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
  private traverseNode(
    node: GenericNode,
    position: Position
  ): GenericNode | null {
    const nextChild = this.methodFilterElements(node.getChildren(), position);
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
  private methodFilterElements(
    nodes: GenericNode[],
    position: Position
  ): GenericNode | null {
    for (const node of nodes) {
      const range = node.$range;
      if (!range) {
        continue;
      }

      if (range.includesPosition(position)) {
        return node;
      }
    }

    return null;
  }
}
