import { LanguageEnum } from "ov-language-server-types";

/**
 * Beautifies the generic string from the parse (e.g. astrule -> rule)
 *
 * @export
 * @class OvDocumentHelper
 */
export class LanguageHelper {
  /**
   * Returns the monaco-representation of the ov-language
   *
   * @private
   * @param {string} language language-identifier of the ov-parser
   * @returns {string} the language-identifier of monaco
   * @memberof OvSyntaxNotifier
   */
  public static convertOvLanguageToMonacoLanguage(
    language: LanguageEnum
  ): string {
    switch (language) {
      case LanguageEnum.Node:
        return "JavaScript";
      default:
        return language;
    }
  }
}
