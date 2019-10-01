import { Type } from "class-transformer";
import { String } from "typescript-string-operations";
import { Position, TextEdit } from "vscode-languageserver";
import { AliasHelper } from "../../aliases/AliasHelper";
import { FormattingHelper } from "../../helper/FormattingHelper";
import { HoverContent } from "../../helper/HoverContent";
import { CompletionContainer } from "../../provider/code-completion/CompletionContainer";
import { IndexRange } from "./IndexRange";

/**
 * GenericNode for all elements of the syntax-tree
 *
 * @export
 * @abstract
 * @class GenericNode
 */
export abstract class GenericNode {
    private lines: string[];

    @Type(() => IndexRange)
    private range: IndexRange;

    /**
     * Creates an instance of GenericNode.
     * @param {string[]} lines lines of the node
     * @param {IndexRange} range scope of the node
     * @memberof GenericNode
     */
    constructor(lines: string[], range: IndexRange) {
        this.lines = lines;
        this.range = range;
    }

    public get $lines(): string[] {
        return this.lines;
    }

    public set $lines(value: string[]) {
        this.lines = value;
    }

    public get $range(): IndexRange {
        return this.range;
    }

    public set $range(value: IndexRange) {
        this.range = value;
    }

    public get $startLineNumber(): number {
        return this.$range.$start.$line;
    }

    abstract getChildren(): GenericNode[];
    abstract getHoverContent(): HoverContent | null;
    abstract getBeautifiedContent(aliasesHelper: AliasHelper): string;
    abstract getCompletionContainer(position: Position): CompletionContainer;

    /**
     * Generates a list of edits for formatting this element
     *
     * @returns {TextEdit[]} text-edits that need to be done for the formatting of this element
     * @memberof OvRule
     */
    public formatCode(aliasHelper: AliasHelper): TextEdit[] {
        var textEdits: TextEdit[] = [];
        var formattedString: string = this.getBeautifiedContent(aliasHelper);
        var formattedLines: string[] = formattedString.split("\n").filter(line => !String.IsNullOrWhiteSpace(line));

        var textEdit: TextEdit = {
            newText: formattedLines.join("\n"),
            range: this.$range.asRange()
        }
        textEdits.push(textEdit);

        return textEdits;
    }

    /**
     * Default formatting for all nodes which is the removing of all duplcare whitespaces
     *
     * @returns {string} formatted lines in one string, joined by `\n`
     * @memberof GenericNode
     */
    public defaultFormatting(): string {
        return this.$lines.map(line => FormattingHelper.removeDuplicateWhitespacesFromLine(line)).join("\n");
    }
}
