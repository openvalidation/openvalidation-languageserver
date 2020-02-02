import {
  DocumentSymbolParams,
  SymbolInformation,
  SymbolKind,
  Range
} from "vscode-languageserver";
import { Location } from "vscode-languageserver";
import { OvServer } from "../OvServer";
import { Provider } from "./Provider";
import { UseSchemaNode } from "../data-model/syntax-tree/UseSchemaNode";

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
  public static bind(server: OvServer): DocumentSymbolProvider {
    return new DocumentSymbolProvider(server);
  }

  /**
   * Creates an instance of DocumentSymbolProvider.
   * @param {OvServer} server server we want to connect to
   * @memberof DocumentSymbolProvider
   */
  constructor(server: OvServer) {
    super(server);
    this.connection.onDocumentSymbol(params =>
      this.findDocumentSymbols(params)
    );
  }

  /**
   * Generates symbol-information for every variable (and operator) to find a specific
   * variable in the editor
   *
   * @param {DocumentSymbolParams} params parameter that defines the specific document
   * @returns {SymbolInformation[]}
   * @memberof DocumentSymbolProvider
   */
  public findDocumentSymbols(
    params: DocumentSymbolParams
  ): SymbolInformation[] {
    const ovDocument = this.ovDocuments.get(params.textDocument.uri);
    if (!ovDocument) {
      return [];
    }

    const symbolInformationList: SymbolInformation[] = [];

    ovDocument.$elementManager.getVariables().forEach(variable => {
      const variableNameRange = variable.getRangeOfVariableName();
      if (!!variable.$nameNode) {
        const symbolInformation: SymbolInformation = {
          name: variable.$nameNode.$name,
          kind: SymbolKind.Variable,
          location: Location.create(params.textDocument.uri, variableNameRange)
        };
        symbolInformationList.push(symbolInformation);
      }
    });

    // Symbol for navigation to schema
    if (ovDocument.$elementManager.$elements[0] instanceof UseSchemaNode) {
      const useSchemaNode: UseSchemaNode = ovDocument.$elementManager
        .$elements[0] as UseSchemaNode;
      const symbolInformation: SymbolInformation = {
        name: "Schema",
        kind: SymbolKind.File,
        location: Location.create(
          useSchemaNode.filePath,
          Range.create(0, 0, 0, 0)
        )
      };
      symbolInformationList.push(symbolInformation);
    }

    return symbolInformationList;
  }
}
