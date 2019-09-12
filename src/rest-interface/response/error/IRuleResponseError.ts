/**
 * Data-Object for an error of a faulty rule which is thrown in the parsing-process
 *
 * @export
 * @interface RuleResponseError
 */
export interface IRuleResponseError {
    errorStart: number;
    source: string;
    errorLength: number;
    globalElementPosition: number;
    originalSource: string;
    userMessage: string;
}
