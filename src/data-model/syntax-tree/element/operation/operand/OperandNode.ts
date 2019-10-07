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

    constructor(lines: string[], range: IndexRange, dataType: string, name: string, isStatic?: boolean) {
        super(lines, range, dataType, name);
        this.isStatic = !isStatic ? false : isStatic;
    }

    public get $isStatic(): boolean {
        return this.isStatic;
    }

    public getChildren(): GenericNode[] {
        var childList: GenericNode[] = [];
        return childList;
    }

    public getHoverContent(): HoverContent {
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
            return this.getPatternInformationForComplexSchema(aliasesHelper);

        var splittedOperand = joinedLines.split(new RegExp(`(${StringHelper.makeStringRegExSafe(this.getName())})`, "gi"));
        var capture = new SyntaxHighlightingCapture();

        var semanticalSugar = splittedOperand[0];
        if (!String.IsNullOrWhiteSpace(semanticalSugar)) {
            capture.addRegexToMatch(`(${splittedOperand[0]})`);
            capture.addCapture(ScopeEnum.Empty);
        }

        var scope: ScopeEnum;
        if (this.$isStatic) {
            if (this.getDataType() == "Decimal") {
                scope = ScopeEnum.StaticNumber;
            } else {
                scope = ScopeEnum.StaticString;
            }
        } else {
            scope = ScopeEnum.Variable;
        }

        capture.addRegexToMatch(`(${StringHelper.makeStringRegExSafe(splittedOperand[1])})`);
        capture.addCapture(scope);

        var duplicateOperands: string = splittedOperand[2];
        for (let index = 3; index < splittedOperand.length; index++) {
            const split = splittedOperand[index];
            duplicateOperands += split;
        }

        if (!String.IsNullOrWhiteSpace(duplicateOperands)) {
            capture.addRegexToMatch(`(${duplicateOperands})`);
            capture.addCapture(ScopeEnum.Empty);
        }

        return capture;
    }


    /**
     * Completion for operands with an `Of`-keyword
     *
     * @param {AliasHelper} aliasesHelper
     * @returns {(SyntaxHighlightingCapture | null)}
     * @memberof OperandNode
     */
    private getPatternInformationForComplexSchema(aliasesHelper: AliasHelper): SyntaxHighlightingCapture | null {
        var splittedName = this.getName().split(".").reverse();
        var splittedOperand = this.$lines.join("\n").split(new RegExp(`(${StringHelper.getOredRegExForWords(...splittedName)})`, "gi"));
        var ofAliases = aliasesHelper.getOfKeywords();
        var capture: SyntaxHighlightingCapture = new SyntaxHighlightingCapture();

        var ofFound: boolean = false;;
        for (const text of splittedOperand) {
            capture.addRegexToMatch(`(${text})`);
            if (splittedName.includes(text)) {
                capture.addCapture(ScopeEnum.Variable);
            } else if (!ofFound && ofAliases.includes(text.trim().toUpperCase())) {
                capture.addCapture(ScopeEnum.Keyword);
            } else {
                capture.addCapture(ScopeEnum.Empty);
            }
        }

        return capture;
    }
}
