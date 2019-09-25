import { Type } from "class-transformer";
import { CommentNode } from "../../data-model/syntax-tree/element/CommentNode";
import { ConnectedOperationNode } from "../../data-model/syntax-tree/element/operation/ConnectedOperationNode";
import { ArrayOperandNode } from "../../data-model/syntax-tree/element/operation/operand/ArrayOperandNode";
import { FunctionOperandNode } from "../../data-model/syntax-tree/element/operation/operand/FunctionOperandNode";
import { OperandNode } from "../../data-model/syntax-tree/element/operation/operand/OperandNode";
import { OperationNode } from "../../data-model/syntax-tree/element/operation/OperationNode";
import { RuleNode } from "../../data-model/syntax-tree/element/RuleNode";
import { UnkownNode } from "../../data-model/syntax-tree/element/UnkownNode";
import { VariableNode } from "../../data-model/syntax-tree/element/VariableNode";
import { GenericNode } from "../../data-model/syntax-tree/GenericNode";

export class CompletionResponse {
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
    private scope: GenericNode;

    constructor(scope: GenericNode) {
        this.scope = scope;
    }
    
    public getScope(): GenericNode {
        return this.scope;
    }
}