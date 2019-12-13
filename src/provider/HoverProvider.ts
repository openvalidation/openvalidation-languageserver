import {
  Hover,
  MarkupContent,
  MarkupKind,
  TextDocumentPositionParams
} from "vscode-languageserver";
import { GenericNode } from "../data-model/syntax-tree/GenericNode";
import { HoverContent } from "../helper/HoverContent";
import { TreeTraversal } from "../helper/TreeTraversal";
import { OvServer } from "../OvServer";
import { Provider } from "./Provider";

/**
 * Response-Provider for ``onHover``
 *
 * @export
 * @class HoverProvider
 * @extends {Provider}
 */
export class HoverProvider extends Provider {
  /**
   * Creates the provider and binds the server to it.
   *
   * @static
   * @param {OvServer} server server we want to bind the provider to
   * @returns {HoverProvider} created provider
   * @memberof HoverProvider
   */
  public static bind(server: OvServer): HoverProvider {
    return new HoverProvider(server);
  }

  /**
   * Creates an instance of HoverProvider.
   * @param {OvServer} server server we want to connect to
   * @memberof HoverProvider
   */
  constructor(server: OvServer) {
    super(server);
    this.connection.onHover(params => this.hover(params));
  }

  /**
   * Provides the documentation of a position that needs to be shown on hover
   *
   * @private
   * @param {TextDocumentPositionParams} params parameter that defines the document and the position of the request
   * @returns {(Promise<Hover | null>)} generated documentation or null, if not possible
   * @memberof HoverProvider
   */
  public async hover(
    params: TextDocumentPositionParams
  ): Promise<Hover | null> {
    const ovDocument = this.ovDocuments.get(params.textDocument.uri);
    if (!ovDocument) {
      return Promise.resolve(null);
    }

    const traversal: TreeTraversal = new TreeTraversal();
    const foundNode: GenericNode | null = traversal.traverseTree(
      ovDocument.$elementManager.$elements,
      params.position
    );
    if (!foundNode) {
      return Promise.resolve(null);
    }

    const hoverContent: HoverContent = foundNode.getHoverContent();

    const markdown: MarkupContent = {
      kind: MarkupKind.Markdown,
      value: hoverContent.$content
    };

    return Promise.resolve({
      range: hoverContent.$range.asRange(),
      contents: markdown
    });
  }
}
