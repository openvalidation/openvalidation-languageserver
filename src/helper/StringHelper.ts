import { String } from "typescript-string-operations";

/**
 * Defines some useful methods for strings
 *
 * @export
 * @class OvDocumentHelper
 */
export class StringHelper {
    /**
     * Creates a RegExp, where all parameters are ored
     *
     * @private
     * @param {string[]} params parameters that should be ored
     * @returns {string} ored RegExp
     * @memberof OvSyntaxNotifier
     */
    public static getCaseUnsensitiveOredRegExForWords(params: string[]): string {
        var returnString: string = "";

        params = Array.from(new Set(params).keys());

        for (let index = 0; index < params.length; index++) {
            const element = params[index];
            returnString += "\\b" + element + "\\b"; //To Make sure we only match whole words

            // Don't at an "|" at the last word
            if (index < params.length - 1) {
                returnString += "|";
            }
        }
        return "(?i)(" + returnString + ")";
    }


    /**
     * Creates a RegExp, where all parameters are ored
     *
     * @private
     * @param {string[]} params parameters that should be ored
     * @returns {string} ored RegExp
     * @memberof OvSyntaxNotifier
     */
    public static getOredRegExForWords(params: string[]): string {
        var returnString: string = "";

        params = Array.from(new Set(params).keys());

        for (let index = 0; index < params.length; index++) {
            const element = params[index];
            returnString += "\\b" + element + "\\b";

            // Don't at an "|" at the last word
            if (index < params.length - 1) {
                returnString += "|";
            }
        }

        return returnString;
    }

    /**
     * Creates a RegExp, where all parameters are ored
     *
     * @private
     * @param {string[]} params parameters that should be ored
     * @returns {string} ored RegExp
     * @memberof OvSyntaxNotifier
     */
    public static getOredRegEx(params: string[]): string {
        var returnString: string = "";

        params = Array.from(new Set(params).keys());

        for (let index = 0; index < params.length; index++) {
            const element = params[index];
            returnString += element;

            // Don't at an "|" at the last word
            if (index < params.length - 1) {
                returnString += "|";
            }
        }

        return returnString;
    }

    public static makeStringRegExSafe(text: string): string {
        var criticalSymbols: string[] = ['(', ')', '*'];
        if (!text) return text;

        criticalSymbols.forEach(symbol => {
            text = text.replace(symbol, '\\' + symbol);
        });
        return text;
    }

    public static getComplexRegExWithLeftBound(leftBound: string, middle: string): string | null {
        leftBound = this.makeStringRegExSafe(leftBound);
        middle = this.makeStringRegExSafe(middle);

        var leftString = String.IsNullOrWhiteSpace(leftBound) ? "" : String.Format("(?<=({0}))", leftBound);
        if (String.IsNullOrWhiteSpace(leftString)) return null;

        var operatorString = String.IsNullOrWhiteSpace(middle) ? "" : String.Format("({0})", middle);
        if (String.IsNullOrWhiteSpace(operatorString)) return null;

        var regex = leftString.concat(operatorString);
        if (String.IsNullOrWhiteSpace(regex)) return null;
        return regex;
    }

    public static getComplexRegExWithOutherBounds(leftBound: string, middle: string, rightBound: string): string | null {
        leftBound = this.makeStringRegExSafe(leftBound);
        middle = this.makeStringRegExSafe(middle);
        rightBound = this.makeStringRegExSafe(rightBound);

        var leftString = String.IsNullOrWhiteSpace(leftBound) ? "" : String.Format("(?<=({0})).*", leftBound);
        if (String.IsNullOrWhiteSpace(leftString)) return null;

        var operatorString = String.IsNullOrWhiteSpace(middle) ? "" : String.Format("({0})", middle);
        if (String.IsNullOrWhiteSpace(operatorString)) return null;

        var rightString = String.IsNullOrWhiteSpace(rightBound) ? "" : String.Format(".*(?=({0}))", rightBound);

        var regex = leftString.concat(operatorString).concat(rightString);
        if (String.IsNullOrWhiteSpace(regex)) return null;
        return regex;
    }

    public static getLinesPerElement(context: string): [string[], number][] {
        var textDocumentLines = context.split("\n");
        var currentLines: string[] | null = null;
        var startLineNumber: number = 0;
        var elements: [string[], number][] = [];

        //Get all Rules
        for (let index = 0; index < textDocumentLines.length; index++) {
            const line = textDocumentLines[index];

            //Then we found a relevant line
            if (line.trim() !== '') {
                if (currentLines == null) {
                    currentLines = [];
                    startLineNumber = index;
                }
                currentLines.push(line);
            }

            //Then we found a paragraph or we are at the end of the file, so we add the rule
            if (currentLines != null &&
                (line.trim() === '' || index == textDocumentLines.length - 1)) {
                
                elements.push([currentLines, startLineNumber]);

                currentLines = null;
                startLineNumber = 0;
            }
        }

        return elements;
    }

    public static getWordAt(string: string, index: number): string {
        // Search for the word's beginning and end.
        var left = string.slice(0, index + 1).search(/\S+$/);
        var right = string.slice(index).search(/\s/);

        // The last word in the string is a special case.
        if (right < 0) {
            return string.slice(left);
        }

        // Return the word, using the located bounds to extract it from the string.
        return string.slice(left, right + index);
    }
}