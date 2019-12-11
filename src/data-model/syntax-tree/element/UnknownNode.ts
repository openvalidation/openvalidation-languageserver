import { Type } from "class-transformer";
import { Position } from "vscode-languageserver";
import { AliasHelper } from "../../../aliases/AliasHelper";
import { HoverContent } from "../../../helper/HoverContent";
import { CompletionContainer } from "../../../provider/code-completion/CompletionContainer";
import { GenericNode } from "../GenericNode";
import { IndexRange } from "../IndexRange";
import { ConnectedOperationNode } from "./operation/ConnectedOperationNode";
import { ArrayOperandNode } from "./operation/operand/ArrayOperandNode";
import { BaseOperandNode } from "./operation/operand/BaseOperandNode";
import { FunctionOperandNode } from "./operation/operand/FunctionOperandNode";
import { OperandNode } from "./operation/operand/OperandNode";
import { OperationNode } from "./operation/OperationNode";

export class UnknownNode extends GenericNode {
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
  private content: BaseOperandNode | null;

  constructor(
    content: BaseOperandNode | null,
    lines: string[],
    range: IndexRange
  ) {
    super(lines, range);
    this.content = content;
  }

  public get $content(): BaseOperandNode | null {
    return this.content;
  }

  public getChildren(): GenericNode[] {
    const children: GenericNode[] = [];

    if (!!this.content) {
      children.push(this.content);
    }

    return children;
  }

  public getHoverContent(): HoverContent {
    if (!this.content) {
      return new HoverContent(this.$range, "Unkown-Element");
    }

    const hoverContent = this.content.getHoverContent();
    const ownContent = "`Unkown-Element` with " + hoverContent.$content;
    hoverContent.$content = ownContent;
    return hoverContent;
  }

  public getCompletionContainer(position: Position): CompletionContainer {
    if (!this.content) {
      return CompletionContainer.init().operandTransition();
    }

    const container: CompletionContainer = this.content.getCompletionContainer(
      position
    );
    if (container.isEmpty()) {
      container.operatorTransition(this.content.$dataType);
      container.asKeywordTransition();
    } else if (this.content.isComplete()) {
      container.thenKeywordTransition();
      container.asKeywordTransition();
    }

    return container;
  }

  public getBeautifiedContent(aliasesHelper: AliasHelper): string {
    if (!this.content) {
      return this.defaultFormatting();
    }
    return this.content.getBeautifiedContent(aliasesHelper);
  }
}
