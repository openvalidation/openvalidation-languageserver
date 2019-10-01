import { Position } from "vscode-languageserver";
import { AliasHelper } from "../../../../../aliases/AliasHelper";
import { HoverContent } from "../../../../../helper/HoverContent";
import { CompletionContainer } from "../../../../../provider/code-completion/CompletionContainer";
import { GenericNode } from "../../../GenericNode";
import { IndexRange } from "../../../IndexRange";
import { BaseOperandNode } from "./BaseOperandNode";
import { SyntaxHighlightingCapture } from "../../../../../provider/syntax-highlighting/SyntaxHighlightingCapture";
import { ScopeEnum } from "../../../../../enums/ScopeEnum";
import { StringHelper } from "../../../../../helper/StringHelper";
import { String } from "typescript-string-operations";

export class OperandNode extends BaseOperandNode {

    private isStatic: boolean;

    constructor(lines: string[], range: IndexRange, dataType: string, name: string) {
        super(lines, range, dataType, name);
        this.isStatic = false;
    }

    /**
     * Getter isStatic
     * @return {string}
     */
    public getIsStatic(): boolean {
        return this.isStatic;
    }

    public getChildren(): GenericNode[] {
        var childList: GenericNode[] = [];
        return childList;
    }

    public getHoverContent(): HoverContent | null {
        var stringContent: string = "Operand " + this.getName() + ": " + this.getDataType();
        var content: HoverContent = new HoverContent(this.$range, stringContent);
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

    public getPatternInformation(aliasesHelper: AliasHelper): SyntaxHighlightingCapture | null {
        var joinedLines: string = this.$lines.join("\n");
        if (String.IsNullOrWhiteSpace(joinedLines)) return null;

        if (this.getName().indexOf(".") != -1 && joinedLines.indexOf(".") == -1) 
            return this.getCompletPatternInformation(aliasesHelper);

        var returnString: string = "";
        var splittedOperand = joinedLines.split(new RegExp(`(${StringHelper.makeStringRegExSafe(this.getName())})`, "g"));
        var capture = new SyntaxHighlightingCapture();

        if (splittedOperand.length >= 2) {
            returnString = `(${splittedOperand[0]})\\s*(${StringHelper.makeStringRegExSafe(splittedOperand[1])})\\s*`;

            var scope = this.getIsStatic()
                ? this.getDataType() == "Decimal"
                    ? ScopeEnum.StaticNumber
                    : ScopeEnum.StaticString
                : ScopeEnum.Variable;
            capture.addCapture(ScopeEnum.Empty, scope);
        }

        if (splittedOperand.length >= 3) {
            var duplicateOperands: string = splittedOperand[2];
            for (let index = 3; index < splittedOperand.length; index++) {
                const split = splittedOperand[index];
                duplicateOperands += split;
            }

            returnString += `(${duplicateOperands})`;
            capture.addCapture(ScopeEnum.Empty);
        }

        if (!returnString) return null;

        capture.addRegexToMatch(returnString);
        return capture;
    }


    /**
     * Completion for operands with an `Of`-keyword
     *
     * @param {AliasHelper} aliasesHelper
     * @returns {(SyntaxHighlightingCapture | null)}
     * @memberof OperandNode
     */
    private getCompletPatternInformation(aliasesHelper: AliasHelper): SyntaxHighlightingCapture | null {
        if (String.IsNullOrWhiteSpace(this.$lines.join("\n"))) return null;

        var splittedName = this.getName().split(".").reverse();
        var splittedOperand = this.$lines.join("\n").split(new RegExp(`(${StringHelper.getOredRegEx(splittedName)})`, "g"));
        var ofAliases = aliasesHelper.getOfKeywords();
        var capture: SyntaxHighlightingCapture = new SyntaxHighlightingCapture();

        var returnRegex: string = "";
        var ofFound: boolean = false;;
        for (const text of splittedOperand) {
            returnRegex += `(${text})\\s*`;

            splittedName.includes(text) ? ScopeEnum.Variable : ScopeEnum.Empty
            if (splittedName.includes(text)) {
                capture.addCapture(ScopeEnum.Variable);
            } else if (!ofFound && ofAliases.includes(text.trim().toUpperCase())) {
                capture.addCapture(ScopeEnum.Keyword);
            } else {
                capture.addCapture(ScopeEnum.Empty);
            }
        }

        capture.$match = returnRegex;
        return capture;
    }
}
