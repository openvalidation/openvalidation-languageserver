import { Position } from "vscode-languageserver";
import { AliasHelper } from "../../../../../aliases/AliasHelper";
import { HoverContent } from "../../../../../helper/HoverContent";
import { CompletionContainer } from "../../../../../provider/code-completion/CompletionContainer";
import { GenericNode } from "../../../GenericNode";
import { IndexRange } from "../../../IndexRange";

export abstract class BaseOperandNode extends GenericNode {
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

    abstract getChildren(): GenericNode[];
    abstract getHoverContent(): HoverContent | null;
    abstract getCompletionContainer(range: Position): CompletionContainer;
    abstract isComplete(): boolean;
    abstract getBeautifiedContent(aliasesHelper: AliasHelper): string;
}
