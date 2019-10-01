import { HoverContent } from "src/helper/HoverContent";
import { GenericNode } from "src/data-model/syntax-tree/GenericNode";
import { Hover, MarkupContent, MarkupKind, TextDocumentPositionParams } from "vscode-languageserver";
import { TreeTraversal } from "../helper/TreeTraversal";
import { OvServer } from "../OvServer";
import { Provider } from "./Provider";

/**
 * Response-Provider for "onHover"
 *
 * @export
 * @class HoverProvider
 * @extends {Provider}
 */
export class HoverProvider extends Provider {
    static bind(server: OvServer) {
        return new HoverProvider(server);
    }

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

        var hover: Hover = {
            range: hoverContent.getRange().asRange(),
            contents: markdown
        };

        return Promise.resolve(hover);
    }
}