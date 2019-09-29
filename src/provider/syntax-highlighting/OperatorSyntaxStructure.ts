import { StringHelper } from "../../helper/StringHelper";
import { OperationNode } from "../../data-model/syntax-tree/element/operation/OperationNode";
import { String } from "typescript-string-operations";

export class OperationSyntaxStructure {

    constructor(node: OperationNode) {
        this._leftOperand = null;
        this._rightOperand = null;
        this._operator = null;

        if (!node || 
            !node.getOperator() ||
            String.IsNullOrWhiteSpace(node.getOperator()!.getLines().join("\n"))) return;

        var splittedLines: string[] = node.getLines().join("\n").split(node.getOperator()!.getLines().join("\n"));
        if (splittedLines.length >= 1) {
            this._leftOperand = splittedLines[0];
        }

        if (splittedLines.length == 2 &&
            !String.IsNullOrWhiteSpace(splittedLines[1]) &&
            !!node.getLeftOperand() && 
            !!node.getRightOperand() &&
            !node.getLeftOperand()!.getRange().equals(node.getRightOperand()!.getRange())) {
            this._rightOperand = splittedLines[1];
        } else {
            this._rightOperand = null;
        }

        this._operator = node.getOperator()!.getLines().join("\n");
    }

    private _leftOperand: string | null;
    private _rightOperand: string | null;
    private _operator: string | null;

    public get leftOperand(): string | null {
        return this._leftOperand;
    }
    public get rightOperand(): string | null {
        return this._rightOperand;
    }
    public get operator(): string | null {
        return this._operator;
    }
    public getRegExpAsString(): string | null {
        // Determine, if the right Operand is before the operator
        if (!!this.leftOperand && !this.rightOperand && !!this.operator) {
            return StringHelper.getComplexRegExWithLeftBound(this.leftOperand, this.operator);
        }

        if (!!this.leftOperand && !!this.rightOperand && !!this.operator) {
            return StringHelper.getComplexRegExWithOutherBounds(this.leftOperand, this.operator, this.rightOperand);
        }

        return null;
    }
}