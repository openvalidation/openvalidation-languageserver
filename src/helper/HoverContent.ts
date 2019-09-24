import { IndexRange } from "src/rest-interface/intelliSenseTree/IndexRange";

export class HoverContent {
    private content: string;
    private range: IndexRange;

    constructor(range: IndexRange, content: string) { 
        this.content = content;
        this.range = range;
    }

    public getContent(): string {
        return this.content;
    }
    public setContent(value: string) {
        this.content = value;
    }
    public getRange(): IndexRange {
        return this.range;
    }
    public setRange(value: IndexRange) {
        this.range = value;
    }
}