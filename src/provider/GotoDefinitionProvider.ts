import {
  DefinitionLink,
  TextDocumentPositionParams,
  LocationLink,
  Range
} from "vscode-languageserver";
import { VariableNode } from "../data-model/syntax-tree/element/VariableNode";
import { OvServer } from "../OvServer";
import { Provider } from "./Provider";

/**
 * Response-Provider for ``onDefinition``
 *
 * @export
 * @class GotoDefinitionProvider
 * @extends {Provider}
 */
export class GotoDefinitionProvider extends Provider {
  /**
   * Creates the provider and binds the server to it.
   *
   * @static
   * @param {OvServer} server server we want to bind the provider to
   * @returns {GotoDefinitionProvider} created provider
   * @memberof GotoDefinitionProvider
   */
  public static bind(server: OvServer): GotoDefinitionProvider {
    return new GotoDefinitionProvider(server);
  }

  /**
   * Creates an instance of GotoDefinitionProvider.
   * @param {OvServer} server server we want to connect to
   * @memberof GotoDefinitionProvider
   */
  constructor(server: OvServer) {
    super(server);
    this.connection.onDefinition(params => this.definition(params));
  }

  /**
   * Generates a list of all found definitions for a string at a given position
   *
   * @private
   * @param {TextDocumentPositionParams} params parameter that defines the document and the position of the request
   * @returns {(DefinitionLink[] | Definition)} list of all found definitions
   * @memberof GotoDefinitionProvider
   */
  public definition(params: TextDocumentPositionParams): DefinitionLink[] {
    const ovDocument = this.ovDocuments.get(params.textDocument.uri);
    if (!ovDocument) {
      return [];
    }

    const useSchemaNode = ovDocument.$elementManager.getUseSchemaNode();
    if (useSchemaNode != null) {
      const navigationRange = Range.create(0, 0, 0, 0);
      const schemaRange = useSchemaNode.$range.asRange();
      const location = LocationLink.create(
        useSchemaNode.filePath,
        navigationRange,
        navigationRange,
        schemaRange
      );
      return [location];
    }

    const referenceTuple = ovDocument.getStringByPosition(params.position);
    if (!referenceTuple) {
      return [];
    }

    const referenceString: string = referenceTuple[0];
    const referenceRange: Range = referenceTuple[1];

    const foundVariables = ovDocument.$elementManager.getVariablesByName(
      referenceString
    );
    if (!foundVariables || foundVariables.length === 0) {
      return [];
    }

    const locationList: LocationLink[] = [];

    foundVariables.forEach((variable: VariableNode) => {
      const range = variable.$range.asRange();
      const nameRange = !variable.$nameNode
        ? range
        : variable.$nameNode.$range.asRange();
      const location = LocationLink.create(
        params.textDocument.uri,
        nameRange,
        range,
        referenceRange
      );
      locationList.push(location);
    });

    return locationList;
  }
}
