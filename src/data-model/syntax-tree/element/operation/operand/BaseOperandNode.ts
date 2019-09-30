import { Position } from "vscode-languageserver";
import { AliasHelper } from "../../../../../aliases/AliasHelper";
import { HoverContent } from "../../../../../helper/HoverContent";
import { CompletionContainer } from "../../../../../provider/code-completion/CompletionContainer";
import { GenericNode } from "../../../GenericNode";
import { IndexRange } from "../../../IndexRange";
import { SyntaxHighlightingCapture } from "../../../../../provider/syntax-highlighting/SyntaxHighlightingCapture";

export abstract class BaseOperandNode extends GenericNode {
    private dataType: string;
    private name: string;
    private isStatic: boolean;

    constructor(lines: string[], range: IndexRange, dataType: string, name: string) {
        super(lines, range);
        this.dataType = dataType;
        this.name = name;
        this.isStatic = false;
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
     * @return {string}
     */
    public getName(): string {
        return this.name;
    }

    /**
     * Getter isStatic
     * @return {string}
     */
    public getIsStatic(): boolean {
        return this.isStatic;
    }
    
    abstract getChildren(): GenericNode[];
    abstract getHoverContent(): HoverContent | null;
    abstract getCompletionContainer(range: Position): CompletionContainer;
    abstract isComplete(): boolean;
    abstract getBeautifiedContent(aliasesHelper: AliasHelper): string;
    abstract getPatternInformation(): SyntaxHighlightingCapture | null;
}
