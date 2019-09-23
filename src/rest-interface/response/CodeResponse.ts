import { GeneralApiResponse } from "./GeneralApiResponse";

/**
 * Data-Object for a successful REST-Request
 *
 * @export
 * @interface CodeResponse
 * @extends {GeneralApiResponse}
 */
export interface CodeResponse extends GeneralApiResponse {
    frameworkResult: string;
    implementationResult: string;
}