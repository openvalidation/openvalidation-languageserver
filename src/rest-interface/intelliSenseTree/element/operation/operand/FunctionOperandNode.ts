import { Type } from "class-transformer";
import { AliasHelper } from "src/aliases/AliasHelper";
import { Position } from "vscode-languageserver";
import { HoverContent } from "../../../../../helper/HoverContent";
import { CompletionContainer } from "../../../../../provider/code-completion/CompletionContainer";
import { GenericNode } from "../../../GenericNode";
import { IndexRange } from "../../../IndexRange";
import { ConnectedOperationNode } from "../../operation/ConnectedOperationNode";
import { OperationNode } from "../../operation/OperationNode";
import { ArrayOperandNode } from "./ArrayOperandNode";
import { BaseOperandNode } from "./BaseOperandNode";
import { OperandNode } from "./OperandNode";

export class FunctionOperandNode extends BaseOperandNode {
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
    private parameters: BaseOperandNode[];

    constructor(parameters: BaseOperandNode[], lines: string[], range: IndexRange, dataType: string, name: string) {
        super(lines, range, dataType, name);
        this.parameters = parameters;
    }

    /**
     * Getter parameters
     * @return {BaseOperandNode[]}
     */
    public getParameters(): BaseOperandNode[] {
        return this.parameters;
    }

    public getChildren(): GenericNode[] {
        return this.getParameters();
    }

    /**
     * Setter parameters
     * @param {BaseOperandNode[]} value
     */
    public setParameters(value: BaseOperandNode[]) {
        this.parameters = value;
    }

    public getHoverContent(): HoverContent | null {
        var content: HoverContent = new HoverContent(this.getRange());

        content.setContent("Function " + this.getName() + ": " + this.getDataType());

        return content;
    }

    public completionBeforeNode(): CompletionContainer {
        return CompletionContainer.empty();
    }

    public completionAfterNode(): CompletionContainer {
        return CompletionContainer.operator(this.getDataType());
    }

    public completionInsideNode(range: Position): CompletionContainer {
        var container = CompletionContainer.operand(this.getDataType())

        if (this.parameters.length > 0) {
            container.specifyPrependingText(", ");
        }

        // TODO: If "isComplete" return also operation with higher priority

        return container;
    }

    public isComplete(): boolean {
        return this.parameters.length > 0;
    }
    
    public getBeautifiedContent(aliasesHelper: AliasHelper): string {
        return this.getLines().join("\n");
    }
}
