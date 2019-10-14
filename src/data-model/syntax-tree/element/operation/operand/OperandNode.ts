import { String } from "typescript-string-operations";
import { Position } from "vscode-languageserver";
import { AliasHelper } from "../../../../../aliases/AliasHelper";
import { ScopeEnum } from "../../../../../enums/ScopeEnum";
import { HoverContent } from "../../../../../helper/HoverContent";
import { StringHelper } from "../../../../../helper/StringHelper";
import { CompletionContainer } from "../../../../../provider/code-completion/CompletionContainer";
import { SyntaxHighlightingCapture } from "../../../../../provider/syntax-highlighting/SyntaxHighlightingCapture";
import { GenericNode } from "../../../GenericNode";
import { IndexRange } from "../../../IndexRange";
import { BaseOperandNode } from "./BaseOperandNode";

export class OperandNode extends BaseOperandNode {
  private isStatic: boolean;

  constructor(
    lines: string[],
    range: IndexRange,
    dataType: string,
    name: string,
    isStatic?: boolean
  ) {
    super(lines, range, dataType, name);
    this.isStatic = !isStatic ? false : isStatic;
  }

  public get $isStatic(): boolean {
    return this.isStatic;
  }

  public getChildren(): GenericNode[] {
    const childList: GenericNode[] = [];
    return childList;
  }

  public getHoverContent(): HoverContent {
    const stringContent: string =
      "Operand " + this.$name + ": " + this.$dataType;
    const content: HoverContent = new HoverContent(this.$range, stringContent);
    return content;
  }

  public getCompletionContainer(position: Position): CompletionContainer {
    return CompletionContainer.init();
  }

  public isComplete(): boolean {
    return false;
  }

  public getBeautifiedContent(aliasesHelper: AliasHelper): string {
    return this.defaultFormatting();
  }

  public getPatternInformation(
    aliasesHelper: AliasHelper
  ): SyntaxHighlightingCapture | null {
    const joinedLines: string = this.$lines.join("\n");
    if (String.IsNullOrWhiteSpace(joinedLines)) {
      return null;
    }

    if (this.$name.indexOf(".") !== -1 && joinedLines.indexOf(".") === -1) {
      return this.getPatternInformationForComplexSchema(aliasesHelper);
    }

    const splittedOperand = joinedLines.split(
      new RegExp(`(${StringHelper.makeStringRegExSafe(this.$name)})`, "gi")
    );
    const capture = new SyntaxHighlightingCapture();

    capture.addRegexGroupAndCapture(splittedOperand[0], ScopeEnum.Empty);
    capture.addRegexGroupAndCapture(
      StringHelper.makeStringRegExSafe(splittedOperand[1]),
      this.getOperandScope()
    );

    let duplicateOperands: string = splittedOperand[2];
    for (let index = 3; index < splittedOperand.length; index++) {
      const split = splittedOperand[index];
      duplicateOperands += split;
    }

    capture.addRegexGroupAndCapture(duplicateOperands, ScopeEnum.Empty);

    return capture;
  }

  /**
   * Completion for operands with an `Of`-keyword
   *
   * @param {AliasHelper} aliasesHelper
   * @returns {(SyntaxHighlightingCapture | null)}
   * @memberof OperandNode
   */
  private getPatternInformationForComplexSchema(
    aliasesHelper: AliasHelper
  ): SyntaxHighlightingCapture | null {
    const splittedName = this.$name.split(".").reverse();
    const splittedOperand = this.$lines
      .join("\n")
      .split(
        new RegExp(
          `(${StringHelper.getOredRegExForWords(...splittedName)})`,
          "gi"
        )
      );
    const ofAliases = aliasesHelper.getOfKeywords();
    const capture: SyntaxHighlightingCapture = new SyntaxHighlightingCapture();

    for (const text of splittedOperand) {
      let scope: ScopeEnum = ScopeEnum.Empty;
      if (splittedName.includes(text)) {
        scope = ScopeEnum.Variable;
      } else if (ofAliases.includes(text.trim().toUpperCase())) {
        scope = ScopeEnum.Keyword;
      }
      capture.addRegexGroupAndCapture(text, scope);
    }

    return capture;
  }

  private getOperandScope(): ScopeEnum {
    if (this.$isStatic) {
      if (this.$dataType === "Decimal") {
        return ScopeEnum.StaticNumber;
      } else {
        return ScopeEnum.StaticString;
      }
    } else {
      return ScopeEnum.Variable;
    }
  }
}
