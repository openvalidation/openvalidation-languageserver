import { DocumentRangeFormattingParams, TextEdit } from "vscode-languageserver";
import { OvServer } from "../OvServer";
import { Provider } from "./Provider";

/**
 * Response-Provider for "onDocumentRangeFormatting"
 *
 * @export
 * @class FormattingProvider
 * @extends {Provider}
 */
export class FormattingProvider extends Provider {
    static bind(server: OvServer) {
        return new FormattingProvider(server);
    }

    constructor(server: OvServer) {
        super(server);
        this.connection.onDocumentRangeFormatting(params => this.documentRangeFormatting(params));
    }

    /**
     * Generates the needed edits which needs to be done in the given document 
     * to format the code perfectly
     *
     * @private
     * @param {DocumentRangeFormattingParams} params parameters that define the given document
     * and the range that should be formatted
     * @returns {TextEdit[]} list of edits that needs to be done in the document
     * @memberof FormattingProvider
     */
    public documentRangeFormatting(params: DocumentRangeFormattingParams): TextEdit[] {
        var ovDocument = this.ovDocuments.get(params.textDocument.uri);
        if (!ovDocument) return [];

        var textEdits: TextEdit[] = [];

        var elements = ovDocument.elementManager.getElementsByRange(params.range);
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];

            var currentTextEdits = element.formatCode(this.server.aliasHelper);
            textEdits = textEdits.concat(currentTextEdits);
        }

        return textEdits;
    }
}