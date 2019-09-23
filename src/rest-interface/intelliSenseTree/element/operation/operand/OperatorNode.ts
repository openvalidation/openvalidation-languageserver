import { HoverContent } from "../../../../../helper/HoverContent";
import { CompletionContainer } from "../../../../../provider/code-completion/CompletionContainer";
import { GenericNode } from "../../../GenericNode";
import { IndexRange } from "../../../IndexRange";
import { Position } from "vscode-languageserver";
import { AliasHelper } from "src/aliases/AliasHelper";

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
        var content: HoverContent = new HoverContent(this.getRange());

        content.setContent("Operator " + this.getOperator() + ": " + this.getDataType());

        return content;
    }

    public completionBeforeNode(): CompletionContainer {
        return CompletionContainer.empty();
    }

    public completionAfterNode(): CompletionContainer {
        return CompletionContainer.operand(this.validType);
    }

    public completionInsideNode(range: Position): CompletionContainer {
        return CompletionContainer.empty();
    }

    public isComplete(): boolean {
        return true;
    }

    public getBeautifiedContent(aliasesHelper: AliasHelper): string {
        return this.getLines().join("\n");
    }
}