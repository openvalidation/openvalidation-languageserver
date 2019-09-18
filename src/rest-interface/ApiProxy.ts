import axios, { AxiosResponse } from "axios";
import { plainToClass } from "class-transformer";
import { OvDocument } from "../data-model/ov-document/OvDocument";
import { AliasesWithOperators } from "./aliases/AliasesWithOperators";
import { Culture } from "./ParsingEnums";
import { CompletionResponse } from "./response/CompletionResponse";
import { LintingResponse } from "./response/LintingResponse";
import { CodeResponse } from "./response/CodeResponse";
import { RestParameter } from "./RestParameter";

/**
 * Class for requests to the openVALIDATION REST-API
 *
 * @export
 * @class ApiProxy
 */
export class ApiProxy {
    // private static readonly apiUrl = "http://api.openvalidation.io";
    private static readonly apiUrl = "http://localhost:31057";

    /**
     * Posts the given data to the REST-API and return the response
     *
     * @static
     * @param {string} rule one or more rules which should be posted to the rest-interface
     * @param {JSON} schema schema-definition as a JSON
     * @param {Culture} culture culture of the used natural languages
     * @param {Language} language programming-language where the rules should be parsed in
     * @returns {Promise<CodeResponse>}
     * @memberof ApiProxy
     */
    public static async postData(rule: string, parameter: RestParameter): Promise<CodeResponse | null> {
        var data = {
            "rule": rule,
            "schema": JSON.stringify(parameter.schema),
            "culture": parameter.culture,
            "language": parameter.language
        };

        try {
            var response: AxiosResponse<CodeResponse> = await axios.post(this.apiUrl, data, {
                validateStatus: (status) => { return status == 418 || status == 200; },
                headers: { "content-type": "application/json" }
            });    
            return response.data;

        } catch (err) {
            console.log("Empty response in 'postData'");
            return null;
        }
    }

    /**
     * Asks the REST-API for Aliases for the given culture
     *
     * @static
     * @param {Culture} culture culture we want to get the aliases of
     * @returns {(Promise<Map<string, string> | null>)}
     * @memberof ApiProxy
     */
    public static async getAliases(culture: Culture): Promise<AxiosResponse<AliasesWithOperators> | null> {
        var data = {
            "culture": culture
        };

        try {
            var response: AxiosResponse<AliasesWithOperators> = await axios.post(this.apiUrl + "/aliases", data, {
                headers: { "content-type": "application/json", "accept": "application/json" }
            });

            if (!!response.data) {
                var aliases: AliasesWithOperators = plainToClass(AliasesWithOperators, response.data);
                response.data = aliases;
            }

            return response;
        } catch (err) {
            console.log("Empty response in 'getAliases'");
            return null;
        }
    }

    public static async postLintingData(rule: string, parameter: RestParameter): Promise<LintingResponse | null> {
        var data = {
            "rule": rule,
            "schema": JSON.stringify(parameter.schema),
            "culture": parameter.culture,
            "language": parameter.language
        };

        try {
            var response: AxiosResponse<LintingResponse> = await axios.post(this.apiUrl + "/linting", data, {
                validateStatus: (status) => { return status == 418 || status == 200; },
                headers: { "content-type": "application/json" }
            });

            if (!!response.data) {
                var responseData: LintingResponse = plainToClass(LintingResponse, response.data);
                response.data = responseData;
            }
            return response.data;
        } catch (err) {
            console.log("Empty response in 'postLintingData'");
            return null;
        }
    }

    public static async postCompletionData(rule: string, parameter: RestParameter, ovDocument: OvDocument | undefined): Promise<CompletionResponse | null> {
        if (!!ovDocument) {
            var relevantVariables = ovDocument.elementManager.getVariables()
                .filter(variable => rule.indexOf(variable.getName()) != -1 
                        && !!variable.getValue()
                        && rule.trim() != variable.getLines().join('\n').trim());
            rule += "\n\n" + relevantVariables
                .map(variable => variable.getLines().join('\n')).join('\n\n');
        }

        var data = {
            "rule": rule,
            "schema": JSON.stringify(parameter.schema),
            "culture": parameter.culture,
            "language": parameter.language
        };

        try {
            var response: AxiosResponse<LintingResponse> = await axios.post(this.apiUrl + "/completion", data, {
                validateStatus: (status) => { return status == 418 || status == 200; },
                headers: { "content-type": "application/json" }
            });

            if (!!response.data) {
                return plainToClass(CompletionResponse, response.data);
            }
            return null;
        } catch (err) {
            console.log("Empty response in 'postLintingData'");
            return null;
        }
    }
}