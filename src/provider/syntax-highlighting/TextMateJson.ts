export interface TextMateJson {
    scopeName: string;
    name: string;
    fileTypes: string[];
    patterns: Pattern[];
}

export type Pattern = PatternMatch | PatternBeginEnd | PatternCapture;

export interface GenericPattern {
    comment?: string;
}

export interface PatternMatch extends GenericPattern {
    name: string;
    match: string;
}

export interface PatternBeginEnd extends GenericPattern {
    name: string;
    begin: string;
    end: string;
}

export interface PatternCapture extends GenericPattern {
    name?: string;
    captures: any;
}