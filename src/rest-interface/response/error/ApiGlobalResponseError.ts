import { GeneralApiResponse } from "../GeneralApiResponse";

/**
 * Data-Object for a unsuccessful REST-Request with a global error which
 * can't be assigned to a specific rule
 *
 * @export
 * @interface ApiGlobalResponseError
 * @extends {GeneralApiResponse}
 */
export interface ApiGlobalResponseError extends GeneralApiResponse {
    errors: GlobalResponseError[];
}

/**
 * Data-Object for global error which is thrown in the parsing-process
 *
 * @export
 * @interface GlobalResponseError
 */
interface GlobalResponseError {
    userMessage: string;
}
