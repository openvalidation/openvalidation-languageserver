import { Pattern } from './TextMateJson';
import { ScopeEnum } from "./ScopeEnum";

export class SyntaxHighlightingCapture {
    private _capture: ScopeEnum[];
    private _match: string | null;

    constructor() {
        this._capture = [];
        this._match = null;
    }

    /**
     * Getter capture
     * @return {string[]}
     */
    public get capture(): ScopeEnum[] {
        return this._capture;
    }

    /**
     * Getter match
     * @return {string}
     */
    public get match(): string | null {
        return this._match;
    }

    /**
     * Setter capture
     * @param {string[]} value
     */
    public set capture(value: ScopeEnum[]) {
        this._capture = value;
    }

    /**
     * Setter match
     * @param {string} value
     */
    public set match(value: string | null) {
        this._match = value;
    }

    public addCapture(...scopes: ScopeEnum[]): void {
        this._capture.push(...scopes);
    }

    public addRegexToMatch(regex: string | null): void {
        if (!regex) return;

        if (!this._match)
            this._match = regex;
        else
            this._match += `\\s*${regex}`;
    }

    /**
     * buildPattern
     */
    public buildPattern(): Pattern | null {
        if (!this.match) return null;

        var capture: any = { };
        for (let index = 1; index <= this._capture.length; index++) {
            const scope = this._capture[index - 1];
            capture[`${index}`] = {
                name: scope
            }
        }

        return {
            match: this.match!,
            captures: capture
        }
    }

}