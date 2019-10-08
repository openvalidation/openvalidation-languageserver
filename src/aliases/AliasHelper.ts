import { AliasKey } from './AliasKey';

/**
 * Maintains the available aliases and defines getter-methods
 *
 * @export
 * @class AliasKeys
 */
export class AliasHelper {
    private aliases: Map<string, string>;
    private operators: Map<string, string>;

    /**
     * Creates an instance of AliasHelper.
     * @memberof AliasHelper
     */
    constructor() {
        this.aliases = new Map<string, string>();
        this.operators = new Map<string, string>();
    }

    public get $aliases(): Map<string, string> {
        return this.aliases;
    }

    public set $aliases(aliases: Map<string, string>) {
        this.aliases = aliases;
    }

    public get $operators(): Map<string, string> {
        return this.operators;
    }

    public set $operators(operators: Map<string, string>) {
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

    /**
     * Tries to find aliases for the given key
     *
     * @param {AliasKey} keywordToFind key of the aliases you want to find
     * @returns {string[]} list of the found aliases
     * @memberof AliasHelper
     */
    public getKeywordsByAliasKey(keywordToFind: AliasKey): string[] {
        return this.getKeys().filter(key => this.aliases.get(key)!.indexOf(keywordToFind) != -1);
    }

    /**
     * Return everything, but no operators and no of-keyword
     *
     * @returns {string[]}
     * @memberof AliasHelper
     */
    public getFilteredKeywords(...keywordFilter: AliasKey[]): string[] {
        return this.getKeys().filter(key => {
            var aliasKey = this.aliases.get(key)!;
            return keywordFilter.every(keyword => aliasKey.indexOf(keyword) == -1);
        });
    }


    /**
     * Returns a list of of-keywords (e.g. `must`)
     *
     * @returns {string[]} list of found-keywords
     * @memberof AliasHelper
     */
    public getOfKeywords(): string[] {
        return this.getKeywordsByAliasKey(AliasKey.OF);
    }

    /**
     * Returns the logical-operators, currently only `or` and `and`
     *
     * @returns {string[]} found operators
     * @memberof AliasHelper
     */
    public getLogicalOperators(): string[] {
        return this.getKeywordsByAliasKeys(AliasKey.OR, AliasKey.AND);
    }

    /**
     * Returns the as-keyword
     *
     * @returns {(string | null)} as-keyword, or null if not in the alias list
     * @memberof AliasHelper
     */
    public getAsKeyword(): string | null {
        return this.getKeywordByAliasKey(AliasKey.AS);
    }

    /**
     * Returns the if-keyword
     *
     * @returns {(string | null)} if-keyword, or null if not in the alias list
     * @memberof AliasHelper
     */
    public getIfKeyword(): string | null {
        return this.getKeywordByAliasKey(AliasKey.IF);
    }

    /**
     * Returns the then-keyword
     *
     * @returns {(string | null)} then keyword, or null if not in the alias-list
     * @memberof AliasHelper
     */
    public getThenKeyword(): string | null {
        return this.getKeywordByAliasKey(AliasKey.THEN);
    }


    /**
     * Returns the keywords that indicate a constrained condition
     *
     * @returns {string[]} constrained keywords
     * @memberof AliasHelper
     */
    public getConstrainedKeyword(): string[] {
        return this.getKeywordsByAliasKey(AliasKey.CONSTRAINT);
    }

    /**
     * Returns the comment-keyword
     *
     * @returns {(string | null)} comment keyword, or null if not in the alias-list
     * @memberof AliasHelper
     */
    public getCommentKeyword(): string | null {
        return this.getKeywordByAliasKey(AliasKey.COMMENT);
    }

    /**
     * Returns all operators that are found inside the current alias-list
     *
     * @param {string} [startingWord] optional parameter, that is used for filtering of the operators
     * @returns {Map<string, [string, string]>} Map that consists a map with the name and a tuple of the datatype and the proposed sorting-text
     * @memberof AliasHelper
     */
    public getOperators(startingWord?: string): Map<string, [string, string]> {
        var keys: [string, string][] = [];
        var sortingList: string[] = [];

        this.aliases.forEach((value: string, key: string) => {
            if (value.indexOf(AliasKey.OPERATOR) !== -1 &&
                (!startingWord || key.startsWith(startingWord))) {

                var aliasInList = keys.some(key => key[1] == value);
                sortingList.push(aliasInList ? "z" : "a");
                keys.push([key, value]);
            }
        });

        var returnMap: Map<string, [string, string]> = new Map<string, [string, string]>();
        for (let index = 0; index < keys.length; index++) {
            const key = keys[index];
            const sortingText = sortingList[index];

            let tmpKey = key[1].replace(AliasKey.OPERATOR, '').replace('ʬ', '');
            let dataType = this.operators.get(tmpKey.toUpperCase());

            if (!!dataType && !returnMap.has(key[0]))
                returnMap.set(key[0], [dataType, sortingText]);
        }

        return returnMap;
    }


    /**
     * Returns all functions that are found inside the alias-list
     *
     * @returns {string[]} functions that are found in the allias-list
     * @memberof AliasHelper
     */
    public getFunctions(): string[] {
        var returnList: string[] = [];

        this.aliases.forEach((value: string, key: string) => {
            var aliasKey = this.aliases.get(key)!;
            if (aliasKey.indexOf(AliasKey.FUNCTION) !== -1)
                returnList.push(key);
        });

        return returnList;
    }

    public getLengthOfLongestLogicalOperator() {
        return Math.max(...this.getLogicalOperators().map(o => o.length)) + 1;
    }

    private getKeys(): string[] {
        return Array.from(this.aliases.keys());
    }
}
