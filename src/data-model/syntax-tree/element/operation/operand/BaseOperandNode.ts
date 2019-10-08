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

    constructor(lines: string[], range: IndexRange, dataType: string, name: string) {
        super(lines, range);
        this.dataType = dataType;
        this.name = name;
    }

    /**
     * Getter dataType
     * @return {string}
     */
    public get $dataType(): string {
        return this.dataType;
    }

    /**
     * Getter name
     * @return {string}
     */
    public get $name(): string {
        return this.name;
    }
   
    abstract getChildren(): GenericNode[];
    abstract getHoverContent(): HoverContent;
    abstract getCompletionContainer(range: Position): CompletionContainer;
    abstract isComplete(): boolean;
    abstract getBeautifiedContent(aliasesHelper: AliasHelper): string;
    abstract getPatternInformation(aliasesHelper: AliasHelper): SyntaxHighlightingCapture | null;
}
