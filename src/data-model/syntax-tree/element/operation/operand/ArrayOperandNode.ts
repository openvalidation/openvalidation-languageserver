import { Type } from "class-transformer";
import { Position } from "vscode-languageserver";
import { AliasHelper } from "../../../../../aliases/AliasHelper";
import { HoverContent } from "../../../../../helper/HoverContent";
import { CompletionContainer } from "../../../../../provider/code-completion/CompletionContainer";
import { GenericNode } from "../../../GenericNode";
import { IndexRange } from "../../../IndexRange";
import { ConnectedOperationNode } from "../ConnectedOperationNode";
import { OperationNode } from "../OperationNode";
import { BaseOperandNode } from "./BaseOperandNode";
import { FunctionOperandNode } from "./FunctionOperandNode";
import { OperandNode } from "./OperandNode";
import { SyntaxToken } from "ov-language-server-types";

export class ArrayOperandNode extends BaseOperandNode {
  @Type(() => BaseOperandNode, {
    discriminator: {
      property: "type",
      subTypes: [
        { value: OperationNode, name: "OperationNode" },
        { value: ConnectedOperationNode, name: "ConnectedOperationNode" },
        { value: FunctionOperandNode, name: "FunctionOperandNode" },
        { value: OperandNode, name: "OperandNode" },
        { value: ArrayOperandNode, name: "ArrayOperandNode" }
      ]
    }
  })
  private items: BaseOperandNode[];

  constructor(
    items: BaseOperandNode[],
    lines: string[],
    range: IndexRange,
    dataType: string,
    name: string
  ) {
    super(lines, range, dataType, name);
    this.items = items;
  }

  /**
   * Getter parameters
   * @return {BaseOperandNode[]}
   */
  public get $items(): BaseOperandNode[] {
    return this.items;
  }

  public getRelevantChildren(): GenericNode[] {
    return this.$items.map(i => (i as unknown) as GenericNode);
  }

  /**
   * Setter parameters
   * @param {BaseOperandNode[]} value
   */
  public setItems(value: BaseOperandNode[]) {
    this.items = value;
  }

  public getHoverContent(): HoverContent {
    const content: HoverContent = new HoverContent(
      this.$range,
      "Operand: " + this.$dataType + "[]"
    );
    return content;
  }

  public getCompletionContainer(position: Position): CompletionContainer {
    const container = CompletionContainer.init();
    if (!this.isComplete()) {
      container.operandTransition(this.$dataType);
    }
    return container;
  }

  public getBeautifiedContent(aliasesHelper: AliasHelper): string {
    return this.defaultFormatting();
  }

  public isComplete(): boolean {
    return this.items.length > 0;
  }

  public getSpecificTokens(): SyntaxToken[] {
    var returnList = [];

    for (const item of this.$items) {
      returnList.push(...item.getSpecificTokens());
    }

    return returnList;
  }
}
