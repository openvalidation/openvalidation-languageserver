import { IndexRange } from "../intelliSenseTree/IndexRange";
import { Type } from "class-transformer";

export class LintingError {
    private message: string;

    @Type(() => IndexRange)
    private range: IndexRange;

    constructor(message: string, range: IndexRange) {
        this.message = message;
        this.range = range;
    }

    public getMessage(): string {
        return this.message;
    }

    public getRange(): IndexRange {
        return this.range;
    }
}