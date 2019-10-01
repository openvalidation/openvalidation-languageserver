import { Type } from "class-transformer";
import { Position, Range } from "vscode-languageserver";
import { IndexPosition } from "./IndexPosition";

/**
 * Dataclass that is used for the scopes of the syntax-tree
 *
 * @export
 * @class IndexRange
 */
export class IndexRange {
    @Type(() => IndexPosition)
    private start: IndexPosition;

    @Type(() => IndexPosition)
    private end: IndexPosition;

    /**
     * Creates an instance of IndexRange.
     * @param {IndexPosition} start start position
     * @param {IndexPosition} end end position
     * @memberof IndexRange
     */
    constructor(start: IndexPosition, end: IndexPosition) {
        this.start = start;
        this.end = end;
    }

    /**
     * Creates an IndexRange by the number parameters
     *
     * @static
     * @param {number} startLine start line of the range
     * @param {number} startColumn start column of the range
     * @param {number} endLine end line of the range
     * @param {number} endColumn end column of the range
     * @returns
     * @memberof IndexRange
     */
    public static create(startLine: number, startColumn: number, endLine: number, endColumn: number) {
        return new IndexRange(new IndexPosition(startLine, startColumn), new IndexPosition(endLine, endColumn));
    }

    public get $start(): IndexPosition {
        return this.start;
    }

    public set $start(value: IndexPosition) {
        this.start = value;
    }

    public get $end(): IndexPosition {
        return this.end;
    }

    public set $end(value: IndexPosition) {
        this.end = value;
    }

    /**
     * Returns true, if the position is placed before the range
     *
     * @param {Position} position position that should be checked
     * @returns {boolean} true, if the position is before the range
     * @memberof IndexRange
     */
    public startsAfter(position: Position): boolean {
        if (!this.$start) return false;

        var afterStart = (this.$start.$line == position.line &&
            this.$start.$column <= position.character) ||
            this.$start.$line < position.line;
        return !afterStart;
    }

    /**
     * Returns true, if the position is placed after the range
     *
     * @param {Position} position position that should be checked
     * @returns {boolean} true, if the position is after the range
     * @memberof IndexRange
     */
    public endsBefore(position: Position): boolean {
        if (!this.$end) return true;

        var beforeEnd = (this.$end.$line == position.line &&
            this.$end.$column >= position.character) ||
            this.$end.$line > position.line;
        return !beforeEnd;
    }

    /**
     * Returns true, if the position is contained in this range
     *
     * @param {Position} position position that should be checked
     * @returns {boolean} true, if the position is inside this range
     * @memberof IndexRange
     */
    public includesPosition(position: Position): boolean {
        return !this.startsAfter(position) && !this.endsBefore(position);
    }

    /**
     * Determines if the range is inside this range
     *
     * @param {IndexRange} range range that should be compared
     * @returns {boolean}
     * @memberof IndexRange
     */
    public includesRange(range: IndexRange): boolean {
        if (!range || !range.$start || !range.$end) return false;

        return this.includesPosition(range.$start.asPosition()) || 
                this.includesPosition(range.$end.asPosition());
    }

    /**
     * Transforms this range to the LSP-Range
     *
     * @returns {Range} generated LSP-Range
     * @memberof IndexRange
     */
    public asRange(): Range {
        return Range.create(this.$start.asPosition(), this.$end.asPosition());
    }

    /**
     * Determines weather the range equals this range
     *
     * @param {IndexRange} range range that will be compared
     * @returns {boolean} true, if they are equal
     * @memberof IndexRange
     */
    public equals(range: IndexRange): boolean {
        return !!this.$start && !!range.$start && this.$start.equals(range.$start) &&
            !!this.$end && !!range.$end && this.$end.equals(range.$end);
    }
}