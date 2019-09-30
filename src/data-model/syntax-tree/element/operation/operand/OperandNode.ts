import { Position } from "vscode-languageserver";
import { AliasHelper } from "../../../../../aliases/AliasHelper";
import { HoverContent } from "../../../../../helper/HoverContent";
import { CompletionContainer } from "../../../../../provider/code-completion/CompletionContainer";
import { GenericNode } from "../../../GenericNode";
import { IndexRange } from "../../../IndexRange";
import { BaseOperandNode } from "./BaseOperandNode";
import { SyntaxHighlightingCapture } from "../../../../../provider/syntax-highlighting/SyntaxHighlightingCapture";
import { ScopeEnum } from "../../../../../provider/syntax-highlighting/ScopeEnum";

export class OperandNode extends BaseOperandNode {
    constructor(lines: string[], range: IndexRange, dataType: string, name: string) {
        super(lines, range, dataType, name);
    }

    public getChildren(): GenericNode[] {
        var childList: GenericNode[] = [];
        return childList;
    }

    public getHoverContent(): HoverContent | null {
        var stringContent: string = "Operand " + this.getName() + ": " + this.getDataType();
        var content: HoverContent = new HoverContent(this.getRange(), stringContent);
        return content;
    }

    public getCompletionContainer(position: Position): CompletionContainer {
        return CompletionContainer.init();
    }

    public isComplete(): boolean {
        return false;
    }
    
    public getBeautifiedContent(aliasesHelper: AliasHelper): string {
        return this.defaultFormatting();
    }

    public getPatternInformation(): SyntaxHighlightingCapture | null {
        var returnString: string | null = null;

        var splittedOperand = this.getLines().join("\n").split(new RegExp(`(${this.getName()})`, "g"));

        if (splittedOperand.length >= 2) {
            returnString = `(?:${splittedOperand[0]})\\s*(${splittedOperand[1]})\\s*`;
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
        capture.addRegexToMatch(returnString);
        return capture;
    }
}
