import { Position } from "vscode-languageserver";
import { AliasHelper } from "../../../../../aliases/AliasHelper";
import { HoverContent } from "../../../../../helper/HoverContent";
import { CompletionContainer } from "../../../../../provider/code-completion/CompletionContainer";
import { SyntaxHighlightingCapture } from "../../../../../provider/syntax-highlighting/SyntaxHighlightingCapture";
import { GenericNode } from "../../../GenericNode";
import { IndexRange } from "../../../IndexRange";

export abstract class BaseOperandNode extends GenericNode {
  private dataType: string;
  private name: string;

  constructor(
    lines: string[],
    range: IndexRange,
    dataType: string,
    name: string
  ) {
    super(lines, range);
    this.dataType = dataType;
    this.name = name;
  }

  /**
   * Getter dataType
   * @return {string}
   */
  public get $dataType(): string {
    return this.dataType;
  }

  /**
   * Getter name
   * @return {string}
   */
  public get $name(): string {
    return this.name;
  }

  public abstract getChildren(): GenericNode[];
  public abstract getHoverContent(): HoverContent;
  public abstract getCompletionContainer(range: Position): CompletionContainer;
  public abstract isComplete(): boolean;
  public abstract getBeautifiedContent(aliasesHelper: AliasHelper): string;
  public abstract getPatternInformation(
    aliasesHelper: AliasHelper
  ): SyntaxHighlightingCapture | null;
}
