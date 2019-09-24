import { Type } from "class-transformer";
import { Position } from "vscode-languageserver";
import { AliasHelper } from "../../../aliases/AliasHelper";
import { HoverContent } from "../../../helper/HoverContent";
import { CompletionContainer } from "../../../provider/code-completion/CompletionContainer";
import { GenericNode } from "../GenericNode";
import { IndexRange } from "../IndexRange";
import { CommentNode } from "./CommentNode";
import { ConnectedOperationNode } from "./operation/ConnectedOperationNode";
import { ArrayOperandNode } from "./operation/operand/ArrayOperandNode";
import { FunctionOperandNode } from "./operation/operand/FunctionOperandNode";
import { OperandNode } from "./operation/operand/OperandNode";
import { OperationNode } from "./operation/OperationNode";
import { RuleNode } from "./RuleNode";
import { VariableNode } from "./VariableNode";
import { CompletionState } from "../../../provider/code-completion/CompletionStates";

export class UnkownNode extends GenericNode {
    @Type(() => GenericNode, {
        discriminator: {
            property: "type",
            subTypes: [
                { value: CommentNode, name: "CommentNode" },
                { value: VariableNode, name: "VariableNode" },
                { value: RuleNode, name: "RuleNode" },
                { value: OperationNode, name: "OperationNode" },
                { value: ConnectedOperationNode, name: "ConnectedOperationNode" },
                { value: FunctionOperandNode, name: "FunctionOperandNode" },
                { value: OperandNode, name: "OperandNode" },
                { value: UnkownNode, name: "UnkownNode" },
                { value: ArrayOperandNode, name: "ArrayOperandNode" }
            ]
        }
    })
    private content: GenericNode | null;

    constructor(content: GenericNode | null, lines: string[], range: IndexRange) {
        super(lines, range);
        this.content = content;
    }

    public getContent(): GenericNode | null {
        return this.content;
    }

    public getChildren(): GenericNode[] {
        return [];
    }

    public getHoverContent(): HoverContent | null | null {
        if (!this.content) return null;
        return this.content.getHoverContent();
    }
    
    public getCompletionContainer(position: Position): CompletionContainer {
        if (!this.content) return CompletionContainer.create(CompletionState.OperandMissing);

        var container: CompletionContainer = this.content.getCompletionContainer(position);
        if (container.isEmpty()) {
            container.addState(CompletionState.Operand);
            container.addState(CompletionState.UnkownOperand);
        } else if (this.content.isComplete()) {
            container.addState(CompletionState.RuleEnd);
            container.addState(CompletionState.UnkownOperand);
        }

        return container;
    }

    public isComplete(): boolean {
        return true;
    }
    
    public getBeautifiedContent(aliasesHelper: AliasHelper): string {
        if (!this.content)
            return this.getLines().join("\n");
        return this.content.getBeautifiedContent(aliasesHelper);
    }
}