import { Position, RenameParams, TextEdit, WorkspaceEdit } from "vscode-languageserver";
import { Range } from 'vscode-languageserver-types';
import { OvServer } from "../OvServer";
import { Provider } from "./Provider";

/**
 * Response-Provider for ``onRenameRequest``
 *
 * @export
 * @class RenameProvider
 * @extends {Provider}
 */
export class RenameProvider extends Provider {

    /**
     * Creates the provider and binds the server to it.
     *
     * @static
     * @param {OvServer} server server we want to bind the provider to
     * @returns {RenameProvider} created provider
     * @memberof RenameProvider
     */
    static bind(server: OvServer): RenameProvider {
        return new RenameProvider(server);
    }

    /**
     * Creates an instance of RenameProvider.
     * @param {OvServer} server server we will connect to
     * @memberof RenameProvider
     */
    constructor(server: OvServer) {
        super(server);
        this.connection.onRenameRequest(params => this.rename(params));
    }

    /**
     * Generates the needed changes when a word at the defined position should be renamed in the whole document
     *
     * @param {RenameParams} params parameter that defines the document, the position of the request and the new name
     * @returns {WorkspaceEdit} the edit that needs to be done for the rename-operation
     * @memberof RenameProvider
     */
    public rename(params: RenameParams): WorkspaceEdit {
        var ovDocument = this.ovDocuments.get(params.textDocument.uri);
        if (!ovDocument) return {};

        var oldTuple = ovDocument.getStringByPosition(params.position);
        if (!oldTuple) return {};

        var oldString: string = oldTuple[0];

        // Renaming only makes sense for variables
        var variable = ovDocument.$elementManager.getVariablesByName(oldString);
        if (!variable) return {};

        var textEdits: TextEdit[] = [];

        for (const element of ovDocument.$elementManager.$elements) {
            var range = element.$range;
            if (!range) continue;

            var lineNumber = range.$start.$line;

            for (const line of element.$lines) {
                var matches = line.match(new RegExp(oldString));
                lineNumber++;
                if (!matches) continue;

                matches.forEach(match => {
                    var startIndex = line.indexOf(match);
                    var endIndex = startIndex + match.length;

                    textEdits.push({
                        newText: params.newName,
                        range: Range.create(Position.create(lineNumber - 1, startIndex), Position.create(lineNumber - 1, endIndex))
                    });
                });
            }
        }
        return { changes: { [params.textDocument.uri]: textEdits }};
    }
}