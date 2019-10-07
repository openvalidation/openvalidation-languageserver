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
import { SyntaxHighlightingCapture } from "../../../../../provider/syntax-highlighting/SyntaxHighlightingCapture";

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
    public get $items(): BaseOperandNode[] {
        return this.items;
    }

    public getChildren(): GenericNode[] {
        return this.$items.map(i => i as unknown as GenericNode);
    }

    /**
     * Setter parameters
     * @param {BaseOperandNode[]} value
     */
    public setItems(value: BaseOperandNode[]) {
        this.items = value;
    }

    public getHoverContent(): HoverContent {
        var content: HoverContent = new HoverContent(this.$range, "Operand: " + this.getDataType() + "[]");
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
        return this.defaultFormatting();
    }

    public isComplete(): boolean {
        return this.items.length > 0;
    }

    public getPatternInformation(aliasesHelper: AliasHelper): SyntaxHighlightingCapture | null {        
        var capture = new SyntaxHighlightingCapture();

        for (const item of this.$items) {
            var tmpCapture = item.getPatternInformation(aliasesHelper);
            if (!tmpCapture) continue;

            capture.addCapture(...tmpCapture.$capture);
            capture.addRegexToMatch(tmpCapture.$match);
        }

        return capture;
    }
}