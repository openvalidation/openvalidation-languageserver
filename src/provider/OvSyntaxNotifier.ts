import * as _ from "lodash";
import { LintingResponse } from "src/rest-interface/response/LintingResponse";
import { OvStringHelper } from "../helper/OvStringHelper";
import { OvServer } from "../OvServer";
import { ICodeResponse } from "../rest-interface/response/ICodeResponse";
import { TextMateGrammarFactory } from "./syntax-highlighting/TextMateGrammarFactory";
import { TextMateJson } from "./syntax-highlighting/TextMateJson";

/**
 * Generates the parameter of the notification ``textDocument/semanticHighlighting`` and ``textDocument/generatedCode``
 * which isn't part of the protocol. The notification gets send, when the validation of the changed document is finished
 *
 * @export
 * @class OvSyntaxNotifier
 */
export class OvSyntaxNotifier {
    private textMateGrammar: TextMateJson | null;
    private generatedCode: string | null;
    private textMateGrammarFactory: TextMateGrammarFactory;

    /**
     * Creates an instance of OvSyntaxNotifier.
     * @param {OvServer} server server that contains required parameters
     * @memberof OvSyntaxNotifier
     */
    constructor(private readonly server: OvServer) {
        this.textMateGrammar = null;
        this.generatedCode = null;
        this.textMateGrammarFactory = new TextMateGrammarFactory;
    }

    /**
     * Checks if the textmate-grammar has changed and sends it to the client if this is the case
     *
     * @param {LintingResponse} apiResponse
     * @memberof OvSyntaxNotifier
     */
    public sendTextMateGrammarIfNecessary(apiResponse: LintingResponse): void {
        var textMateGrammar: TextMateJson = this.textMateGrammarFactory.generateTextMateGrammar(apiResponse, this.server);
        //Check, if the new grammar is different and musst be send to the client
        if (!_.isEqual(textMateGrammar, this.textMateGrammar)) {
            this.textMateGrammar = textMateGrammar;
            this.server.connection.sendNotification("textDocument/semanticHighlighting", JSON.stringify(textMateGrammar));
        }
    }


    /**
     * Checks if the code has changed and sends it to the client if this is the case
     *
     * @param {ICodeResponse} apiResponse
     * @memberof OvSyntaxNotifier
     */
    public sendGeneratedCodeIfNecessary(apiResponse: ICodeResponse): void {
        var newCodeNotification = this.generatedCodeDataObject(apiResponse);

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
     * @param {ICodeResponse} apiResponse that holds the implementation result
     * @returns  { language: string, value : string } that holds the required information
     * @memberof OvSyntaxNotifier
     */
    private generatedCodeDataObject(apiResponse: ICodeResponse): { language: string, value: string } {
        var json = {
            language: OvStringHelper.convertOvLanguageToMonacoLanguage(this.server.language),
            value: apiResponse.implementationResult
        }

        return json;
    }
}
