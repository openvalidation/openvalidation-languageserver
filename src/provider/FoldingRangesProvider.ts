import { String } from "typescript-string-operations";
import { FoldingRange, FoldingRangeKind, FoldingRangeRequestParam } from "vscode-languageserver";
import { OvServer } from "../OvServer";
import { Provider } from "./Provider";

/**
 * Response-Provider for ``onFoldingRanges``
 *
 * @export
 * @class FoldingRangesProvider
 * @extends {Provider}
 */
export class FoldingRangesProvider extends Provider {
    static bind(server: OvServer) {
        return new FoldingRangesProvider(server);
    }

    constructor(server: OvServer) {
        super(server);
        this.connection.onFoldingRanges(params => this.getFoldingRanges(params));
    }

    /**
     * Generates a list of all foldable sections.
     * This is done with the raw text and not with the syntax-tree to be more performant.
     * 
     * @param {FoldingRangeRequestParam} params parameter that defines the specific document
     * @returns {FoldingRange[]} list of a range of all foldable-sections
     * @memberof FoldingRangesProvider
     */
    public getFoldingRanges(params: FoldingRangeRequestParam): FoldingRange[] {
        var document = this.server.documents.get(params.textDocument.uri);
        if (!document)
            return [];

        var documentText: string[] = document.getText().split("\n");
        var currentLine: number = 0;
        var startLine: number = -1;

        var foldingRanges: FoldingRange[] = [];

        for (const line of documentText) {
            if (String.IsNullOrWhiteSpace(line) && startLine != -1) {
                var foldingRange = FoldingRange.create(startLine, currentLine - 1);
                foldingRange.kind = FoldingRangeKind.Region;
                startLine = -1;
                foldingRanges.push(foldingRange);
            } else if (!String.IsNullOrWhiteSpace(line) && startLine == -1) {
                startLine = currentLine;
            }

            currentLine++;
        }

        return foldingRanges;
    }
}