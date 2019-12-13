import { SyntaxToken } from "ov-language-server-types";
import { Position } from "vscode-languageserver";
import { AliasHelper } from "../../../aliases/AliasHelper";
import { ScopeEnum } from "../../../enums/ScopeEnum";
import { HoverContent } from "../../../helper/HoverContent";
import { CompletionContainer } from "../../../provider/code-completion/CompletionContainer";
import { GenericNode } from "../GenericNode";
import { IndexRange } from "../IndexRange";
import { Type } from "class-transformer";
import { UnknownNode } from "./UnknownNode";

export class ActionErrorNode extends GenericNode {
  private errorMessage: string;

  @Type(() => IndexRange)
  private actionErrorRange: IndexRange;

  constructor(
    lines: string[],
    range: IndexRange,
    errorMessage: string,
    actionErrorRange: IndexRange
  ) {
    super(lines, range);
    this.errorMessage = errorMessage;
    this.actionErrorRange = actionErrorRange;
  }

  public get $errorMessage(): string {
    return this.errorMessage;
  }

  public get $actionErrorRange(): IndexRange {
    return this.actionErrorRange;
  }

  public getRelevantChildren(): GenericNode[] {
    return [new UnknownNode(null, [], this.actionErrorRange)];
  }

  public getHoverContent(): HoverContent {
    return new HoverContent(this.$range, "Error-Message: " + this.errorMessage);
  }

  public getBeautifiedContent(aliasesHelper: AliasHelper): string {
    return this.defaultFormatting();
  }

  public getCompletionContainer(position: Position): CompletionContainer {
    return CompletionContainer.init().emptyTransition();
  }

  public getSpecificTokens(): SyntaxToken[] {
    if (!this.$actionErrorRange) return [];

    return [
      {
        pattern: ScopeEnum.StaticString,
        range: this.$actionErrorRange.asRange()
      }
    ];
  }
}
