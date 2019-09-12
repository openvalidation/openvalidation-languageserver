import { GeneralApiResponse } from "../GeneralApiResponse";
import { IRuleResponseError } from "./IRuleResponseError";

/**
 * Data-Object for a unsuccessful REST-Request with faulty rules
 *
 * @export
 * @interface ApiRuleResponseError
 * @extends {GeneralApiResponse}
 */
export interface ApiRuleResponseError extends GeneralApiResponse {
    errors: IRuleResponseError[];
}

