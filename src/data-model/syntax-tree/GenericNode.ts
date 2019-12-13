import { Type } from "class-transformer";
import { SyntaxToken } from "ov-language-server-types";
import { String } from "typescript-string-operations";
import { Position, TextEdit } from "vscode-languageserver";
import { AliasHelper } from "../../aliases/AliasHelper";
import { ScopeEnum } from "../../enums/ScopeEnum";
import { FormattingHelper } from "../../helper/FormattingHelper";
import { HoverContent } from "../../helper/HoverContent";
import { CompletionContainer } from "../../provider/code-completion/CompletionContainer";
import { IndexRange } from "./IndexRange";
import { KeywordNode } from "./KeywordNode";
/**
 * GenericNode for all elements of the syntax-tree
 *
 * @export
 * @abstract
 * @class GenericNode
 */
export abstract class GenericNode {
  private lines: string[];

  @Type(() => IndexRange)
  private range: IndexRange;

  @Type(() => KeywordNode)
  private keywords: KeywordNode[];

  /**
   * Creates an instance of GenericNode.
   * @param {string[]} lines lines of the node
   * @param {IndexRange} range scope of the node
   * @memberof GenericNode
   */
  constructor(lines: string[], range: IndexRange, keywords?: KeywordNode[]) {
    this.lines = lines;
    this.range = range;
    this.keywords = !keywords ? [] : keywords;
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

  public get $keywords(): KeywordNode[] {
    return this.keywords;
  }

  public set $keywords(keywords: KeywordNode[]) {
    this.keywords = keywords;
  }

  /**
   * Generates a list of all relevant children for tree-traversal
   *
   * @abstract
   * @returns {GenericNode[]}
   * @memberof GenericNode
   */
  public abstract getRelevantChildren(): GenericNode[];

  /**
   * Generates a list of all relevant children for tree-traversal.
   * Defaults to the `GetChildren` method but enables a more specific hovering function
   *
   * @returns {GenericNode[]}
   * @memberof GenericNode
   */
  public getChildren(): GenericNode[] {
    return this.getRelevantChildren();
  }

  /**
   * Generates the hovering content which should be shown to the user
   *
   * @abstract
   * @returns {(HoverContent | null)}
   * @memberof GenericNode
   */
  public abstract getHoverContent(): HoverContent;

  /**
   * Generates the beautified content and returns it as a string
   * This is used for the formatting-function
   *
   * @abstract
   * @param {AliasHelper} aliasesHelper aliashelper if the aliases are required
   * @returns {string} beautified content
   * @memberof GenericNode
   */
  public abstract getBeautifiedContent(aliasesHelper: AliasHelper): string;

  /**
   * Calculates the completion-state with the completion-container
   *
   * @abstract
   * @param {Position} position position of the request
   * @returns {CompletionContainer}
   * @memberof GenericNode
   */
  public abstract getCompletionContainer(
    position: Position
  ): CompletionContainer;

  /**
   * Generates a list of edits for formatting this element
   *
   * @returns {TextEdit[]} text-edits that need to be done for the formatting of this element
   * @memberof OvRule
   */
  public formatCode(aliasHelper: AliasHelper): TextEdit[] {
    const textEdits: TextEdit[] = [];
    const formattedString: string = this.getBeautifiedContent(aliasHelper);
    const formattedLines: string[] = formattedString
      .split("\n")
      .filter(line => !String.IsNullOrWhiteSpace(line));

    const textEdit: TextEdit = {
      newText: formattedLines.join("\n"),
      range: this.$range.asRange()
    };
    textEdits.push(textEdit);

    return textEdits;
  }

  /**
   * Default formatting for all nodes which is the removing of all duplicate whitespace
   *
   * @returns {string} formatted lines in one string, joined by `\n`
   * @memberof GenericNode
   */
  public defaultFormatting(): string {
    return this.$lines
      .map(line =>
        FormattingHelper.removeDuplicateWhitespaceFromLine(line).trim()
      )
      .join("\n");
  }

  /**
   * returns the tokens of the element which are required for syntax-highlighting
   * this methods handles the generic tokens like keywords
   *
   * @abstract
   * @returns {SyntaxToken[]}
   * @memberof GenericNode
   */
  public getTokens(): SyntaxToken[] {
    var tokens: SyntaxToken[] = [];

    if (!!this.$keywords) {
      for (const keyword of this.$keywords) {
        tokens.push({
          range: keyword.$range.asRange(),
          pattern: ScopeEnum.Keyword
        });
      }
    }

    tokens.push(...this.getSpecificTokens());

    for (const child of this.getRelevantChildren()) {
      tokens.push(...child.getTokens());
    }

    return tokens;
  }

  /**
   * returns the tokens of the element which are required for syntax-highlighting
   * this method can be overloaded by children if they require specific tokens
   *
   * @abstract
   * @returns {SyntaxToken[]}
   * @memberof GenericNode
   */
  public getSpecificTokens(): SyntaxToken[] {
    return [];
  }

  public modifyRangeOfEveryNode(lineChange: number): void {
    if (!this.$range) return;
    this.$range.moveLines(lineChange);

    // Modify range for every keyword
    for (const node of this.$keywords) {
      if (!!node.$range) {
        node.$range.moveLines(lineChange);
      }
    }

    // Modify range for every child
    for (const child of this.getRelevantChildren()) {
      child.modifyRangeOfEveryNode(lineChange);
    }
  }
}
