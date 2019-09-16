import { String } from "typescript-string-operations";
import { CompletionItem, CompletionParams, CompletionTriggerKind, Position, Range } from "vscode-languageserver";
import { CompletionKey } from "../Constants";
import { StringHelper } from "../helper/StringHelper";
import { OvServer } from "../OvServer";
import { ApiProxy } from "../rest-interface/ApiProxy";
import { Variable } from "../rest-interface/intelliSenseTree/Variable";
import { CompletionGenerator } from "./code-completion/CompletionGenerator";
import { Provider } from "./Provider";

/*
 * Response-Provider for "onCompletion"
 *
 * @export
 * @class CompletionProvider
 * @extends {Provider}
 */
export class CompletionProvider extends Provider {
    static bind(server: OvServer) {
        return new CompletionProvider(server);
    }

    constructor(server: OvServer) {
        super(server);
        this.connection.onCompletionResolve(params => this.completionResolve(params));
        this.connection.onCompletion(params => this.completion(params));
    }

    /**
     * Can Provide further documentation for a specific completion-item
     *
     * @private
     * @param {CompletionItem} params completion item to comment
     * @returns {CompletionItem} documented completion
     * @memberof CompletionProvider
     */
    public completionResolve(params: CompletionItem): CompletionItem {
        //TODO: More documentation
        return params;
    }

    /**
     * Generates a list of completions for the given position
     *
     * @private
     * @param {CompletionParams} params params that specify the position of the request
     * @returns {(Promise<CompletionList | null>)} calculated completion-items
     * @memberof CompletionProvider
     */
    public async completion(params: CompletionParams): Promise<CompletionItem[] | null> {
        var document = this.server.documents.get(params.textDocument.uri);
        if (!document) return [];

        if (!params.context || params.context.triggerKind != CompletionTriggerKind.TriggerCharacter) {
            return this.completionByText(document.getText(), params);
        }
        else {
            if (params.context.triggerCharacter == CompletionKey.ComplexSchema) {
                return this.completionForSchema(params);
            } else if (params.context.triggerCharacter == CompletionKey.Array) {
                return this.completionForArray(params);
            }
        }
        return null;
    }

    private async completionForSchema(params: CompletionParams): Promise<CompletionItem[] | null> {
        var document = this.server.documents.get(params.textDocument.uri);
        if (document) {
            var line = document.getText(Range.create(Position.create(params.position.line, 0), params.position));
            var currentWord = StringHelper.getWordAt(line, params.position.character);
            if (String.IsNullOrWhiteSpace(currentWord)) return null;

            var generator = new CompletionGenerator([], this.server.aliasHelper, this.server.schema, null).addFittingChilds(currentWord);
            return generator.build();
        }
        return null;
    }

    private async completionForArray(params: CompletionParams): Promise<CompletionItem[] | null> {
        var document = this.server.documents.get(params.textDocument.uri);
        if (document) {
            var line = document.getText(Range.create(Position.create(params.position.line, 0), params.position));
            var currentWord = StringHelper.getWordAt(line, params.position.character);
            if (String.IsNullOrWhiteSpace(currentWord)) return null;

            var generator = new CompletionGenerator([], this.server.aliasHelper, this.server.schema, null)
                .addOperandsWithTypeOfGivenOperand(currentWord.replace(',', ''));
            return generator.build();
        }
        return null;
    }

    private async completionByText(text: string, params: CompletionParams): Promise<CompletionItem[] | null> {
        var documentText: string[] = text.split("\n");
        var itemTuple = this.extractItem(documentText, params);

        var parseString: string = itemTuple[0].join("\n");
        if (!String.IsNullOrWhiteSpace(parseString)) parseString += "\n\n";

        var declarations: Variable[] = [];

        var ovDocument = this.ovDocuments.get(params.textDocument.uri);
        if (!!ovDocument) {
            declarations = ovDocument.declarations;
        }

        var parsedElement = await ApiProxy.postCompletionData(parseString, this.server.restParameter, ovDocument);
        if (!parsedElement || !parsedElement.getScope())
            return CompletionGenerator.default(declarations, this.server);

        var relevantElement = parsedElement.getScope();
        return relevantElement!.getCompletionContainer().getCompletions(declarations, this.server.aliasHelper, this.server.schema).build();
    }

    public extractItem(text: string[], params: CompletionParams): [string[], number] {
        var startLine: number = -1;
        var currentLines: string[] = [];
        var foundIndex: boolean = false;

        for (let index = 0; index < text.length; index++) {
            const element = text[index];

            if (index == params.position.line) {
                foundIndex = true;
            }

            if (!String.IsNullOrWhiteSpace(element)) {
                currentLines.push(element);

                if (startLine == -1) {
                    startLine = index;
                }
            }
            else if (!foundIndex) {
                currentLines = [];
                startLine = -1;
            } else {
                break;
            }
        }

        return [currentLines, startLine];
    }
}
