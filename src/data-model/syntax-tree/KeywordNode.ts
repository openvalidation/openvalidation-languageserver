import { IndexRange } from "./IndexRange";
import { Type } from "class-transformer";

export class KeywordNode {
  private lines: string[];

  @Type(() => IndexRange)
  private range: IndexRange;

  /**
   * Creates an instance of GenericNode.
   * @param {string[]} lines lines of the node
   * @param {IndexRange} range scope of the node
   * @memberof GenericNode
   */
  constructor(lines: string[], range: IndexRange) {
    this.lines = lines;
    this.range = range;
  }

  public get $lines(): string[] {
    return this.lines;
  }

  public set $lines(value: string[]) {
    this.lines = value;
  }

  public get $range(): IndexRange {
    return this.range;
  }

  public set $range(value: IndexRange) {
    this.range = value;
  }
}
