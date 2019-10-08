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

    /**
     * Generates a list of all relevant children for tree-traversal
     *
     * @abstract
     * @returns {GenericNode[]}
     * @memberof GenericNode
     */
    abstract getChildren(): GenericNode[];

    /**
     * Generates the hovering content which should be shown to the user
     *
     * @abstract
     * @returns {(HoverContent | null)}
     * @memberof GenericNode
     */
    abstract getHoverContent(): HoverContent;

    /**
     * Generates the beautified content and returns it as a string
     * This is used for the formatting-function
     *
     * @abstract
     * @param {AliasHelper} aliasesHelper aliashelper if the aliases are required
     * @returns {string} beautified content
     * @memberof GenericNode
     */
    abstract getBeautifiedContent(aliasesHelper: AliasHelper): string;


    /**
     * Calculates the completion-state with the completion-container
     *
     * @abstract
     * @param {Position} position position of the request
     * @returns {CompletionContainer}
     * @memberof GenericNode
     */
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
        return this.$lines.map(line => FormattingHelper.removeDuplicateWhitespacesFromLine(line).trim()).join("\n");
    }
}
