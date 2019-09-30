import { Position } from "vscode-languageserver";
import { AliasHelper } from "../../../../../aliases/AliasHelper";
import { HoverContent } from "../../../../../helper/HoverContent";
import { CompletionContainer } from "../../../../../provider/code-completion/CompletionContainer";
import { GenericNode } from "../../../GenericNode";
import { IndexRange } from "../../../IndexRange";
import { BaseOperandNode } from "./BaseOperandNode";
import { SyntaxHighlightingCapture } from "../../../../../provider/syntax-highlighting/SyntaxHighlightingCapture";
import { ScopeEnum } from "../../../../../provider/syntax-highlighting/ScopeEnum";
import { StringHelper } from "../../../../../helper/StringHelper";

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

        var splittedOperand = this.getLines().join("\n").split(new RegExp(`(${StringHelper.makeStringRegExSafe(this.getName())})`, "g"));

        if (splittedOperand.length >= 2) {
            returnString = `(?:${splittedOperand[0]})\\s*(${StringHelper.makeStringRegExSafe(splittedOperand[1])})\\s*`;
        }

        if (splittedOperand.length >= 3) {
            var duplicateOperands: string = splittedOperand[2];
            for (let index = 3; index < splittedOperand.length; index++) {
                const split = splittedOperand[index];
                duplicateOperands += split;
            } 

            returnString += `(?:${duplicateOperands})`;
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
