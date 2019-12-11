import { Type } from "class-transformer";
import { GenericNode } from "./GenericNode";
import { IndexRange } from "./IndexRange";
import { TypeDecorator } from "./TypeDecorator";
import { Variable } from "./Variable";
import { VariableNode } from "./element/VariableNode";

/**
 * MainNode for the syntax-tree
 *
 * @export
 * @class MainNode
 */
export class MainNode {
  @Type(() => Variable)
  private declarations: Variable[] = [];

  @Type(() => GenericNode, TypeDecorator.getGenericOptions())
  private scopes: GenericNode[];

  @Type(() => IndexRange)
  private range: IndexRange;

  /**
   * Creates an instance of MainNode.
   * @memberof MainNode
   */
  constructor(range: IndexRange) {
    this.declarations = [];
    this.scopes = [];
    this.range = range;
  }

  public get $declarations(): Variable[] {
    return this.declarations;
  }
  public set $declarations(value: Variable[]) {
    this.declarations = value;
  }

  public get $scopes(): GenericNode[] {
    return this.scopes;
  }
  public set $scopes(value: GenericNode[]) {
    this.scopes = value;
  }

  public get $range(): IndexRange {
    return this.range;
  }
  public set $range(value: IndexRange) {
    this.range = value;
  }

  public getVariableNodes(): VariableNode[] {
    var returnList: VariableNode[] = [];

    for (var scope of this.$scopes) {
      if (scope instanceof VariableNode) {
        returnList.push(scope);
      }
    }

    return returnList;
  }
}
