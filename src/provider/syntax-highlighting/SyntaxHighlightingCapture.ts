import { PatternCapture } from './TextMateJson';
import { ScopeEnum } from "../../enums/ScopeEnum";
import { String } from 'typescript-string-operations';

/**
 * Class that is used for semantic parsing.
 * It is used to generate a regex with many different groups.
 * Every group can receive an own capture string for different highlighting
 *
 * @export
 * @class SyntaxHighlightingCapture
 */
export class SyntaxHighlightingCapture {
    private capture: ScopeEnum[];
    private match: string | null;

    constructor() {
        this.capture = [];
        this.match = null;
    }

    /**
     * Getter capture
     * @return {string[]}
     */
    public get $capture(): ScopeEnum[] {
        return this.capture;
    }

    /**
     * Getter match
     * @return {string}
     */
    public get $match(): string | null {
        return this.match;
    }

    /**
     * Setter capture
     * @param {string[]} value
     */
    public set $capture(value: ScopeEnum[]) {
        this.capture = value;
    }

    /**
     * Setter match
     * @param {string} value
     */
    public set $match(value: string | null) {
        this.match = value;
    }

    /**
     * Adds a new capture string to the list.
     * This will be used for highlighting for the `n`-th group in the regex
     *
     * @param {...ScopeEnum[]} scopes
     * @memberof SyntaxHighlightingCapture
     */
    public addCapture(...scopes: ScopeEnum[]): void {
        this.capture.push(...scopes);
    }

    /**
     * Adds the given regex to the string
     *
     * @param {(string | null)} regex string that will be added
     * @returns {void}
     * @memberof SyntaxHighlightingCapture
     */
    public addRegexToMatch(regex: string | null): void {
        if (!regex || String.IsNullOrWhiteSpace(regex)) return;

        if (!this.match)
            this.match = regex;
        else
            this.match += `\\s*${regex}`;
    }

    /**
     * Generates a textmate-pattern for the content of the class
     *
     * @returns {(Pattern | null)} builded pattern or null, in an error-case
     * @memberof SyntaxHighlightingCapture
     */
    public buildPattern(): PatternCapture | null {
        if (!this.$match || this.$capture.length == 0) return null;

        var capture: any = {};
        for (let index = 1; index <= this.capture.length; index++) {
            const scope = this.capture[index - 1];
            if (scope == ScopeEnum.Empty) continue;

            capture[`${index}`] = { name: scope }
        }
        return {
            match: this.$match,
            captures: capture
        }
    }

}