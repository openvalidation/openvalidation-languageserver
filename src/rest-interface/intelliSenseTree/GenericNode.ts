import { Type } from "class-transformer";
import { Range, TextEdit } from "vscode-languageserver";
import { AliasHelper } from "../../aliases/AliasHelper";
import { FormattingHelper } from "../../helper/FormattingHelper";
import { HoverContent } from "../../helper/HoverContent";
import { StringHelper } from "../../helper/StringHelper";
import { CompletionContainer } from "../../provider/code-completion/CompletionContainer";
import { IndexRange } from "./IndexRange";

export abstract class GenericNode {
    private lines: string[];

    @Type(() => IndexRange)
    private range: IndexRange;

    constructor(lines: string[], range: IndexRange) {
        this.lines = lines;
        this.range = range;
    }

    public getLines() {
        return this.lines;
    }

    public setLines(value: string[]): void {
        this.lines = value;
    }

    public getRange(): IndexRange {
        return this.range;
    }

    public setRange(value: IndexRange): void {
        this.range = value;
    }

    public getStartLineNumber(): number {
        return this.getRange().getStart().getLine();
    }

    abstract getChilds(): GenericNode[];
    abstract getHoverContent(): HoverContent | null;
    abstract getCompletionContainer(): CompletionContainer;

    public updateRangeLines(difference: number): void {
        if (!this.getRange() || !this.getRange().getStart() || !this.getRange().getEnd()) return;

        this.getRange().getStart().setLine(this.getRange().getStart().getLine() + difference);
        this.getRange().getEnd().setLine(this.getRange().getEnd().getLine() + difference);

        this.getChilds().forEach(child => {
            child.updateRangeLines(difference);
        });
    }

    /**
     * Generates a list of edits for formatting this element
     *
     * @returns {TextEdit[]} text-edits that need to be done for the formatting of this element
     * @memberof OvRule
     */
    public formatCode(aliasesHelper: AliasHelper): TextEdit[] {
        var textEdits: TextEdit[] = [];

        //Needed Keyword is in the last line
        // var asKeyword: string | null = aliasesHelper.getKeywordByAliasKey(AliasKey.AS);
        // var spaces: string = !asKeyword ? "" : FormattingHelper.generateSpaces(asKeyword.length + 1);

        for (let index = 0; index < this.getLines().length; index++) {
            const lineToCheck = this.getLines()[index];
            var currentLineNumber = this.getStartLineNumber() + index;
            var replacedLine = FormattingHelper.removeDuplicateWhitespacesFromLine(lineToCheck);
            var formattedLine = this.formatLine(replacedLine, aliasesHelper);

            var textEdit: TextEdit = {
                newText: formattedLine,
                range: Range.create(currentLineNumber, 0, currentLineNumber, lineToCheck.length)
            }
            textEdits.push(textEdit);
        }

        return textEdits;
    }

    protected formatLine(line: string, aliasesHelper: AliasHelper): string {
        return line;
    }

    /**
     * Splits the given line by known keywords which should appear in another line.
     * Every splitted line gets formatted recursively
     *
     * @private
     * @param {string} line line to split and format
     * @param {string} [additionalSpaces=""] optional spaces for the first-line (e.g. one space for the operators)
     * @returns {string}
     * @memberof OvRule
     */
    protected splitLineByKeywordsAndFormatCode(line: string, aliasesHelper: AliasHelper, keywords: string[], additionalSpaces: string = ""): string {
        var regexp: string = StringHelper.getOredRegEx(keywords);
        var splittedLine: string[] = line.split(FormattingHelper.getKeywordRegEx(regexp));
        line = additionalSpaces + splittedLine[0];

        for (let index = 1; index < splittedLine.length; index++) {
            var split = splittedLine[index].trim();
            line += "\n";

            split = this.formatLine(split, aliasesHelper);
            line += split;
        }

        return line;
    }
}
