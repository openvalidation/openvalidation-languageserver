import { Position } from "vscode-languageserver";

/**
 * Dataclass for the positions of the range of syntax-tree nodes
 *
 * @export
 * @class IndexPosition
 */
export class IndexPosition {
    private line: number;
    private column: number;


    /**
     * Creates an instance of IndexPosition.
     * @param {number} line line of the position
     * @param {number} column column of the position
     * @memberof IndexPosition
     */
    constructor(line: number, column: number) {
        this.line = line;
        this.column = column;
    }

    public get $line(): number {
        return this.line;
    }
    public set $line(value: number) {
        this.line = value;
    }
    public get $column(): number {
        return this.column;
    }
    public set $column(value: number) {
        this.column = value;
    }

    /**
     * Transforms this position to the LSP-Position
     *
     * @returns {Position} generated LSP-Position
     * @memberof IndexPosition
     */
    public asPosition(): Position {
        return Position.create(this.$line, this.$column);
    }

    /**
     * Determines weather the position equals this position
     *
     * @param {IndexPosition} position range that will be compared
     * @returns {boolean} true, if they are equal
     * @memberof IndexPosition
     */
    public equals(position: IndexPosition): boolean {
        return this.$line == position.$line &&
            this.$column == position.$column;
    }
}