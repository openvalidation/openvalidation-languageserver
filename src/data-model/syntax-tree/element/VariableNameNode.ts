import { Type } from "class-transformer";
import { SyntaxToken } from "ov-language-server-types";
import { Position } from "vscode-languageserver";
import { AliasHelper } from "../../../aliases/AliasHelper";
import { ScopeEnum } from "../../../enums/ScopeEnum";
import { HoverContent } from "../../../helper/HoverContent";
import { CompletionContainer } from "../../../provider/code-completion/CompletionContainer";
import { GenericNode } from "../GenericNode";
import { IndexRange } from "../IndexRange";
import { UnknownNode } from "./UnknownNode";

export class VariableNameNode extends GenericNode {
  private name: string;

  @Type(() => IndexRange)
  private variableNameRange: IndexRange;

  constructor(
    lines: string[],
    range: IndexRange,
    name: string,
    variableNameRange: IndexRange
  ) {
    super(lines, range);
    this.name = name;
    this.variableNameRange = variableNameRange;
  }

  public get $name(): string {
    return this.name;
  }

  public get $variableNameRange(): IndexRange {
    return this.variableNameRange;
  }

  public getChildren(): GenericNode[] {
    return [new UnknownNode(null, [], this.variableNameRange)];
  }

  public getHoverContent(): HoverContent {
    return new HoverContent(this.$range, "Variable: " + this.name);
  }

  public getBeautifiedContent(aliasesHelper: AliasHelper): string {
    return this.$lines.join("\n");
  }

  public getCompletionContainer(position: Position): CompletionContainer {
    return CompletionContainer.init().emptyTransition();
  }

  public getSpecificTokens(): SyntaxToken[] {
    if (!this.$variableNameRange) return [];

    return [
      {
        pattern: ScopeEnum.Variable,
        range: this.$variableNameRange.asRange()
      }
    ];
  }
}
