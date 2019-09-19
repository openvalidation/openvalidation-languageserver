import { Type } from "class-transformer";
import { Position } from "vscode-languageserver";
import { CompletionType } from "../../../../../enums/CompletionType";
import { HoverContent } from "../../../../../helper/HoverContent";
import { CompletionContainer } from "../../../../../provider/code-completion/CompletionContainer";
import { GenericNode } from "../../../GenericNode";
import { IndexRange } from "../../../IndexRange";
import { ConnectedOperationNode } from "../../operation/ConnectedOperationNode";
import { OperationNode } from "../../operation/OperationNode";
import { ArrayOperandNode } from "./ArrayOperandNode";
import { OperandNode } from "./OperandNode";
import { AliasHelper } from "src/aliases/AliasHelper";

export class FunctionOperandNode extends OperandNode {
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
    private parameters: OperandNode[];

    constructor(parameters: OperandNode[], lines: string[], range: IndexRange, dataType: string, name: string) {
        super(lines, range, dataType, name);
        this.parameters = parameters;
    }

    /**
     * Getter parameters
     * @return {OperandNode[]}
     */
    public getParameters(): OperandNode[] {
        return this.parameters;
    }

    public getChildren(): GenericNode[] {
        return this.getParameters();
    }

    /**
     * Setter parameters
     * @param {OperandNode[]} value
     */
    public setParameters(value: OperandNode[]) {
        this.parameters = value;
    }

    public getHoverContent(): HoverContent | null {
        var content: HoverContent = new HoverContent(this.getRange());

        content.setContent("Function " + this.getName() + ": " + this.getDataType());

        return content;
    }

    public getCompletionContainer(range: Position): CompletionContainer {
        var container = new CompletionContainer(CompletionType.Operand);
        container.specificDataType(this.getDataType());

        if (this.parameters.length > 0) {
            container.specifyPrependingText(", ");
        }

        return container;
    }

    public isComplete(): boolean {
        return this.parameters.length > 0;
    }
    
    public getBeautifiedContent(aliasesHelper: AliasHelper): string {
        return this.getLines().join("\n");
    }
}
