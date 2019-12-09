import { ScopeEnum } from "../../enums/ScopeEnum";
import { StringHelper } from "../../helper/StringHelper";
import { OvServer } from "../../OvServer";
import { LintingResponse } from "../../rest-interface/response/LintingResponse";
import { TextMateParameter } from "./TextMateParameter";
import { ITextMateJson } from "ov-language-server-types";

/**
 * Generates the textmate grammar which the given response of the REST-API
 *
 * @export
 * @class TextMateGrammarFactory
 */
export class TextMateGrammarFactory {
  private emptyLineRegex: string = "^[ \t]*$";

  constructor() {}

  /**
   * Generates and returns the TextMateGrammar
   *
   * @param {LintingResponse} apiResponse rest-response that holds the relevant parsed data
   * @param {OvServer} server sever that contains additional parameter we need for generation
   * @returns {ITextMateJson} JSON-Object of the TextMate-Grammar
   * @memberof TextMateGrammarFactory
   */
  public generateTextMateGrammar(
    apiResponse: LintingResponse,
    server: OvServer
  ): ITextMateJson {
    const parameter: TextMateParameter = new TextMateParameter(
      apiResponse,
      server
    );
    const returnPar = this.fillTextMateGrammar(parameter);
    return returnPar;
  }

  /**
   * fills the textmate grammar which the calculated parameter
   *
   * @private
   * @param {TextMateParameter} parameter previously calculated parameter that holds the data for the grammar
   * @returns {ITextMateJson}
   * @memberof TextMateGrammarFactory
   */
  private fillTextMateGrammar(parameter: TextMateParameter): ITextMateJson {
    const json: ITextMateJson = {
      scopeName: "source.ov",
      name: "openVALIDATION",
      fileTypes: ["ov"],
      patterns: []
    };

    // Comments
    json.patterns.push({
      comment: "standard-comment",
      name: ScopeEnum.Comment,
      begin: "(?i)(" + parameter.$commentKeyword + ")",
      end: this.emptyLineRegex
    });

    // Error-Message / Action
    json.patterns.push({
      comment: "pattern for actions in a rule",
      name: ScopeEnum.StaticString,
      begin: "(?<=((?i)(" + parameter.$thenKeyword + ")))",
      end: this.emptyLineRegex
    });

    // Keywords without Operators
    if (parameter.$keywords.length > 0) {
      json.patterns.push({
        comment: "pattern for general keywords",
        name: "keyword.ov",
        match: StringHelper.getCaseUnsensitiveOredRegExForWords(
          ...parameter.$keywords
        )
      });
    }

    // Use Schema
    json.patterns.push({
      comment: "pattern for use-schema",
      match: `((?i)USE SCHEMA)(.*)`,
      captures: {
        1: { name: ScopeEnum.Keyword },
        2: { name: ScopeEnum.StaticString }
      }
    });

    // Variables
    if (parameter.$identifier.length > 0) {
      json.patterns.push({
        comment: "pattern for identifier (variables)",
        match: `((?i)${
          parameter.$asKeyword
        }).*${StringHelper.getCaseUnsensitiveOredRegExForWords(
          ...parameter.$identifier
        )}`,
        captures: {
          1: { name: ScopeEnum.Keyword },
          2: { name: ScopeEnum.Variable }
        }
      });
    }

    // Operator Keywords
    json.patterns.push(
      ...parameter.getOperationAndOperandPatterns(parameter.$asKeyword)
    );

    return json;
  }
}
