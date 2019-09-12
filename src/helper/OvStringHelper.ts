import { AstKey } from "../data-model/AstKeyEnum";
import { Language } from "../rest-interface/ParsingEnums";

/**
 * Beautifies the generic string from the parse (e.g. astrule -> rule)
 *
 * @export
 * @class OvDocumentHelper
 */
export class OvStringHelper {
    public static getTypeFromAstType(astType: string) {
        switch (astType) {
            case AstKey.Rule:
                return "Rule";
            case AstKey.Variable:
                return "Variable";
            case AstKey.Comment:
                return "Comment";
            case AstKey.Unknown:
                return "Unknown";
            default:
                return astType;
        }
    }

    /**
     * Returns the monaco-representation of the ov-language
     *
     * @private
     * @param {string} language language-identifier of the ov-parser
     * @returns {string} the language-identifier of monaco
     * @memberof OvSyntaxNotifier
     */
    public static convertOvLanguageToMonacoLanguage(language: Language): string {
        switch (language) {
            case Language.Node:
                return "JavaScript";
            default:
                return language;
        }
    }
}