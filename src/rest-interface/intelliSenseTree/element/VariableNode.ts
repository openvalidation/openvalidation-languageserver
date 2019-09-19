import { Type } from "class-transformer";
import { Position, Range } from "vscode-languageserver";
import { CompletionType } from "../../../enums/CompletionType";
import { HoverContent } from "../../../helper/HoverContent";
import { CompletionContainer } from "../../../provider/code-completion/CompletionContainer";
import { GenericNode } from "../GenericNode";
import { IndexRange } from "../IndexRange";
import { ArrayOperandNode } from "./operation/operand/ArrayOperandNode";
import { FunctionOperandNode } from "./operation/operand/FunctionOperandNode";
import { OperandNode } from "./operation/operand/OperandNode";
import { ConnectedOperationNode } from "./operation/ConnectedOperationNode";
import { OperationNode } from "./operation/OperationNode";

export class VariableNode extends GenericNode {
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
    private value: OperandNode;

    private name: string;

    constructor(name: string, value: OperandNode, lines: string[], range: IndexRange) {
        super(lines, range);
        this.name = name;
        this.value = value;
    }

    public getChildren(): GenericNode[] {
        var childList: GenericNode[] = [];

        if (!!this.value)
            childList.push(this.value);

        return childList;
    }

    /**
     * Getter value
     * @return {ValueNode}
     */
    public getValue(): OperandNode {
        return this.value;
    }

    /**
     * Getter name
     * @return {string}
     */
    public getName(): string {
        return this.name;
    }

    /**
     * Setter value
     * @param {ValueNode} value
     */
    public setValue(value: OperandNode) {
        this.value = value;
    }

    /**
     * Setter name
     * @param {string} value
     */
    public setName(value: string) {
        this.name = value;
    }

    /**
     * Returns the Range of the name of this variable
     *
     * @returns {(IndexRange | null)}
     * @memberof OvVariable
     */
    public getRangeOfVariableName(): Range {
        for (let index = 0; index < this.getLines().length; index++) {
            const line = this.getLines()[index];
            var foundIndex = line.indexOf(this.name);
            if (foundIndex === -1) continue;

            var lineNumber: number = this.getStartLineNumber() + index;
            var startIndex = foundIndex;
            var endIndex = foundIndex + this.name.length;

            var startPosition: Position = Position.create(lineNumber, startIndex);
            var endPosition: Position = Position.create(lineNumber, endIndex);
            return Range.create(startPosition, endPosition);
        }

        throw Error("Variable " + this.name + " is not included in the Variable-Lines");
    }


    public getHoverContent(): HoverContent | null {
        var content: HoverContent = new HoverContent(this.getRange());

        var contentText = "Variable " + this.getName();
        if (!!this.getValue())
            contentText += ": " + this.getValue().getDataType();

        content.setContent(contentText);

        return content;
    }

    public getCompletionContainer(range: Position): CompletionContainer {
        if (!this.value)
            return new CompletionContainer(CompletionType.Operand);

        return this.value.getCompletionContainer(range);
    }

    public isComplete(): boolean {
        return !!this.value && this.value.isComplete();
    }
}
