import axios, { AxiosResponse } from "axios";
import { plainToClass } from "class-transformer";
import { OvDocument } from "src/data-model/ov-document/OvDocument";
import { GeneralApiResponse } from "src/rest-interface/response/GeneralApiResponse";
import { AliasesWithOperators } from "./aliases/AliasesWithOperators";
import { MainNode } from "./intelliSenseTree/MainNode";
import { Culture } from "./ParsingEnums";
import { ILintingResponse } from "./response/ILintingResponse";
import { LintingResponse } from "./response/LintingResponse";
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
     * @returns {Promise<GeneralApiResponse>}
     * @memberof ApiProxy
     */
    public static async postData(rule: string, parameter: RestParameter): Promise<GeneralApiResponse | null> {
        var data = {
            "rule": rule,
            "schema": JSON.stringify(parameter.schema),
            "culture": parameter.culture,
            "language": parameter.language
        };

        try {
            var response: AxiosResponse<GeneralApiResponse> = await axios.post(this.apiUrl, data, {
                validateStatus: (status) => { return status == 418 || status == 200; },
                headers: { "content-type": "application/json" }
            });

            if (!!response.data && !!response.data.mainAstNode) {
                var mainNode: MainNode = plainToClass(MainNode, response.data.mainAstNode);
                response.data.mainAstNode = mainNode;
            }            
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

    /**
     * Posts the given data to the REST-API and return the response
     *
     * @static
     * @param {string} rule one or more rules which should be posted to the rest-interface
     * @param {JSON} schema schema-definition as a JSON
     * @param {Culture} culture culture of the used natural languages
     * @param {Language} language programming-language where the rules should be parsed in
     * @returns {Promise<GeneralApiResponse>}
     * @memberof ApiProxy
     */
    public static async postLintingData(rule: string, parameter: RestParameter, ovDocument: OvDocument | undefined): Promise<LintingResponse | null> {
        if (!!ovDocument) {
            var relevantVariables = ovDocument.elementManager.getVariables()
                .filter(variable => rule.indexOf(variable.getName()) != -1);
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
            var response: AxiosResponse<ILintingResponse> = await axios.post(this.apiUrl + "/linting", data, {
                validateStatus: (status) => { return status == 418 || status == 200; },
                headers: { "content-type": "application/json" }
            });

            if (!!response.data && !!response.data.scope) {
                return plainToClass(LintingResponse, response.data);
            }
            return null;
        } catch (err) {
            console.log("Empty response in 'postLintingData'");
            return null;
        }
    }
}