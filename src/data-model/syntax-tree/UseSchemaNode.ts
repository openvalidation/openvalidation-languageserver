import { SyntaxToken } from "ov-language-server-types";
import { Position } from "vscode-languageserver";
import { AliasHelper } from "../../aliases/AliasHelper";
import { ScopeEnum } from "../../enums/ScopeEnum";
import { HoverContent } from "../../helper/HoverContent";
import { CompletionContainer } from "../../provider/code-completion/CompletionContainer";
import { GenericNode } from "./GenericNode";
import { IndexRange } from "./IndexRange";
import { KeywordNode } from "./KeywordNode";

export class UseSchemaNode extends GenericNode {
  private lineNumber: number;
  private line: string;
  private useSchemaLength: number = "USE SCHEMA".length;
  private schemaText: string;

  constructor(lineNumber: number, line: string, schemaText: string) {
    super([line], IndexRange.create(lineNumber, 0, lineNumber, line.length), [
      new KeywordNode(
        [line.substring(0, "USE SCHEMA".length)],
        IndexRange.create(lineNumber, 0, lineNumber, "USE SCHEMA".length)
      )
    ]);
    this.lineNumber = lineNumber;
    this.line = line;
    this.schemaText = schemaText;
  }
  public getRelevantChildren(): GenericNode[] {
    const childList: GenericNode[] = [];
    return childList;
  }

  public getHoverContent(): HoverContent {
    const content: HoverContent = new HoverContent(
      this.$range,
      "```json\n" + `${this.schemaText}\n` + "```"
    );
    return content;
  }

  public getCompletionContainer(range: Position): CompletionContainer {
    return CompletionContainer.init().emptyTransition();
  }

  public getBeautifiedContent(aliasesHelper: AliasHelper): string {
    return this.$lines.join("\\n");
  }

  public getSpecificTokens(): SyntaxToken[] {
    const textRange = IndexRange.create(
      this.lineNumber,
      this.useSchemaLength,
      this.lineNumber,
      this.line.length
    );

    return [
      {
        pattern: ScopeEnum.StaticString,
        range: textRange.asRange()
      }
    ];
  }
}
