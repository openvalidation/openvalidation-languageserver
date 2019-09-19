import { Type } from "class-transformer";
import { CompletionType } from "../../../../../enums/CompletionType";
import { HoverContent } from "../../../../../helper/HoverContent";
import { CompletionContainer } from "../../../../../provider/code-completion/CompletionContainer";
import { GenericNode } from "../../../GenericNode";
import { IndexRange } from "../../../IndexRange";
import { ConnectedOperationNode } from "../../operation/ConnectedOperationNode";
import { OperationNode } from "../../operation/OperationNode";
import { FunctionOperandNode } from "./FunctionOperandNode";
import { OperandNode } from "./OperandNode";
import { Position } from "vscode-languageserver";
import { AliasHelper } from "../../../../../aliases/AliasHelper";

export class ArrayOperandNode extends OperandNode {
    @Type(() => OperandNode, {
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
    private items: OperandNode[];

    constructor(items: OperandNode[], lines: string[], range: IndexRange, dataType: string, name: string) {
        super(lines, range, dataType, name);
        this.items = items;
    }

    /**
     * Getter parameters
     * @return {OperandNode[]}
     */
    public getItems(): OperandNode[] {
        return this.items;
    }

    public getChildren(): GenericNode[] {
        return this.getItems().map(i => i as unknown as GenericNode);
    }

    /**
     * Setter parameters
     * @param {OperandNode[]} value
     */
    public setItems(value: OperandNode[]) {
        this.items = value;
    }

    public getHoverContent(): HoverContent | null {
        var content: HoverContent = new HoverContent(this.getRange());

        content.setContent("Operand: " + this.getDataType() + "[]");

        return content;
    }

    public getCompletionContainer(range: Position): CompletionContainer {
        var container = new CompletionContainer(CompletionType.Operand);
        container.specificDataType(this.getDataType());
        container.specifyPrependingText(", ");
        return container;
    }
    
    public getBeautifiedContent(aliasesHelper: AliasHelper): string {
        return this.getLines().join("\n");
    }
}