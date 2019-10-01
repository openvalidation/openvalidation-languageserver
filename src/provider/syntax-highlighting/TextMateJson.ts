/**
 * Interface for the textmate-grammar-json
 *
 * @export
 * @interface TextMateJson
 */
export interface TextMateJson {
    scopeName: string;
    name: string;
    fileTypes: string[];
    patterns: Pattern[];
}

export type Pattern = PatternMatch | PatternBeginEnd | PatternCapture;

/**
 * Base interface for textmate patterns which only contains an optional comment
 *
 * @export
 * @interface GenericPattern
 */
export interface GenericPattern {
    comment?: string;
}

/**
 * match-pattern which consists of a name and a match
 *
 * @export
 * @interface PatternMatch
 * @extends {GenericPattern}
 */
export interface PatternMatch extends GenericPattern {
    name: string;
    match: string;
}

/**
 * begin-/end-pattern which consists of a name, begin and an end
 *
 * @export
 * @interface PatternBeginEnd
 * @extends {GenericPattern}
 */
export interface PatternBeginEnd extends GenericPattern {
    name: string;
    begin: string;
    end: string;
}

/**
 * pattern which only contains captures and an optional name
 *
 * @export
 * @interface PatternCapture
 * @extends {GenericPattern}
 */
export interface PatternCapture extends GenericPattern {
    name?: string;
    captures: any;
}