import { DocumentSymbolParams, SymbolInformation, SymbolKind } from "vscode-languageserver";
import { Location } from "vscode-languageserver-types";
import { OvServer } from "../OvServer";
import { Provider } from "./Provider";

/**
 * Response-Provider for ``onDocumentSymbol``
 *
 * @export
 * @class DocumentSymbolProvider
 * @extends {Provider}
 */
export class DocumentSymbolProvider extends Provider {

    /**
     * Creates the provider and binds the server to it.
     *
     * @static
     * @param {OvServer} server server we want to bind the provider to
     * @returns {DocumentSymbolProvider} created provider
     * @memberof DocumentSymbolProvider
     */
    static bind(server: OvServer): DocumentSymbolProvider {
        return new DocumentSymbolProvider(server);
    }

    /**
     * Creates an instance of DocumentSymbolProvider.
     * @param {OvServer} server server we want to connect to
     * @memberof DocumentSymbolProvider 
     */
    constructor(server: OvServer) {
        super(server);
        this.connection.onDocumentSymbol(params => this.findDocumentSymbols(params));
    }

    /**
     * Generates symbol-informations for every variable (and operator) to find a specific
     * variable in the editor
     *
     * @param {DocumentSymbolParams} params parameter that defines the specific document
     * @returns {SymbolInformation[]}
     * @memberof DocumentSymbolProvider
     */
    public findDocumentSymbols(params: DocumentSymbolParams): SymbolInformation[] {
        var ovDocument = this.ovDocuments.get(params.textDocument.uri);
        if (!ovDocument) return [];

        var symbolInformationList: SymbolInformation[] = [];

        ovDocument.$elementManager.getVariables().forEach(variable => {
            var variableNameRange = variable.getRangeOfVariableName();
            var symbolInformation: SymbolInformation = {
                name: variable.getNameNode()!.getName(),
                kind: SymbolKind.Variable,
                location: Location.create(params.textDocument.uri, variableNameRange)
            }
            symbolInformationList.push(symbolInformation);
        });

        return symbolInformationList;
    }
}