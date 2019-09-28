import { Position } from "vscode-languageserver";
import { AliasHelper } from "../../../../../aliases/AliasHelper";
import { HoverContent } from "../../../../../helper/HoverContent";
import { CompletionContainer } from "../../../../../provider/code-completion/CompletionContainer";
import { GenericNode } from "../../../GenericNode";
import { IndexRange } from "../../../IndexRange";

export class OperatorNode extends GenericNode {
    private dataType: string;
    private operator: string;
    private validType: string;

    constructor(lines: string[], range: IndexRange, dataType: string, operator: string, validType: string) {
        super(lines, range);
        this.dataType = dataType;
        this.operator = operator;
        this.validType = validType;
    }

    /**
     * Getter dataType
     * @return {string}
     */
    public getDataType(): string {
        return this.dataType;
    }

    /**
     * Getter validType
     * @return {string}
     */
    public getValidType(): string {
        return this.validType;
    }

    /**
     * Getter operator
     * @return {string}
     */
    public getOperator(): string {
        return this.operator;
    }

    public getChildren(): GenericNode[] {
        var childList: GenericNode[] = [];
        return childList;
    }

    public getHoverContent(): HoverContent | null {
        var content: string = "Operator " + this.getOperator() + ": " + this.getDataType();
        var hoverContent: HoverContent = new HoverContent(this.getRange(), content);
        return hoverContent;
    }

    public getCompletionContainer(range: Position): CompletionContainer {
        return CompletionContainer.init();
    }

    public isComplete(): boolean {
        return true;
    }

    public getBeautifiedContent(aliasesHelper: AliasHelper): string {
        return this.defaultFormatting();
    }
}