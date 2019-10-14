import { Position } from "vscode-languageserver";
import { AliasHelper } from "../../../aliases/AliasHelper";
import { HoverContent } from "../../../helper/HoverContent";
import { CompletionContainer } from "../../../provider/code-completion/CompletionContainer";
import { GenericNode } from "../GenericNode";
import { IndexRange } from "../IndexRange";

export class VariableNameNode extends GenericNode {
  private name: string;

  constructor(lines: string[], range: IndexRange, name: string) {
    super(lines, range);
    this.name = name;
  }

  public get $name(): string {
    return this.name;
  }

  public getChildren(): GenericNode[] {
    return [];
  }

  public getHoverContent(): HoverContent {
    return new HoverContent(this.$range, "Variable-Name: " + this.name);
  }

  public getBeautifiedContent(aliasesHelper: AliasHelper): string {
    return this.$lines.join("\n");
  }

  public getCompletionContainer(position: Position): CompletionContainer {
    return CompletionContainer.init().emptyTransition();
  }
}
