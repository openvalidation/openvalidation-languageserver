import { String } from "typescript-string-operations";
import { Position } from "vscode-languageserver";
import { AliasHelper } from "../../../../../aliases/AliasHelper";
import { ScopeEnum } from "../../../../../enums/ScopeEnum";
import { HoverContent } from "../../../../../helper/HoverContent";
import { CompletionContainer } from "../../../../../provider/code-completion/CompletionContainer";
import { SyntaxHighlightingCapture } from "../../../../../provider/syntax-highlighting/SyntaxHighlightingCapture";
import { GenericNode } from "../../../GenericNode";
import { IndexRange } from "../../../IndexRange";
import { IStateTransition } from "src/provider/code-completion/states/state-constructor/IStateTransition";

export class OperatorNode extends GenericNode {
  private dataType: string;
  private operator: string;
  private validType: string;

  constructor(
    lines: string[],
    range: IndexRange,
    dataType: string,
    operator: string,
    validType: string
  ) {
    super(lines, range);
    this.dataType = dataType;
    this.operator = operator;
    this.validType = validType;
  }

  /**
   * Getter dataType
   * @return {string}
   */
  public get $dataType(): string {
    return this.dataType;
  }

  /**
   * Getter validType
   * @return {string}
   */
  public get $validType(): string {
    return this.validType;
  }

  /**
   * Getter operator
   * @return {string}
   */
  public getOperator(): string {
    return this.operator;
  }

  public getChildren(): GenericNode[] {
    const childList: GenericNode[] = [];
    return childList;
  }

  public getHoverContent(): HoverContent {
    const content: string =
      "Operator " + this.getOperator() + ": " + this.$dataType;
    const hoverContent: HoverContent = new HoverContent(this.$range, content);
    return hoverContent;
  }

  public getCompletionContainer(position: Position): CompletionContainer {
    var container: CompletionContainer = CompletionContainer.init();
    if (this.$range.includesPosition(position)) {
      var constructor: IStateTransition = {
        filterStartText: this.$lines.join("\n"),
        range: this.$range
      };
      container.operatorTransition(this.$validType, constructor);
    }
    return container;
  }

  public isComplete(): boolean {
    return true;
  }

  public getBeautifiedContent(aliasesHelper: AliasHelper): string {
    return this.defaultFormatting();
  }

  public getPatternInformation(
    aliasesHelper: AliasHelper
  ): SyntaxHighlightingCapture | null {
    const returnString = this.$lines.join("\n");
    if (String.IsNullOrWhiteSpace(returnString)) {
      return null;
    } else {
      const capture = new SyntaxHighlightingCapture();
      capture.addRegexGroupAndCapture(returnString, ScopeEnum.Keyword);
      return capture;
    }
  }
}
