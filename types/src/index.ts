import { Range } from "vscode-languageserver-protocol";

/**
 * Additional notifications that openVALIDATION requires
 *
 * @export
 * @enum {number}
 */
export enum NotificationEnum {
  // notifications from the server to the client
  GeneratedCode = "openVALIDATION/generatedCode",
  CommentKeywordChanged = "openVALIDATION/aliasesChanges",
  SemanticHighlighting = "openVALIDATION/semanticHighlighting",
  ParsingResult = "openVALIDATION/parsingResult",

  // notifications from the client to the server
  CultureChanged = "openVALIDATION/cultureChanged",
  LanguageChanged = "openVALIDATION/languageChanged",
  SchemaChanged = "openVALIDATION/schemaChanged"
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

/**
 * Interface for the notification of new generated code
 *
 * @export
 * @interface ICodeNotification
 */
export interface ICodeNotification {
  language: string;
  framework: string;
  implementation: string;
}

/**
 * Interface for the notification of the changed schema
 *
 * @export
 * @interface ISchemaNotification
 */
export interface ISchemaNotification {
  schema: string;
  uri: string;
}

/**
 * Interface for the notification of the changed culture
 *
 * @export
 * @interface ICultureNotification
 */
export interface ICultureNotification {
  culture: string;
  uri: string;
}

/**
 * Interface for the notification of the changed language
 *
 * @export
 * @interface ILanguageNotification
 */
export interface ILanguageNotification {
  language: string;
  uri: string;
}

/**
 * Interface for the textmate-grammar-json
 *
 * @export
 * @interface ITextMateJson
 */
export interface ITextMateJson {
  scopeName: string;
  name: string;
  fileTypes: string[];
  patterns: Pattern[];
}

export type Pattern = IPatternMatch | IPatternBeginEnd | IPatternCapture;

/**
 * Base interface for textmate patterns which only contains an optional comment
 *
 * @export
 * @interface IGenericPattern
 */
export interface IGenericPattern {
  comment?: string;
}

/**
 * match-pattern which consists of a name and a match
 *
 * @export
 * @interface IPatternMatch
 * @extends {IGenericPattern}
 */
export interface IPatternMatch extends IGenericPattern {
  name: string;
  match: string;
}

/**
 * begin-/end-pattern which consists of a name, begin and an end
 *
 * @export
 * @interface IPatternBeginEnd
 * @extends {IGenericPattern}
 */
export interface IPatternBeginEnd extends IGenericPattern {
  name: string;
  begin: string;
  end: string;
}

/**
 * pattern which only contains captures and an optional name
 *
 * @export
 * @interface IPatternCapture
 * @extends {IGenericPattern}
 */
export interface IPatternCapture extends IGenericPattern {
  match: string;
  captures: any;
}

export interface SyntaxToken {
  range: Range;
  pattern: string;
}
