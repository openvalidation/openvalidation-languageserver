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
