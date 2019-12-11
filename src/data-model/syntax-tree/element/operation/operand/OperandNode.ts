import { Position } from "vscode-languageserver";
import { AliasHelper } from "../../../../../aliases/AliasHelper";
import { ScopeEnum } from "../../../../../enums/ScopeEnum";
import { HoverContent } from "../../../../../helper/HoverContent";
import { CompletionContainer } from "../../../../../provider/code-completion/CompletionContainer";
import { IStateTransition } from "../../../../../provider/code-completion/states/state-constructor/IStateTransition";
import { GenericNode } from "../../../GenericNode";
import { IndexRange } from "../../../IndexRange";
import { BaseOperandNode } from "./BaseOperandNode";
import { SyntaxToken } from "ov-language-server-types";

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
    var container: CompletionContainer = CompletionContainer.init();
    if (this.$range.includesPosition(position)) {
      var constructor: IStateTransition = {
        filterStartText: this.$name,
        range: this.$range
      };
      container.operandTransition(this.$dataType, this.$name, constructor);
    }
    return container;
  }

  public isComplete(): boolean {
    return false;
  }

  public getBeautifiedContent(aliasesHelper: AliasHelper): string {
    return this.defaultFormatting();
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

  public getSpecificTokens(): SyntaxToken[] {
    if (!this.$range) return [];

    return [
      {
        range: this.$range.asRange(),
        pattern: this.getOperandScope()
      }
    ];
  }
}
