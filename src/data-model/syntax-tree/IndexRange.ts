import { Type } from "class-transformer";
import { Position, Range } from "vscode-languageserver";
import { IndexPosition } from "./IndexPosition";

export class IndexRange {
    @Type(() => IndexPosition)
    private start: IndexPosition;

    @Type(() => IndexPosition)
    private end: IndexPosition;

    constructor(start: IndexPosition, end: IndexPosition) {
        this.start = start;
        this.end = end;
    }

    public static create(startLine: number, startColumn: number, endLine: number, endColumn: number) {
        return new IndexRange(new IndexPosition(startLine, startColumn), new IndexPosition(endLine, endColumn));
    }

    public getStart(): IndexPosition {
        return this.start;
    }
    public setStart(value: IndexPosition): void {
        this.start = value;
    }
    public getEnd(): IndexPosition {
        return this.end;
    }
    public setEnd(value: IndexPosition): void {
        this.end = value;
    }

    public startsAfter(position: Position): boolean {
        if (!this.getStart()) return false;

        var afterStart = (this.getStart().getLine() == position.line &&
            this.getStart().getColumn() <= position.character) ||
            this.getStart().getLine() < position.line;
        return !afterStart;
    }

    public endsBefore(position: Position): boolean {
        if (!this.getEnd()) return true;

        var beforeEnd = (this.getEnd().getLine() == position.line &&
            this.getEnd().getColumn() >= position.character) ||
            this.getEnd().getLine() > position.line;
        return !beforeEnd;
    }

    public includesPosition(position: Position): boolean {
        return !this.startsAfter(position) && !this.endsBefore(position);
    }

    public includesRange(range: IndexRange): boolean {
        if (!range || !range.getStart() || !range.getEnd()) return false;

        return this.includesPosition(range.getStart().asPosition()) || 
                this.includesPosition(range.getEnd().asPosition());
    }

    public asRange(): Range {
        return Range.create(this.getStart().asPosition(), this.getEnd().asPosition());
    }

    public equals(range: IndexRange): boolean {
        return !!this.getStart() && !!range.getStart() && this.getStart().equals(range.getStart()) &&
            !!this.getEnd() && !!range.getEnd() && this.getEnd().equals(range.getEnd());
    }
}