import { Type } from "class-transformer";
import { Position } from "vscode-languageserver";
import { AliasHelper } from "../../../aliases/AliasHelper";
import { CompletionType } from "../../../enums/CompletionType";
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
    private content: GenericNode;

    constructor(content: OperandNode, lines: string[], range: IndexRange) {
        super(lines, range);
        this.content = content;
    }

    public getContent(): GenericNode {
        return this.content;
    }

    public getChildren(): GenericNode[] {
        return [];
    }

    public getHoverContent(): HoverContent | null | null {
        if (!this.content) return null;
        return this.content.getHoverContent();
    }

    public getCompletionContainer(range: Position): CompletionContainer {
        if (!this.content) return new CompletionContainer(CompletionType.None);

        var container = this.content.getCompletionContainer(range);

        if (container.isEmpty() || container.containsLogicalOperator()) {
            container = new CompletionContainer(CompletionType.Then);
            container.addType(CompletionType.As);
            container.addType(CompletionType.LogicalOperator);
        } else if (this.content.isComplete()) {
            container.addType(CompletionType.As);
        }
        return container;
    }

    public isComplete(): boolean {
        return true;
    }
    
    public getBeautifiedContent(aliasesHelper: AliasHelper): string {
        return this.content.getBeautifiedContent(aliasesHelper);
    }
}