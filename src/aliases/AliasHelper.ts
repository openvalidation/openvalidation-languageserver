import { AliasKey } from "./AliasKey";

/**
 * Maintains the available aliases and defines getter-methods
 *
 * @export
 * @class AliasKeys
 */
export class AliasHelper {
    private aliases: Map<string, string>;
    private operators: Map<string, string>;

    constructor() {
        this.aliases = new Map<string, string>();
        this.operators = new Map<string, string>();
    }

    public updateAliases(aliases: Map<string, string>) {
        this.aliases = aliases;
    }

    public updateOperators(operators: Map<string, string>) {
        this.operators = operators;
    }

    /**
     * Tries to find the natural word for the given parser-key
     *
     * @private
     * @param {string} keywordToFind keyword which should be found
     * @returns {string | null} found natural word or null
     * @memberof TextMateParameter
     */
    public getKeywordByAliasKey(keywordToFind: AliasKey): string | null {
        var foundKeyword = this.getKeys().find(key => this.aliases.get(key) == keywordToFind);
        if (!foundKeyword) return null;

        return foundKeyword;
    }

    /**
     * Returns the first natural-word that fits the keyword
     *
     * @private
     * @param {string} keywordToFind keyword which should be found
     * @returns {string | null} found natural word or null
     * @memberof TextMateParameter
     */
    public getKeywordByString(keywordToFind: string): string | null {
        var foundKeyword = this.getKeys().find(key => {
            var foundValue = this.aliases.get(key);
            return foundValue ? foundValue.toLowerCase().indexOf(keywordToFind.toLowerCase()) !== -1 : false;
        });
        if (!foundKeyword) return null;

        return foundKeyword;
    }

    /**
     * Tries to find the natural words (e.g. 'AS') for the given parser-keys (e.g. 'ʬasʬ')
     *
     * @private
     * @param {AliasKey[]} keywordsToFind keywords which should be found
     * @returns {string[]} found natural words
     * @memberof TextMateParameter
     */
    public getKeywordsByAliasKeys(...keywordsToFind: AliasKey[]): string[] {
        var returnList: string[] = []

        keywordsToFind.forEach(key => {
            var keyword = this.getKeywordByAliasKey(key);
            if (!!keyword)
                returnList.push(keyword);
        });

        return returnList;
    }

    private getKeys(): string[] {
        return Array.from(this.aliases.keys());
    }

    /**
     * Return everything, but no operators and no of-keyword
     *
     * @returns {string[]}
     * @memberof AliasHelper
     */
    public getGenericKeywords(): string[] {
        var nonGenericKeywords: AliasKey[] = [AliasKey.OPERATOR, AliasKey.OF, AliasKey.AS, AliasKey.AND, AliasKey.OR];

        return this.getKeys().filter(key => {
            var aliasKey = this.aliases.get(key)!;
            return nonGenericKeywords.every(keyword => aliasKey.indexOf(keyword) == -1);
        });
    }

    public getOfKeywords(): string[] {
        return this.getKeywordsByAliasKey(AliasKey.OF);
    }

    public getKeywordsByAliasKey(keywordToFind: AliasKey): string[] {
        return this.getKeys().filter(key => this.aliases.get(key)!.indexOf(keywordToFind) != -1);
    }

    public getLogicalOperators(): string[] {
        return this.getKeywordsByAliasKeys(AliasKey.OR, AliasKey.AND);
    }

    public getAsKeyword(): string | null {
        return this.getKeywordByAliasKey(AliasKey.AS);
    }

    public getIfKeyword(): string | null {
        return this.getKeywordByAliasKey(AliasKey.IF);
    }

    public getThenKeyword(): string | null {
        return this.getKeywordByAliasKey(AliasKey.THEN);
    }

    public getConstrainedKeyword(): string[] {
        return this.getKeywordsByAliasKey(AliasKey.CONSTRAINT);
    }

    public getOperators(startingWord?: string): Map<string, string> {
        var keys: [string, string][] = [];

        this.aliases.forEach((value: string, key: string) => {
            var aliasInList = !keys.some(key => key[1] == value);
            if (value.indexOf(AliasKey.OPERATOR) !== -1 && aliasInList &&
                    (!startingWord || value.startsWith(startingWord.toUpperCase())))
                keys.push([key, value]);
        });

        var returnMap: Map<string, string> = new Map<string, string>();
        for (const key of keys) {
            let tmpKey = key[1].replace(AliasKey.OPERATOR, '').replace('ʬ', '');
            let dataType = this.operators.get(tmpKey.toUpperCase());
            
            if (!!dataType && !returnMap.has(key[0]))
                returnMap.set(key[0], dataType);
        }

        return returnMap;
    }

    public getFunctions(): string[] {
        var returnList: string[] = [];

        this.aliases.forEach((value: string, key: string) => {
            var aliasKey = this.aliases.get(key)!;
            if (aliasKey.indexOf(AliasKey.FUNCTION) !== -1)
                returnList.push(key);
        });

        return returnList;
    }

    public getCommentKeyword(): string | null {
        return this.getKeywordByAliasKey(AliasKey.COMMENT);
    }

    public getLengthOfLongestLogicalOperator() {
        return Math.max(...this.getLogicalOperators().map(o => o.length)) + 1;
    }

    /**
     * Validates, if the given word is an boolean operator
     *
     * @param {string} value string to validate
     * @returns {boolean} returns true, if the given word is an operator
     * @memberof AliasHelper
     */
    public isLinkingOperator(value: string): boolean {
        var key = this.aliases.get(value.toUpperCase());
        return key == AliasKey.AND || key == AliasKey.OR;
    }

    /**
     * Validates, if the given word is a keyword for rule-end (e.g. 'THEN')
     *
     * @param {string} value string to validate
     * @returns {boolean} returns true, if the given word is a keyword for rule-end
     * @memberof AliasHelper
     */
    public isThen(value: string): boolean {
        var key = this.aliases.get(value.toUpperCase());
        return key == AliasKey.THEN;
    }

    /**
     * Validates, if the given word is a keyword for rule-start (e.g. 'IF')
     *
     * @param {string} value string to validate
     * @returns {boolean} returns true, if the given word is a keyword for rule-start
     * @memberof AliasHelper
     */
    public isIf(value: string): boolean {
        var key = this.aliases.get(value.toUpperCase());
        return key == AliasKey.IF;
    }

    /**
     * Validates, if the given word is a keyword for variable-naming (e.g. 'AS')
     *
     * @param {string} value string to validate
     * @returns {boolean} returns true, if the given word is a keyword for variable-naming
     * @memberof AliasHelper
     */
    public isAs(value: string): boolean {
        var key = this.aliases.get(value.toUpperCase());
        return key == AliasKey.AS;
    }
}
