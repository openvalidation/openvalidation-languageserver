import { Type } from "class-transformer";
import { CommentNode } from "../intelliSenseTree/element/CommentNode";
import { ConnectedOperationNode } from "../intelliSenseTree/element/operation/ConnectedOperationNode";
import { ArrayOperandNode } from "../intelliSenseTree/element/operation/operand/ArrayOperandNode";
import { FunctionOperandNode } from "../intelliSenseTree/element/operation/operand/FunctionOperandNode";
import { OperandNode } from "../intelliSenseTree/element/operation/operand/OperandNode";
import { OperationNode } from "../intelliSenseTree/element/operation/OperationNode";
import { RuleNode } from "../intelliSenseTree/element/RuleNode";
import { UnkownNode } from "../intelliSenseTree/element/UnkownNode";
import { VariableNode } from "../intelliSenseTree/element/VariableNode";
import { GenericNode } from "../intelliSenseTree/GenericNode";

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