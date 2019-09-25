import { Position } from "vscode-languageserver";

export class IndexPosition {
    private line: number;
    private column: number;

    constructor(line: number, column: number) {
        this.line = line;
        this.column = column;
    }

    public getLine(): number {
        return this.line;
    }
    public setLine(value: number) {
        this.line = value;
    }
    public getColumn(): number {
        return this.column;
    }
    public setColumn(value: number) {
        this.column = value;
    }

    public asPosition(): Position {
        return Position.create(this.getLine(), this.getColumn());
    }

    public equals(position: IndexPosition): boolean {
        return this.getLine() == position.getLine() &&
            this.getColumn() == position.getColumn();
    }
}