import { DefinitionLink, TextDocumentPositionParams } from "vscode-languageserver";
import { Definition, Location } from "vscode-languageserver-types";
import { OvServer } from "../OvServer";
import { VariableNode } from "../data-model/syntax-tree/element/VariableNode";
import { Provider } from "./Provider";

/**
 * Response-Provider for "onDefinition"
 *
 * @export
 * @class GotoDefinitionProvider
 * @extends {Provider}
 */
export class GotoDefinitionProvider extends Provider {
    static bind(server: OvServer) {
        return new GotoDefinitionProvider(server);
    }

    constructor(server: OvServer) {
        super(server);
        this.connection.onDefinition(params => this.definition(params));
    }

    // TODO: Change to DefinitionLink, support must added to the monaco-client
    /**
     * Generates a list of all found definitions for a string at a given position
     *
     * @private
     * @param {TextDocumentPositionParams} params parameter that defines the document and the position of the request
     * @returns {(Definition | DefinitionLink[])} list of all found definitions
     * @memberof GotoDefinitionProvider
     */
    public definition(params: TextDocumentPositionParams): DefinitionLink[] | Definition {
        var ovDocument = this.ovDocuments.get(params.textDocument.uri);
        if (!ovDocument) return [];

        var referenceTuple = ovDocument.getStringByPosition(params.position);
        if (!referenceTuple) return [];

        var referenceString: string = referenceTuple[0];
        // var referenceRange: Range = referenceTuple[1];

        var foundVariables = ovDocument.elementManager.getVariablesByName(referenceString);
        if (!foundVariables || foundVariables.length == 0) return [];

        var locationList: Location[] = [];

        foundVariables.forEach((variable: VariableNode) => {
            var range = variable.getRange().asRange();
            var location = Location.create(params.textDocument.uri, range);
            locationList.push(location);
        });

        return locationList;
    }
}