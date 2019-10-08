import { String } from 'typescript-string-operations';

/**
 * Defines some useful methods for strings
 *
 * @export
 * @class StringHelper
 */
export class StringHelper {

    /**
     * Creates a RegExp, where all parameters are ored
     *
     * @private
     * @param {...string[]} params parameters that should be ored
     * @returns {string} ored RegExp
     * @memberof StringHelper
     */
    public static getCaseUnsensitiveOredRegExForWords(...params: string[]): string {
        let returnString: string = '';

        params = Array.from(new Set(params).keys());

        for (let index = 0; index < params.length; index++) {
            const element = params[index];
            returnString += '\\b' + element + '\\b'; // To Make sure we only match whole words

            // Don't at an "|" at the last word
            if (index < params.length - 1) {
                returnString += '|';
            }
        }
        return '(?i)(' + returnString + ')';
    }

    /**
     * Creates a RegExp, where all parameters are ored
     *
     * @private
     * @param {...string[]} params parameters that should be ored
     * @returns {string} ored RegExp
     * @memberof StringHelper
     */
    public static getOredRegExForWords(...params: string[]): string {
        let returnString: string = '';

        params = Array.from(new Set(params).keys());

        for (let index = 0; index < params.length; index++) {
            const element = params[index];
            returnString += '\\b' + element + '\\b';

            // Don't at an "|" at the last word
            if (index < params.length - 1) {
                returnString += '|';
            }
        }

        return returnString;
    }

    /**
     * Replaces all regex-critical symbols with the symbol with a backspace-symbol
     *
     * @static
     * @param {string} text text that needs to made regex-safe
     * @returns {string} manipulated text
     * @memberof StringHelper
     */
    public static makeStringRegExSafe(text: string): string {
        const criticalSymbols: string[] = ['(', ')', '*'];
        if (String.IsNullOrWhiteSpace(text)) { return text; }

        criticalSymbols.forEach(symbol => {
            text = text.replace(symbol, '\\' + symbol);
        });
        return text;
    }

    /**
     * Searches the word at a specfic index and returns it
     *
     * @static
     * @param {string} searchString string were we try to search a word
     * @param {number} index index in the string where the word should be found
     * @returns {string} found word
     * @memberof StringHelper
     */
    public static getWordAt(searchString: string, index: number): string {
        // Search for the word's beginning and end.
        const left = searchString.slice(0, index + 1).search(/\S+$/);
        const right = searchString.slice(index).search(/\s/);

        // The last word in the string is a special case.
        if (right < 0) {
            return searchString.slice(left);
        }

        // Return the word, using the located bounds to extract it from the string.
        return searchString.slice(left, right + index);
    }
}
