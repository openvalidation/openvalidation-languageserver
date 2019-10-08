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
        var stringContent: string = "Operand " + this.$name + ": " + this.$dataType;
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

        if (this.$name.indexOf(".") != -1 && joinedLines.indexOf(".") == -1)
            return this.getPatternInformationForComplexSchema(aliasesHelper);

        var splittedOperand = joinedLines.split(new RegExp(`(${StringHelper.makeStringRegExSafe(this.$name)})`, "gi"));
        var capture = new SyntaxHighlightingCapture();

        capture.addRegexGroupAndCapture(splittedOperand[0], ScopeEnum.Empty);
        capture.addRegexGroupAndCapture(StringHelper.makeStringRegExSafe(splittedOperand[1]), this.getOperandScope());

        var duplicateOperands: string = splittedOperand[2];
        for (let index = 3; index < splittedOperand.length; index++) {
            const split = splittedOperand[index];
            duplicateOperands += split;
        }

        capture.addRegexGroupAndCapture(duplicateOperands, ScopeEnum.Empty);

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
        var splittedName = this.$name.split(".").reverse();
        var splittedOperand = this.$lines.join("\n").split(new RegExp(`(${StringHelper.getOredRegExForWords(...splittedName)})`, "gi"));
        var ofAliases = aliasesHelper.getOfKeywords();
        var capture: SyntaxHighlightingCapture = new SyntaxHighlightingCapture();

        for (const text of splittedOperand) {
            var scope: ScopeEnum = ScopeEnum.Empty;
            if (splittedName.includes(text)) {
                scope = ScopeEnum.Variable;
            } else if (ofAliases.includes(text.trim().toUpperCase())) {
                scope = ScopeEnum.Keyword;
            }
            capture.addRegexGroupAndCapture(text, scope);
        }

        return capture;
    }

    private getOperandScope(): ScopeEnum {
        if (this.$isStatic) {
            if (this.$dataType == "Decimal") {
                return ScopeEnum.StaticNumber;
            } else {
                return ScopeEnum.StaticString;
            }
        } else {
            return ScopeEnum.Variable;
        }
    }
}
