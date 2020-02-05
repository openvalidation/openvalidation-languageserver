import {
  DocumentSymbolParams,
  SymbolInformation,
  SymbolKind,
  WorkspaceSymbolParams
} from "vscode-languageserver";
import { Location } from "vscode-languageserver";
import { OvServer } from "../OvServer";
import { Provider } from "./Provider";
import { OvDocument } from "src/data-model/ov-document/OvDocument";
import { VariableNameNode } from "src/data-model/syntax-tree/element/VariableNameNode";

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
    this.connection.onWorkspaceSymbol(params =>
      this.findWorkspaceSymbols(params)
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

    return this.getSymbolInformation(ovDocument);
  }

  public findWorkspaceSymbols(
    params: WorkspaceSymbolParams
  ): SymbolInformation[] {
    const relevantDocuments: OvDocument[] = this.server.ovDocuments.all();
    const symbolsPerDocument: SymbolInformation[][] = relevantDocuments.map(
      document => this.getSymbolInformation(document, params.query)
    );
    return symbolsPerDocument.reduce((prev, curr) => prev.concat(curr));
  }

  private getSymbolInformation(ovDocument: OvDocument, query?: string) {
    const symbolInformationList: SymbolInformation[] = [];

    ovDocument.$elementManager.getVariables().forEach(variable => {
      const variableNameRange = variable.getRangeOfVariableName();
      if (this.noQuerySetOrNameMatchesQuery(variable.$nameNode, query)) {
        const symbolInformation: SymbolInformation = {
          name: variable.$nameNode!.$name,
          kind: SymbolKind.Variable,
          location: Location.create(ovDocument.$documentUri, variableNameRange)
        };
        symbolInformationList.push(symbolInformation);
      }
    });

    // Symbol for navigation to schema
    const useSchemaNode = ovDocument.$elementManager.getUseSchemaNode();
    if (useSchemaNode != null) {
      const symbolInformation: SymbolInformation = {
        name: "Schema",
        kind: SymbolKind.File,
        location: useSchemaNode.location
      };
      symbolInformationList.push(symbolInformation);
    }

    return symbolInformationList;
  }

  private noQuerySetOrNameMatchesQuery(
    nameNode: VariableNameNode | null,
    query?: string
  ): boolean {
    if (!nameNode) return false;

    return (
      !query || nameNode.$name.toLowerCase().indexOf(query.toLowerCase()) != -1
    );
  }
}
