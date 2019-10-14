import { IndexRange } from "../../IndexRange";
import { BaseOperandNode } from "./operand/BaseOperandNode";

/**
 * Abstract Node for the conditions (e.g. ConnectedOperation and Operation)
 *
 * @export
 * @abstract
 * @class ConditionNode
 * @extends {BaseOperandNode}
 */
export abstract class ConditionNode extends BaseOperandNode {
  private connector: string | null;

  /**
   * Creates an instance of ConditionNode.
   * @param {string[]} line lines of the node
   * @param {IndexRange} range scope of the node
   * @memberof ConditionNode
   */
  constructor(line: string[], range: IndexRange) {
    super(line, range, "Boolean", "");
    this.connector = null;
  }

  /**
   * Returns true, if the condition is inside a constrained operation (a condition with a `must`-keyword)
   *
   * @abstract
   * @returns {boolean}
   * @memberof ConditionNode
   */
  abstract get $constrained(): boolean;

  public get $connector(): string | null {
    return this.connector;
  }

  public set $connector(connector: string | null) {
    this.connector = connector;
  }
}
