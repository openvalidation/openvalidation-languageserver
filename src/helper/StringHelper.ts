/**
 * Defines some useful methods for strings
 *
 * @export
 * @class StringHelper
 */
export class StringHelper {
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
