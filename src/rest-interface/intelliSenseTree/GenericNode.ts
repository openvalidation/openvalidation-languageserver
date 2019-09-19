import { Type } from "class-transformer";
import { TextEdit, Position } from "vscode-languageserver";
import { AliasHelper } from "../../aliases/AliasHelper";
import { HoverContent } from "../../helper/HoverContent";
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

    abstract getChildren(): GenericNode[];
    abstract getHoverContent(): HoverContent | null;
    abstract getCompletionContainer(range: Position): CompletionContainer;
    abstract isComplete(): boolean;

    public updateRangeLines(difference: number): void {
        if (!this.getRange() || !this.getRange().getStart() || !this.getRange().getEnd()) return;

        this.getRange().getStart().setLine(this.getRange().getStart().getLine() + difference);
        this.getRange().getEnd().setLine(this.getRange().getEnd().getLine() + difference);

        this.getChildren().forEach(child => {
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
        return [];
    }
}
