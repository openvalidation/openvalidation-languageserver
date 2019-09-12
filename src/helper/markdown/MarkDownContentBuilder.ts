/**
 * Builder to create a mark-down content for hovering
 *
 * @export
 * @class MarkDownContentBuilder
 */
export class MarkDownContentBuilder {
    private _lines: string[];

    constructor(headerContent: string) {
        var contentLine = "**" + headerContent + "**\ ";
        this._lines = [contentLine];
    }

    public addSimpleLineContent(line: string): MarkDownContentBuilder {
        this._lines.push(line);
        return this;
    }

    public addMultiLineContent(lines: string[]): MarkDownContentBuilder {
        this._lines = this._lines.concat(lines);
        return this;
    }

    public build(): string {
        return this._lines.join('\n');
    }
}