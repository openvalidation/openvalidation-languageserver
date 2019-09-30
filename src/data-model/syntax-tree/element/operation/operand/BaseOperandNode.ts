import { Position } from "vscode-languageserver";
import { AliasHelper } from "../../../../../aliases/AliasHelper";
import { HoverContent } from "../../../../../helper/HoverContent";
import { CompletionContainer } from "../../../../../provider/code-completion/CompletionContainer";
import { GenericNode } from "../../../GenericNode";
import { IndexRange } from "../../../IndexRange";
import { SyntaxHighlightingCapture } from "../../../../../provider/syntax-highlighting/SyntaxHighlightingCapture";
import { ScopeEnum } from "../../../../../provider/syntax-highlighting/ScopeEnum";

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

    // TODO: Move to OperandNode
    public getPatternInformation(): SyntaxHighlightingCapture | null {
        var returnString: string | null = null;

        var splittedOperand = this.getLines().join("\n").split(new RegExp(`(${this.getName()})`, "g"));

        if (splittedOperand.length >= 2) {
            returnString = `(?:${splittedOperand[0]}).*(${splittedOperand[1]}).*`;
        }

        if (splittedOperand.length >= 3) {
            returnString += `(?:${splittedOperand[2]})`;
        }

        if (!returnString) return null;            
        var scope = this.getIsStatic()
            ? this.getDataType() == "Decimal"
                ? ScopeEnum.StaticNumber
                : ScopeEnum.StaticString
            : ScopeEnum.Variable;

        var capture = new SyntaxHighlightingCapture();
        capture.addCapture(scope);
        capture.addRegex(returnString);
        return capture;
    }
}
