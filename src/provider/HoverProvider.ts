import { HoverContent } from "src/helper/HoverContent";
import { GenericNode } from "src/data-model/syntax-tree/GenericNode";
import { Hover, MarkupContent, MarkupKind, TextDocumentPositionParams } from "vscode-languageserver";
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
    static bind(server: OvServer): HoverProvider {
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
    public async hover(params: TextDocumentPositionParams): Promise<Hover | null> {
        var ovDocument = this.ovDocuments.get(params.textDocument.uri);
        if (!ovDocument) return Promise.resolve(null);

        var traversal: TreeTraversal = new TreeTraversal();
        var foundNode: GenericNode | null = traversal.traverseTree(ovDocument.$elementManager.$elements, params.position);
        if (!foundNode) return Promise.resolve(null);

        var hoverContent: HoverContent | null = foundNode.getHoverContent();
        if (!hoverContent) return Promise.resolve(null);

        let markdown: MarkupContent = {
            kind: MarkupKind.Markdown,
            value: hoverContent.getContent()
        };

        return Promise.resolve({
            range: hoverContent.getRange().asRange(),
            contents: markdown
        });
    }
}