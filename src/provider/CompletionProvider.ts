import { String } from "typescript-string-operations";
import { CompletionItem, CompletionParams, CompletionTriggerKind, Position, Range, TextDocument } from "vscode-languageserver";
import { CompletionKeyEnum } from "../enums/CompletionKeyEnum";
import { StringHelper } from "../helper/StringHelper";
import { OvServer } from "../OvServer";
import { ApiProxy } from "../rest-interface/ApiProxy";
import { Variable } from "../data-model/syntax-tree/Variable";
import { CompletionBuilder } from "./code-completion/CompletionBuilder";
import { Provider } from "./Provider";
import { CompletionResponse } from "src/rest-interface/response/CompletionResponse";

/**
 * Response-Provider for `onCompletion` and `onCompletionResolve`
 *
 * @export
 * @class CompletionProvider
 * @extends {Provider}
 */
export class CompletionProvider extends Provider {

    /**
     * Creates the provider and binds the server to it.
     *
     * @static
     * @param {OvServer} server server we want to bind the provider to
     * @returns {CompletionProvider} created provider
     * @memberof CompletionProvider
     */
    static bind(server: OvServer): CompletionProvider {
        return new CompletionProvider(server);
    }

    /**
     * Creates an instance of CompletionProvider.
     * @param {OvServer} server server we will connect to
     * @memberof CompletionProvider
     */
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
     * @returns {CompletionItem} documented completion-item
     * @memberof CompletionProvider
     */
    public completionResolve(params: CompletionItem): CompletionItem {
        //TODO: More documentation
        return params;
    }

    /**
     * Generates a list of completions for the given position and the given trigger
     *
     * @private
     * @param {CompletionParams} params params that specify the position of the request
     * @returns {(Promise<CompletionItem[] | null>)} calculated completion-items or null if not possible
     * @memberof CompletionProvider
     */
    public async completion(params: CompletionParams): Promise<CompletionItem[] | null> {
        var document = this.server.documents.get(params.textDocument.uri);
        if (!document) return null;

        return this.completionMethodSwitch(document, params)
    }

    private async completionMethodSwitch(document: TextDocument, params: CompletionParams): Promise<CompletionItem[] | null> {
        if (!params.context || params.context.triggerKind != CompletionTriggerKind.TriggerCharacter) {
            return this.completionByText(document, params);
        }
        else {
            if (params.context.triggerCharacter == CompletionKeyEnum.ComplexSchema) {
                return this.completionForSchema(document, params);
            } else if (params.context.triggerCharacter == CompletionKeyEnum.Array) {
                return this.completionForArray(document, params);
            }
        }
        return null;
    }

    /**
     * Generates a completion for a schema-attribute with childs.
     * It tries to find childs for the word at the current position and returns them
     *
     * @private
     * @param {CompletionParams} params parameter that contains the textdocument and the position
     * @returns {(Promise<CompletionItem[] | null>)} items with the found childs, null in case of an error
     * @memberof CompletionProvider
     */
    private async completionForSchema(document: TextDocument, params: CompletionParams): Promise<CompletionItem[] | null> {
        var line = document.getText(Range.create(Position.create(params.position.line, 0), params.position));
        var currentWord = StringHelper.getWordAt(line, params.position.character);
        if (String.IsNullOrWhiteSpace(currentWord)) return null;

        var generator = new CompletionBuilder([], this.server.aliasHelper, this.server.schema).addFittingChilds(currentWord);
        return generator.build();
    }

