import * as _ from "lodash";
import { OvStringHelper } from "../helper/OvStringHelper";
import { OvServer } from "../OvServer";
import { CodeResponse } from "../rest-interface/response/CodeResponse";
import { TextMateGrammarFactory } from "./syntax-highlighting/TextMateGrammarFactory";
import { LintingResponse } from "src/rest-interface/response/LintingResponse";
import { TextMateJson } from "./syntax-highlighting/TextMateJson";

/**
 * Generates the parameter of the notification "textDocument/semanticHighlighting" which isn't part of 
 * the protocol. The notification gets send, when the validation of the changed document is finished
 *
 * @export
 * @class OvSyntaxNotifier
 */
export class OvSyntaxNotifier {
    private textMateGrammar: TextMateJson | null;
    private generatedCode: string | null;
    private textMateGrammarFactory: TextMateGrammarFactory;

    constructor(private readonly server: OvServer) {
        this.textMateGrammar = null;
        this.generatedCode = null;
        this.textMateGrammarFactory = new TextMateGrammarFactory;
    }

    public sendTextMateGrammarIfNecessary(apiResponse: LintingResponse): void {
        var textMateGrammar: TextMateJson = this.textMateGrammarFactory.generateTextMateGrammar(apiResponse, this.server);
        //Check, if the new grammar is different and musst be send to the client
        if (!_.isEqual(textMateGrammar, this.textMateGrammar)) {
            this.textMateGrammar = textMateGrammar;
            this.server.connection.sendNotification("textDocument/semanticHighlighting", JSON.stringify(textMateGrammar));
        }
    }

    public sendGeneratedCodeIfNecessary(apiResponse: CodeResponse): void {
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
     * @param {CodeResponse} apiResponse that holds the implementation result
     * @returns  { language: string, value : string } that holds the required information
     * @memberof OvSyntaxNotifier
     */
    private generatedCodeDataObject(apiResponse: CodeResponse): { language: string, value: string } {
        var json = {
            language: OvStringHelper.convertOvLanguageToMonacoLanguage(this.server.language),
            value: apiResponse.implementationResult
        }

        return json;
    }
}
