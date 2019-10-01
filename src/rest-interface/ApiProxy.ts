import axios, { AxiosResponse } from "axios";
import { plainToClass } from "class-transformer";
import { VariableNode } from "src/data-model/syntax-tree/element/VariableNode";
import { OvDocument } from "../data-model/ov-document/OvDocument";
import { AliasesWithOperators } from "./aliases/AliasesWithOperators";
import { CultureEnum } from "../enums/CultureEnum";
import { ICodeResponse } from "./response/ICodeResponse";
import { CompletionResponse } from "./response/CompletionResponse";
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
     * Send the whole file to the REST-API to receive the generated code
     *
     * @static
     * @param {string} rule  one or more rules which should be posted to the rest-interface
     * @param {RestParameter} parameter parameter with the necessary parsing-data
     * @returns {(Promise<ICodeResponse | null>)} parsed code or null if an error appeared
     * @memberof ApiProxy
     */
    public static async postData(rule: string, parameter: RestParameter): Promise<ICodeResponse | null> {
        var data = {
            "rule": rule,
            "schema": JSON.stringify(parameter.$schema),
            "culture": parameter.$culture,
            "language": parameter.$language
        };

        try {
            var response: AxiosResponse<ICodeResponse> = await axios.post(this.apiUrl, data, {
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
     * @param {CultureEnum} culture culture we want to get the aliases of
     * @returns {(Promise<AxiosResponse<AliasesWithOperators> | null>)} aliases we got from the rest-interface, null if an error appeared
     * @memberof ApiProxy
     */
    public static async getAliases(culture: CultureEnum): Promise<AxiosResponse<AliasesWithOperators> | null> {
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
     * Posts the whole data to the REST-API which is used for the linting function.
     * We receive the parsed syntax-tree and the appeared errors.
     *
     * @static
     * @param {string} rule  one or more rules which should be posted to the rest-interface
     * @param {RestParameter} parameter parameter with the necessary parsing-data
     * @returns {(Promise<LintingResponse | null>)} parsed content which the errors
     * @memberof ApiProxy
     */
    public static async postLintingData(rule: string, parameter: RestParameter): Promise<LintingResponse | null> {
        var data = {
            "rule": rule,
            "schema": JSON.stringify(parameter.$schema),
            "culture": parameter.$culture,
            "language": parameter.$language
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

    /**
     * Posts the given rule to the REST-API and receives only the parsed node.
     * Before parsing, we look for used variables inside the element, that we can parse it properly
     *
     * @static
     * @param {string} rule  one which should be posted to the rest-interface
     * @param {RestParameter} parameter parameter with the necessary parsing-data
     * @param {(OvDocument | undefined)} ovDocument document, which is used for the 
     * @returns {(Promise<CompletionResponse | null>)} response or null if an error appeared
     * @memberof ApiProxy
     */
    public static async postCompletionData(rule: string, parameter: RestParameter, ovDocument: OvDocument | undefined): Promise<CompletionResponse | null> {
        if (!!ovDocument) {
            var asKeyword: string | null = parameter.$aliasHelper.getAsKeyword();
            var relevantVariables: VariableNode[] = ovDocument.$elementManager.getUsedVariables(rule, asKeyword);
            rule += "\n\n" + relevantVariables.map(variable => variable.getLines().join('\n')).join('\n\n');
        }

        var data = {
            "rule": rule,
            "schema": JSON.stringify(parameter.$schema),
            "culture": parameter.$culture,
            "language": parameter.$language
        };

        try {
            var response: AxiosResponse<CompletionResponse> = await axios.post(this.apiUrl + "/completion", data, {
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