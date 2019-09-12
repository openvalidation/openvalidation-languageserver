import { Range } from "vscode-languageserver";

export class MarkDownContentModel {
    constructor() {
        this._content = "";
        this._range = Range.create(0, 0, 0, 0);
    }

    private _content: string;
    private _range: Range;

    public get content(): string {
        return this._content;
    }
    public set content(value: string) {
        this._content = value;
    }
    public get range(): Range {
        return this._range;
    }
    public set range(value: Range) {
        this._range = value;
    }
}