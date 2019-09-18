import { CompletionType } from "../../../../../enums/CompletionType";
import { HoverContent } from "../../../../../helper/HoverContent";
import { CompletionContainer } from "../../../../../provider/code-completion/CompletionContainer";
import { GenericNode } from "../../../GenericNode";
import { IndexRange } from "../../../IndexRange";

export class OperandNode extends GenericNode {
    private dataType: string;
    private name: string | null; // Null, if Operand is not set

    constructor(lines: string[], range: IndexRange, dataType: string, name: string | null) {
        super(lines, range);
        this.dataType = dataType;
        this.name = name;
    }

    /**
     * Getter dataType
     * @return {string}
     */
    public getDataType(): string {
        return this.dataType;
    }

    /**
     * Getter name
     * @return {string | null}, null if the name isn't set
     */
    public getName(): string | null {
        return this.name;
    }

    public getChildren(): GenericNode[] {
        var childList: GenericNode[] = [];
        return childList;
    }

    public getHoverContent(): HoverContent | null {
        var content: HoverContent = new HoverContent(this.getRange());

        content.setContent("Operand " + this.getName() + ": " + this.getDataType());

        return content;
    }

    public getCompletionContainer(): CompletionContainer {
        var container = new CompletionContainer(CompletionType.Operator);
        container.specificDataType(this.getDataType());
        return container;
    }

    public isComplete(): boolean {
        return true;
    }
}
