import * as _ from "lodash";
import { OvStringHelper } from "../helper/OvStringHelper";
import { OvServer } from "../OvServer";
import { GeneralApiResponse } from "../rest-interface/response/GeneralApiResponse";
import { ApiResponseSuccess } from "../rest-interface/response/success/ApiResponseSuccess";
import { TextMateGrammarFactory } from "./syntax-highlighting/TextMateGrammarFactory";
import { LintingResponse } from "src/rest-interface/response/LintingResponse";

/**
 * Generates the parameter of the notification "textDocument/semanticHighlighting" which isn't part of 
 * the protocol. The notification gets send, when the validation of the changed document is finished
 *
 * @export
 * @class OvSyntaxNotifier
 */
export class OvSyntaxNotifier {
    private textMateGrammar: any;
    private generatedCode: string | null;
    private textMateGrammarFactory: TextMateGrammarFactory;

    constructor(private readonly server: OvServer) {
        this.textMateGrammar = null;
        this.generatedCode = null;
        this.textMateGrammarFactory = new TextMateGrammarFactory;
    }

    public sendTextMateGrammarIfNecessary(apiResponse: LintingResponse): void {
        var textMateGrammar = this.textMateGrammarFactory.generateTextMateGrammar(apiResponse, this.server);

        //Check, if the new grammar is different and musst be send to the client
        if (!_.isEqual(textMateGrammar, this.textMateGrammar)) {
            this.textMateGrammar = textMateGrammar;
            this.server.connection.sendNotification("textDocument/semanticHighlighting", textMateGrammar);
        }
    }

    public sendGeneratedCodeIfNecessary(apiResponse: GeneralApiResponse): void {
        var apiSuccess: ApiResponseSuccess = apiResponse as ApiResponseSuccess;
        var newCodeNotification = this.generatedCodeDataObject(apiSuccess);

        //Check, if the new code is different and musst be send to the client
        if (newCodeNotification.value && !_.isEqual(newCodeNotification.value, this.generatedCode)) {
            this.generatedCode = newCodeNotification.value;
            this.server.connection.sendNotification("textDocument/generatedCode", JSON.stringify(newCodeNotification));
        }
    }

    /**
     * Generates the data-object for the generated code
     *
     * @private
     * @param {ApiResponseSuccess} apiResponse that holds the implementation result
     * @returns  { language: string, value : string } that holds the required information
     * @memberof OvSyntaxNotifier
     */
    private generatedCodeDataObject(apiResponse: ApiResponseSuccess): { language: string, value: string } {
        var json = {
            language: OvStringHelper.convertOvLanguageToMonacoLanguage(this.server.language),
            value: apiResponse.implementationResult
        }

        return json;
    }
}
