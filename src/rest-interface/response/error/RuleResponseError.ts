import { IndexRange } from "src/rest-interface/intelliSenseTree/IndexRange";
import { Diagnostic, DiagnosticSeverity } from "vscode-languageserver";

/**
 * Data-Object for an error of a faulty rule which is thrown in the parsing-process
 *
 * @export
 * @interface RuleResponseError
 */
export class RuleResponseError {
    private errorStart: number;
    private source: string;
    private errorLength: number;
    private globalElementPosition: number;
    private originalSource: string;
    private userMessage: string;

    constructor(errorStart: number, source: string, errorLength: number, globalElementPosition: number, originalSource: string, userMessage: string) {
        this.errorStart = errorStart;
        this.source = source;
        this.errorLength = errorLength;
        this.globalElementPosition = globalElementPosition;
        this.originalSource = originalSource;
        this.userMessage = userMessage;
    }

    /**
     * Getter errorStart
     * @return {number}
     */
    public getErrorStart(): number {
        return this.errorStart;
    }

    /**
     * Getter source
     * @return {string}
     */
    public getSource(): string {
        return this.source;
    }

    /**
     * Getter errorLength
     * @return {number}
     */
    public getErrorLength(): number {
        return this.errorLength;
    }

    /**
     * Getter globalElementPosition
     * @return {number}
     */
    public getGlobalElementPosition(): number {
        return this.globalElementPosition;
    }

    /**
     * Getter originalSource
     * @return {string}
     */
    public getOriginalSource(): string {
        return this.originalSource;
    }

    /**
     * Getter userMessage
     * @return {string}
     */
    public getUserMessage(): string {
        return this.userMessage;
    }

    /**
     * Setter errorStart
     * @param {number} value
     */
    public setGetErrorStart(value: number) {
        this.errorStart = value;
    }

    /**
     * Setter source
     * @param {string} value
     */
    public setSource(value: string) {
        this.source = value;
    }

    /**
     * Setter errorLength
     * @param {number} value
     */
    public setErrorLength(value: number) {
        this.errorLength = value;
    }

    /**
     * Setter globalElementPosition
     * @param {number} value
     */
    public setGlobalElementPosition(value: number) {
        this.globalElementPosition = value;
    }

    /**
     * Setter originalSource
     * @param {string} value
     */
    public setOriginalSource(value: string) {
        this.originalSource = value;
    }

    /**
     * Setter userMessage
     * @param {string} value
     */
    public setUserMessage(value: string) {
        this.userMessage = value;
    }

    public toDiagnostic(range: IndexRange): Diagnostic {
        return Diagnostic.create(range.asRange(), this.userMessage, DiagnosticSeverity.Error);
    }
}

