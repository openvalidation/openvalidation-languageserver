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

    constructor(items: BaseOperandNode[], lines: string[], range: IndexRange, dataType: string, name: string) {
        super(lines, range, dataType, name);
        this.items = items;
    }

    /**
     * Getter parameters
     * @return {BaseOperandNode[]}
     */
    public getItems(): BaseOperandNode[] {
        return this.items;
    }

    public getChildren(): GenericNode[] {
        return this.getItems().map(i => i as unknown as GenericNode);
    }

    /**
     * Setter parameters
     * @param {BaseOperandNode[]} value
     */
    public setItems(value: BaseOperandNode[]) {
        this.items = value;
    }

    public getHoverContent(): HoverContent | null {
        var content: HoverContent = new HoverContent(this.getRange(), "Operand: " + this.getDataType() + "[]");
        return content;
    }

    public getCompletionContainer(position: Position): CompletionContainer {
        var container = CompletionContainer.init();
        if (!this.isComplete()) {
            container.operandTransition(this.getDataType());
        }
        return container;
    }

    public getBeautifiedContent(aliasesHelper: AliasHelper): string {
        return this.getLines().join("\n");
    }

    public isComplete(): boolean {
        return this.items.length > 0;
    }
}