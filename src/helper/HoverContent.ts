import { IndexRange } from "src/data-model/syntax-tree/IndexRange";

/**
 * Class that contains the string-content and the range of the hovered content
 *
 * @export
 * @class HoverContent
 */
export class HoverContent {
  private content: string;
  private range: IndexRange;

  /**
   * Creates an instance of HoverContent.
   * @param {IndexRange} range range of the hovered content
   * @param {string} content beautified content which will be shown to the user
   * @memberof HoverContent
   */
  constructor(range: IndexRange, content: string) {
    this.content = content;
    this.range = range;
  }

  public get $content(): string {
    return this.content;
  }
  public set $content(value: string) {
    this.content = value;
  }
  public get $range(): IndexRange {
    return this.range;
  }
  public set $range(value: IndexRange) {
    this.range = value;
  }
}
