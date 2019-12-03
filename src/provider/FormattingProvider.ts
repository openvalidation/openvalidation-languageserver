import { DocumentRangeFormattingParams, TextEdit } from "vscode-languageserver";
import { OvServer } from "../OvServer";
import { Provider } from "./Provider";

/**
 * Response-Provider for ``onDocumentRangeFormatting``
 *
 * @export
 * @class FormattingProvider
 * @extends {Provider}
 */
export class FormattingProvider extends Provider {
  /**
   * Creates the provider and binds the server to it.
   *
   * @static
   * @param {OvServer} server server we want to bind the provider to
   * @returns {FormattingProvider} created provider
   * @memberof FormattingProvider
   */
  public static bind(server: OvServer): FormattingProvider {
    return new FormattingProvider(server);
  }

  /**
   * Creates an instance of FormattingProvider.
   * @param {OvServer} server server we want to connect to
   * @memberof FormattingProvider
   */
  constructor(server: OvServer) {
    super(server);
    this.connection.onDocumentRangeFormatting(params =>
      this.documentRangeFormatting(params)
    );
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
  public documentRangeFormatting(
    params: DocumentRangeFormattingParams
  ): TextEdit[] {
    const ovDocument = this.ovDocuments.get(params.textDocument.uri);
    if (!ovDocument) {
      return [];
    }

    const textEdits: TextEdit[] = [];

    const elements = ovDocument.$elementManager.getElementsByRange(
      params.range
    );
    for (const element of elements) {
      const currentTextEdits = element.formatCode(this.server.getAliasHelper());
      textEdits.push(...currentTextEdits);
    }

    return textEdits;
  }
}
