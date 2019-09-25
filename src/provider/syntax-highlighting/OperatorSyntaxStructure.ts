import { StringHelper } from "../../helper/StringHelper";
import { OperatorNode } from "../../data-model/syntax-tree/element/operation/operand/OperatorNode";
import { OperationNode } from "../../data-model/syntax-tree/element/operation/OperationNode";
import { BaseOperandNode } from "../../data-model/syntax-tree/element/operation/operand/BaseOperandNode";

export class OperationSyntaxStructure {

    constructor(node: OperationNode) {
        this._leftOperand = null;
        this._rightOperand = null;
        this._operator = null;

        if (!node) return;

        var left = node.getLeftOperand()
        if (!!left) {
            this._leftOperand = left;
        }

        var right = node.getRightOperand()
        if (!!right) {
            this._rightOperand = right;
        }

        var op = node.getOperator();
        if (!!op) {
            this._operator = op;
        }
    }

    private _leftOperand: BaseOperandNode | null;
    private _rightOperand: BaseOperandNode | null;
    private _operator: OperatorNode | null;

    public get leftOperand(): string {
        if (!this._leftOperand) return "";
        return this._leftOperand.getLines()[0];
    }
    public get rightOperand(): string {
        if (!this._rightOperand) return "";
        return this._rightOperand.getLines()[0];
    }
    public get operator(): string {
        if (!this._operator) return "";
        return this._operator.getLines()[0];
    }
    public getRegExpAsString(): string | null {
        // Determine, if the right Operand is before the operator
        if (!!this._rightOperand && !!this._rightOperand.getRange() &&
            !!this._leftOperand && !!this._leftOperand.getRange()) {
            if (this._leftOperand.getRange().equals(this._rightOperand.getRange()))
                return StringHelper.getComplexRegExWithLeftBound(this.leftOperand, this.operator);
        }

        return StringHelper.getComplexRegExWithOutherBounds(this.leftOperand, this.operator, this.rightOperand);
    }
}