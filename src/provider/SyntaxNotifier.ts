import * as _ from "lodash";
import { NotificationEnum } from "ov-language-server-types";
import { LanguageHelper } from "../helper/LanguageHelper";
import { OvServer } from "../OvServer";
import { ICodeResponse } from "../rest-interface/response/ICodeResponse";
import { LintingResponse } from "../rest-interface/response/LintingResponse";
import { TextMateGrammarFactory } from "./syntax-highlighting/TextMateGrammarFactory";
import { ITextMateJson } from "./syntax-highlighting/TextMateJson";

/**
 * Generates the parameter of the notification ``textDocument/semanticHighlighting`` and ``textDocument/generatedCode``
 * which isn't part of the protocol. The notification gets send, when the validation of the changed document is finished
 *
 * @export
 * @class SyntaxNotifier
 */
export class SyntaxNotifier {
  private textMateGrammar: ITextMateJson | null;
  private generatedCode: string | null;
  private textMateGrammarFactory: TextMateGrammarFactory;

  /**
   * Creates an instance of OvSyntaxNotifier.
   * @param {OvServer} server server that contains required parameters
   * @memberof SyntaxNotifier
   */
  constructor(private readonly server: OvServer) {
    this.textMateGrammar = null;
    this.generatedCode = null;
    this.textMateGrammarFactory = new TextMateGrammarFactory();
  }

  /**
   * Checks if the textmate-grammar has changed and sends it to the client if this is the case.
   * This is only done, when the mainNode contains scopes.
   *
   * @param {LintingResponse} apiResponse
   * @memberof SyntaxNotifier
   */
  public sendTextMateGrammarIfNecessary(apiResponse: LintingResponse): void {
    // If this is the case, we have a parsing-error
    if (
      !apiResponse.$mainAstNode ||
      apiResponse.$mainAstNode.$scopes.length === 0
    ) {
      return;
    }

    const textMateGrammar: ITextMateJson = this.textMateGrammarFactory.generateTextMateGrammar(
      apiResponse,
      this.server
    );
    // Check, if the new grammar is different and musst be send to the client
    if (!_.isEqual(textMateGrammar, this.textMateGrammar)) {
      this.textMateGrammar = textMateGrammar;
      this.server.connection.sendNotification(
        NotificationEnum.SemanticHighlighting,
        JSON.stringify(textMateGrammar)
      );
    }
  }

  /**
   * Checks if the code has changed and sends it to the client if this is the case
   *
   * @param {ICodeResponse} apiResponse
   * @memberof SyntaxNotifier
   */
  public sendGeneratedCodeIfNecessary(apiResponse: ICodeResponse): void {
    const newCodeNotification = this.generatedCodeDataObject(apiResponse);

    // Check, if the new code is different and musst be send to the client
    if (
      newCodeNotification.value &&
      !_.isEqual(newCodeNotification.value, this.generatedCode)
    ) {
      this.generatedCode = newCodeNotification.value;
      this.server.connection.sendNotification(
        NotificationEnum.GeneratedCode,
        JSON.stringify(newCodeNotification)
      );
    }
  }

  /**
   * Generates the data-object for the generated code
   *
   * @private
   * @param {ICodeResponse} apiResponse that holds the implementation result
   * @returns  { language: string, value : string } that holds the required information
   * @memberof SyntaxNotifier
   */
  private generatedCodeDataObject(
    apiResponse: ICodeResponse
  ): { language: string; value: string } {
    const json = {
      language: LanguageHelper.convertOvLanguageToMonacoLanguage(
        this.server.language
      ),
      value: apiResponse.implementationResult
    };

    return json;
  }
}
