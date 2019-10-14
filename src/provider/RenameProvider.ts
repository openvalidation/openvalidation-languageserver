import {
  Position,
  RenameParams,
  TextEdit,
  WorkspaceEdit
} from "vscode-languageserver";
import { Range } from "vscode-languageserver-types";
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
  public static bind(server: OvServer): RenameProvider {
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
    const ovDocument = this.ovDocuments.get(params.textDocument.uri);
    if (!ovDocument) {
      return {};
    }

    const oldTuple = ovDocument.getStringByPosition(params.position);
    if (!oldTuple) {
      return {};
    }

    const oldString: string = oldTuple[0];

    // Renaming only makes sense for variables
    const variable = ovDocument.$elementManager.getVariablesByName(oldString);
    if (!variable) {
      return {};
    }

    const textEdits: TextEdit[] = [];

    for (const element of ovDocument.$elementManager.$elements) {
      const range = element.$range;
      if (!range || !range.$start) {
        continue;
      }

      let lineNumber = range.$start.$line;

      for (const line of element.$lines) {
        const matches = line.match(new RegExp(oldString));
        lineNumber++;
        if (!matches) {
          continue;
        }

        matches.forEach(match => {
          const startIndex = line.indexOf(match);
          const endIndex = startIndex + match.length;

          textEdits.push({
            newText: params.newName,
            range: Range.create(
              Position.create(lineNumber - 1, startIndex),
              Position.create(lineNumber - 1, endIndex)
            )
          });
        });
      }
    }
    return { changes: { [params.textDocument.uri]: textEdits } };
  }
}
