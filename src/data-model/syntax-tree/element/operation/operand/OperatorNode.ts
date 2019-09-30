import { String } from "typescript-string-operations";
import { Position } from "vscode-languageserver";
import { AliasHelper } from "../../../../../aliases/AliasHelper";
import { HoverContent } from "../../../../../helper/HoverContent";
import { CompletionContainer } from "../../../../../provider/code-completion/CompletionContainer";
import { SyntaxHighlightingCapture } from "../../../../../provider/syntax-highlighting/SyntaxHighlightingCapture";
import { GenericNode } from "../../../GenericNode";
import { IndexRange } from "../../../IndexRange";
import { ScopeEnum } from "../../../../../provider/syntax-highlighting/ScopeEnum";

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

    public getPatternInformation(): SyntaxHighlightingCapture | null {
        var returnString = this.getLines().join("\n");
        if (String.IsNullOrWhiteSpace(returnString)) {
            return null;
        } else {
            var capture = new SyntaxHighlightingCapture()
            capture.addCapture(ScopeEnum.Keyword)
            capture.addRegexToMatch(`(${returnString})`);
            return capture;
        }
    }
}