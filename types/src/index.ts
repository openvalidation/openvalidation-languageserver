/**
 * Additional notifications that openVALIDATION requires
 *
 * @export
 * @enum {number}
 */
export enum NotificationEnum {
  // notifications from the server to the client
  GeneratedCode = "textDocument/generatedCode",
  CommentKeywordChanged = "textDocument/aliasesChanges",
  SemanticHighlighting = "textDocument/semanticHighlighting",

  // notifications from the client to the server
  CultureChanged = "textDocument/cultureChanged",
  LanguageChanged = "textDocument/languageChanged",
  SchemaChanged = "textDocument/schemaChanged"
}

/**
 * Languages which are supported by openVALIDATION (e.g. Java)
 *
 * @export
 * @enum {number}
 */
export enum LanguageEnum {
  Java = "Java",
  CSharp = "CSharp",
  JavaScript = "JavaScript",
  Node = "Node",
  Python = "Python"
}

/**
 * Generates the default file ending for the given language
 *
 * @export
 * @param {LanguageEnum} language programming-language
 * @returns {string} default file ending for the language
 */
export function getFileEnding(language: LanguageEnum): string {
  switch (language) {
    case LanguageEnum.Java:
      return "java";
    case LanguageEnum.CSharp:
      return "cs";
    case LanguageEnum.JavaScript:
    case LanguageEnum.Node:
      return "js";
    case LanguageEnum.Python:
      return "py";
    default:
      return "";
  }
}

/**
 * Cultures which are supported by openVALIDATION (e.g. en)
 *
 * @export
 * @enum {number}
 */
export enum CultureEnum {
  English = "en",
  German = "de",
  Russian = "ru"
}
