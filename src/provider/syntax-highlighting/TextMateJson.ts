export interface TextMateJson {
    scopeName: string;
    name: string;
    fileTypes: string[];
    patterns: Pattern[];
}

export type Pattern = PatternMatch | PatternBeginEnd;

export interface PatternMatch {
    comment: string;
    name: string;
    match: string;
}

export interface PatternBeginEnd {
    comment: string;
    name: string;
    begin: string;
    end: string;
}