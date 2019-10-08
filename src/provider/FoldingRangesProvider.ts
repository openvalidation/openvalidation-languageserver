import { String } from 'typescript-string-operations';
import { FoldingRange, FoldingRangeKind, FoldingRangeRequestParam } from 'vscode-languageserver';
import { OvServer } from '../OvServer';
import { Provider } from './Provider';

/**
 * Response-Provider for ``onFoldingRanges``
 *
 * @export
 * @class FoldingRangesProvider
 * @extends {Provider}
 */
export class FoldingRangesProvider extends Provider {

    /**
     * Creates the provider and binds the server to it.
     *
     * @static
     * @param {OvServer} server server we want to bind the provider to
     * @returns {FoldingRangesProvider} created provider
     * @memberof FoldingRangesProvider
     */
    public static bind(server: OvServer): FoldingRangesProvider {
        return new FoldingRangesProvider(server);
    }

    /**
     * Creates an instance of FoldingRangesProvider.
     * @param {OvServer} server server we want to connect to
     * @memberof FoldingRangesProvider
     */
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
        const document = this.server.documents.get(params.textDocument.uri);
        if (!document) {
            return [];
        }

        return this.getFoldingRangesByText(document.getText());
    }

    public getFoldingRangesByText(text: string): FoldingRange[] {
        const documentText: string[] = text.split('\n');
        let currentLine: number = 0;
        let startLine: number = -1;

        const foldingRanges: FoldingRange[] = [];

        for (const line of documentText) {
            if (String.IsNullOrWhiteSpace(line) && startLine !== -1) {
                const foldingRange = FoldingRange.create(startLine, currentLine - 1);
                foldingRange.kind = FoldingRangeKind.Region;
                startLine = -1;
                foldingRanges.push(foldingRange);
            } else if (!String.IsNullOrWhiteSpace(line) && startLine === -1) {
                startLine = currentLine;
            }

            currentLine++;
        }

        return foldingRanges;
    }
}
