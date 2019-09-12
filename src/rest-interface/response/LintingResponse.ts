import { Type } from "class-transformer";
import { CommentNode } from "../intelliSenseTree/element/CommentNode";
import { ArrayOperandNode } from "../intelliSenseTree/element/operation/operand/ArrayOperandNode";
import { FunctionOperandNode } from "../intelliSenseTree/element/operation/operand/FunctionOperandNode";
import { OperandNode } from "../intelliSenseTree/element/operation/operand/OperandNode";
import { ConnectedOperationNode } from "../intelliSenseTree/element/operation/ConnectedOperationNode";
import { OperationNode } from "../intelliSenseTree/element/operation/OperationNode";
import { RuleNode } from "../intelliSenseTree/element/RuleNode";
import { UnkownNode } from "../intelliSenseTree/element/UnkownNode";
import { VariableNode } from "../intelliSenseTree/element/VariableNode";
import { GenericNode } from "../intelliSenseTree/GenericNode";
import { RuleResponseError } from "./error/RuleResponseError";

export class LintingResponse {
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
                { value: ArrayOperandNode, name: "ArrayOperandNode"}
            ]
        }
    })
    private scope: GenericNode | null;

    @Type(() => RuleResponseError)
    private errors: RuleResponseError[];

    constructor() {
        this.scope = null;
        this.errors = [];
    }

    public getScope(): GenericNode | null {
        return this.scope;
    }

    public getErrors(): RuleResponseError[] {
        return this.errors;
    }
}