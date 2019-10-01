import { StringHelper } from "../../helper/StringHelper";
import { OvServer } from "../../OvServer";
import { TextMateJson } from "./TextMateJson";
import { TextMateParameter } from "./TextMateParameter";
import { LintingResponse } from "../../rest-interface/response/LintingResponse";
import { ScopeEnum } from "../../enums/ScopeEnum";

/**
 * Generates the textmate grammar which the given response of the REST-API
 *
 * @export
 * @class TextMateGrammarFactory
 */
export class TextMateGrammarFactory {

    private emptyLineRegex: string = '^[ \t]*$';

    constructor() { }

    /**
     * Generates and returns the TextMateGrammar
     *
     * @param {LintingResponse} apiResponse rest-response that holds the relevant parsed data
     * @param {OvServer} server sever that contains additional parameter we need for generation
     * @returns {TextMateJson} JSON-Object of the TextMate-Grammar
     * @memberof TextMateGrammarFactory
     */
    public generateTextMateGrammar(apiResponse: LintingResponse, server: OvServer): TextMateJson {
        var parameter: TextMateParameter = new TextMateParameter(apiResponse, server);;
        var returnPar = this.fillTextMateGrammar(parameter);
        return returnPar;
    }

    /**
     * fills the textmate grammar which the calculated parameter
     *
     * @private
     * @param {TextMateParameter} parameter previously calculated parameter that holds the data for the grammar
     * @returns {TextMateJson}
     * @memberof TextMateGrammarFactory
     */
    private fillTextMateGrammar(parameter: TextMateParameter): TextMateJson {
        var json: TextMateJson = {
            scopeName: "source.ov",
            name: "openVALIDATION",
            fileTypes: ['ov'],
            patterns: []
        };

        // Comments
        json.patterns.push({
            comment: 'standard-comment',
            name: 'comment.line',
            begin: '(?i)(' + parameter.$commentKeyword + ')',
            end: this.emptyLineRegex
        });

        // Error-Message / Action
        json.patterns.push({
            comment: 'pattern for actions in a rule',
            name: 'string.action.ov',
            begin: '(?<=((?i)(' + parameter.$thenKeyword + ')))',
            end: this.emptyLineRegex
        });

        // Variables
        if (parameter.$identifier.length > 0) {
            json.patterns.push({
                comment: 'pattern for identifier (variables)',
                name: 'variable.parameter.name.ov',
                match: `((?i)${parameter.$asKeyword}).*${StringHelper.getCaseUnsensitiveOredRegExForWords(...parameter.$identifier)}`,
                captures: {
                    '1': { name: ScopeEnum.Keyword },
                    '2': { name: ScopeEnum.Variable }
                } 
            });
        }

        // Keywords without Operators
        if (parameter.$keywords.length > 0) {
            json.patterns.push({
                comment: 'pattern for general keywords',
                name: 'keyword.ov',
                match: StringHelper.getCaseUnsensitiveOredRegExForWords(...parameter.$keywords)
            });
        }

        // Complex Schema
        var schemaRegex = parameter.getComplexSchemaRegExp();
        if (!!schemaRegex) {
            json.patterns.push({
                comment: 'pattern for complex `of`-keywords',
                name: 'keyword.of.ov',
                match: schemaRegex
            });
        }

        // Operator Keywords
        var operationRegex = parameter.getOperationAndOperandPatterns();
        if (!!operationRegex) {
            json.patterns.push(...operationRegex);
        }

        return json;
    }
}