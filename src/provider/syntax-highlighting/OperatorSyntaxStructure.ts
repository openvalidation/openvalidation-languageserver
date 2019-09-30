import { OperationNode } from "../../data-model/syntax-tree/element/operation/OperationNode";
import { String } from "typescript-string-operations";
import { SyntaxHighlightingCapture } from "./SyntaxHighlightingCapture";

export class OperationSyntaxStructure {

    private _leftOperand: SyntaxHighlightingCapture | null;
    private _rightOperand: SyntaxHighlightingCapture | null;
    private _operator: SyntaxHighlightingCapture | null;
    private _node: OperationNode;

    constructor(node: OperationNode) {
        this._rightOperand = null;
        this._leftOperand = null;
        this._operator = null;
        this._node = node;

        if (!node || !node.getLeftOperand()) return;
        this._leftOperand = node.getLeftOperand()!.getPatternInformation();

        if (!node.getRightOperand()) return;
        this._rightOperand = node.getRightOperand()!.getPatternInformation();

        if (!node.getOperator() && String.IsNullOrWhiteSpace(node.getOperator()!.getLines().join("\n"))) return;
        this._operator = node.getOperator()!.getPatternInformation();
    }

    public get leftOperand(): SyntaxHighlightingCapture | null {
        return this._leftOperand;
    }

    public get rightOperand(): SyntaxHighlightingCapture | null {
        return this._rightOperand;
    }

    public get operator(): SyntaxHighlightingCapture | null {
        return this._operator;
    }

    public getRegExpAsString(): SyntaxHighlightingCapture | null {
        return this._node.getPatternInformation();
    }
}