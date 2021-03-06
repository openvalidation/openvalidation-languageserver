import { Type } from "class-transformer";
import { Position } from "vscode-languageserver";
import { AliasHelper } from "../../../../aliases/AliasHelper";
import { HoverContent } from "../../../../helper/HoverContent";
import { CompletionContainer } from "../../../../provider/code-completion/CompletionContainer";
import { GenericNode } from "../../GenericNode";
import { IndexRange } from "../../IndexRange";
import { ConditionNode } from "./ConditionNode";
import { ConnectedOperationNode } from "./ConnectedOperationNode";
import { ArrayOperandNode } from "./operand/ArrayOperandNode";
import { BaseOperandNode } from "./operand/BaseOperandNode";
import { FunctionOperandNode } from "./operand/FunctionOperandNode";
import { OperandNode } from "./operand/OperandNode";
import { OperatorNode } from "./operand/OperatorNode";
import { TreeTraversal } from "../../../../helper/TreeTraversal";

export class OperationNode extends ConditionNode {
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
  private leftOperand: BaseOperandNode | null;

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
  private rightOperand: BaseOperandNode | null;

  @Type(() => OperatorNode)
  private operator: OperatorNode | null;

  private constrained: boolean;

  constructor(
    leftOperand: BaseOperandNode | null,
    operator: OperatorNode | null,
    rightOperand: BaseOperandNode | null,
    lines: string[],
    range: IndexRange
  ) {
    super(lines, range);
    this.leftOperand = leftOperand;
    this.rightOperand = rightOperand;
    this.operator = operator;
    this.constrained = false;
  }

  public get $leftOperand(): BaseOperandNode | null {
    return this.leftOperand;
  }
  public set $leftOperand(value: BaseOperandNode | null) {
    this.leftOperand = value;
  }

  public get $rightOperand(): BaseOperandNode | null {
    return this.rightOperand;
  }
  public set $rightOperand(value: BaseOperandNode | null) {
    this.rightOperand = value;
  }

  public get $operator(): OperatorNode | null {
    return this.operator;
  }
  public set $operator(value: OperatorNode | null) {
    this.operator = value;
  }

  public get $constrained(): boolean {
    return this.constrained;
  }
  public set $constrained(value: boolean) {
    this.constrained = value;
  }

  public getRelevantChildren(): GenericNode[] {
    const childList: GenericNode[] = [];

    if (!!this.leftOperand) {
      childList.push(this.leftOperand);
    }

    if (!!this.operator) {
      childList.push(this.operator);
    }

    if (!!this.rightOperand) {
      childList.push(this.rightOperand);
    }

    return childList;
  }

  public getHoverContent(): HoverContent {
    let operationString: string = "";
    operationString += !this.$leftOperand ? "" : `${this.$leftOperand.$name} `;
    operationString += !this.$operator
      ? ""
      : `${this.$operator.$lines.join("\n")} `;
    operationString += !this.$rightOperand ? "" : this.$rightOperand.$name;

    const content: HoverContent = new HoverContent(
      this.$range,
      operationString.trim() !== ""
        ? `Operation: ${operationString}`
        : "Operation"
    );
    return content;
  }

  public getCompletionContainer(position: Position): CompletionContainer {
    if (!this.leftOperand) {
      return CompletionContainer.init().operandTransition();
    }

    var fittingChild: GenericNode | null = new TreeTraversal().traverseTree(
      this.getRelevantChildren(),
      position
    );
    if (!!fittingChild) {
      return fittingChild.getCompletionContainer(position);
    }

    if (
      !!this.leftOperand.$range &&
      this.leftOperand.$range.endsBefore(position) &&
      !this.operator
    ) {
      const container = this.leftOperand.getCompletionContainer(position);

      if (container.isEmpty()) {
        container.operatorTransition(this.leftOperand.$dataType);
      }

      return container;
    }

    if (
      !!this.operator &&
      !!this.operator.$range &&
      this.operator.$range.endsBefore(position) &&
      !this.rightOperand
    ) {
      const container = this.operator.getCompletionContainer(position);
      container.operandTransition(
        this.leftOperand.$dataType,
        this.leftOperand.$name
      );
      return container;
    }

    if (
      !!this.rightOperand &&
      !!this.rightOperand.$range &&
      this.rightOperand.$range.endsBefore(position)
    ) {
      const container = this.rightOperand.getCompletionContainer(position);

      if (container.isEmpty()) {
        container.connectionTransition();
      }

      return container;
    }

    if (this.$range.endsBefore(position)) {
      return CompletionContainer.init().connectionTransition();
    }

    return CompletionContainer.init().emptyTransition();
  }

  public isComplete(): boolean {
    return !!this.leftOperand && !!this.operator && !!this.rightOperand;
  }

  public getBeautifiedContent(aliasesHelper: AliasHelper): string {
    let returnString = this.defaultFormatting();

    if (!!this.leftOperand) {
      returnString = returnString.replace(
        this.leftOperand.defaultFormatting(),
        this.leftOperand.getBeautifiedContent(aliasesHelper)
      );
    }

    if (!!this.operator) {
      returnString = returnString.replace(
        this.operator.defaultFormatting(),
        this.operator.getBeautifiedContent(aliasesHelper)
      );
    }

    if (!!this.rightOperand) {
      returnString = returnString.replace(
        this.rightOperand.defaultFormatting(),
        this.rightOperand.getBeautifiedContent(aliasesHelper)
      );
    }

    return returnString;
  }
}
