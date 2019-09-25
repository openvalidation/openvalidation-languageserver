import { TypeOptions } from "class-transformer";
import { CommentNode } from "./element/CommentNode";
import { ArrayOperandNode } from "./element/operation/operand/ArrayOperandNode";
import { FunctionOperandNode } from "./element/operation/operand/FunctionOperandNode";
import { OperandNode } from "./element/operation/operand/OperandNode";
import { ConnectedOperationNode } from "./element/operation/ConnectedOperationNode";
import { OperationNode } from "./element/operation/OperationNode";
import { RuleNode } from "./element/RuleNode";
import { UnkownNode } from "./element/UnkownNode";
import { VariableNode } from "./element/VariableNode";

export function getOperationOptions(): TypeOptions {
    return {
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
    };
}

export function getGenericOptions(): TypeOptions {
    return {
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
    };
}