    /**
     * Generates completion for an array-expression.
     * It returns an item for every variable or schema-attribute that has the same datatype than the current expression
     *
     * @private
     * @param {CompletionParams} params parameter that contains the textdocument and the position
     * @returns {(Promise<CompletionItem[] | null>)} items that has been found, null in case of an error
     * @memberof CompletionProvider
     */
    private async completionForArray(document: TextDocument, params: CompletionParams): Promise<CompletionItem[] | null> {
        var line = document.getText(Range.create(Position.create(params.position.line, 0), params.position));
        var currentWord = StringHelper.getWordAt(line, params.position.character);
        if (String.IsNullOrWhiteSpace(currentWord)) return null;

        var declarations: Variable[] = [];
        var ovDocument = this.ovDocuments.get(params.textDocument.uri);
        if (!!ovDocument) {
            declarations = ovDocument.$declarations;
        }

        var generator = new CompletionBuilder(declarations, this.server.aliasHelper, this.server.schema)
            .addOperandsWithTypeOfGivenOperand(currentWord.replace(',', ''));
        return generator.build();
    }

    /**
     * General code-completion which can be triggered by the shortcut or automatically.
     * Parsed the current element and tries to get completion-state from it
     *
     * @private
     * @param {CompletionParams} params parameter that contains the textdocument and the position
     * @returns {(Promise<CompletionItem[] | null>)} generated completionitems, null in case of an error
     * @memberof CompletionProvider
     */
    private async completionByText(document: TextDocument, params: CompletionParams): Promise<CompletionItem[] | null> {
        var documentText: string[] = document.getText().split("\n");
        var itemTuple = this.extractItem(documentText, params.position);

        var parseString: string = itemTuple[0].join("\n");
        if (!String.IsNullOrWhiteSpace(parseString)) parseString += "\n\n";

        var declarations: Variable[] = [];

        var ovDocument = this.ovDocuments.get(params.textDocument.uri);
        if (!!ovDocument) {
            declarations = ovDocument.$declarations;
        }

        var response = await ApiProxy.postCompletionData(parseString, this.server.restParameter, ovDocument);
        var relativePosition: Position = Position.create(params.position.line - itemTuple[1], params.position.character);

        var line = document.getText(Range.create(Position.create(params.position.line, 0), params.position));
        var wordAtCurrentPosition = StringHelper.getWordAt(line, params.position.character).trim();
        return this.completionForParsedElement(response, declarations, relativePosition, wordAtCurrentPosition);
    }

    /**
     * Generates completion items for the parsed element
     *
     * @private
     * @param {(CompletionResponse | null)} response response of the text at the current position
     * @param {Variable[]} declarations variables of the current document
     * @param {Position} relativePosition position inside given node. Because we only parsed that element alone it needs to be relative to it
     * @param {string} wordAtCurrentPosition found word at the position. This is used for filtering of items
     * @returns {(Promise<CompletionItem[] | null>)} generated completionitems, null in case of an error
     * @memberof CompletionProvider
     */
    private completionForParsedElement(response: CompletionResponse | null, declarations: Variable[], relativePosition: Position, wordAtCurrentPosition: string): CompletionItem[] | null {
        if (!response)
            return CompletionBuilder.default(declarations, this.server);

        var relevantElement = response.$scope;
        if (!relevantElement)
            return CompletionBuilder.default(declarations, this.server);

        var generator: CompletionBuilder = new CompletionBuilder(declarations, this.server.aliasHelper, this.server.schema, wordAtCurrentPosition);
        return relevantElement!.getCompletionContainer(relativePosition).getCompletions(generator).build();
    }

    /**
     * Finds the item at the position and returns it with it's starting-number
     *
     * @param {string[]} text text of the current document
     * @param {Position} position position of the completion-request
     * @returns {[string[], number]} tuple of the lines and the starting number of the element
     * @memberof CompletionProvider
     */
    private extractItem(text: string[], position: Position): [string[], number] {
        var startLine: number = -1;
        var currentLines: string[] = [];
        var foundIndex: boolean = false;

        for (let index = 0; index < text.length; index++) {
            const element = text[index];
            if (index == position.line)
                foundIndex = true;

            if (!String.IsNullOrWhiteSpace(element)) {
                currentLines.push(element);

                if (startLine == -1)
                    startLine = index;
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
