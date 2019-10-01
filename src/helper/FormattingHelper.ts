export class FormattingHelper {

    /**
     * Removes duplicate spaces inside a string and returns it
     *
     * @static
     * @param {string} line string to remove the duplcates of
     * @returns {string}
     * @memberof FormattingHelper
     */
    public static removeDuplicateWhitespacesFromLine(line: string): string {
        return line.replace(new RegExp("[ \t]+", "g"), " ").trim();
    }

    /**
     * Generates a string of the given count of spaces
     *
     * @static
     * @param {number} count number of spaces
     * @returns {string} string of spaces
     * @memberof FormattingHelper
     */
    public static generateSpaces(count: number): string {
        var returnString = "";

        for (let index = 0; index < count; index++) {
            returnString += " ";
        }

        return returnString;
    }
}