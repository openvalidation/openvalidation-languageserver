import { CompletionResponse } from "src/rest-interface/response/CompletionResponse";
import { String } from "typescript-string-operations";
import {
  CompletionItem,
  CompletionParams,
  CompletionTriggerKind,
  Position,
  Range,
  TextDocument
} from "vscode-languageserver";
import { Variable } from "../data-model/syntax-tree/Variable";
import { CompletionKeyEnum } from "../enums/CompletionKeyEnum";
import { StringHelper } from "../helper/StringHelper";
import { OvServer } from "../OvServer";
import { ApiProxy } from "../rest-interface/ApiProxy";
import { CompletionBuilder } from "./code-completion/CompletionBuilder";
import { Provider } from "./Provider";

/**
 * Response-Provider for `onCompletion`
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
  public static bind(server: OvServer): CompletionProvider {
    return new CompletionProvider(server);
  }

  /**
   * Creates an instance of CompletionProvider.
   * @param {OvServer} server server we will connect to
   * @memberof CompletionProvider
   */
  constructor(server: OvServer) {
    super(server);
    this.connection.onCompletion(params => this.completion(params));
  }

  /**
   * Generates a list of completions for the given position and the given trigger
   *
   * @private
   * @param {CompletionParams} params params that specify the position of the request
   * @returns {(Promise<CompletionItem[] | null>)} calculated completion-items or null if not possible
   * @memberof CompletionProvider
   */
  public async completion(
    params: CompletionParams
  ): Promise<CompletionItem[] | null> {
    const document = this.server.documents.get(params.textDocument.uri);
    if (!document) {
      return null;
    }

    return this.completionMethodSwitch(document, params);
  }

  private async completionMethodSwitch(
    document: TextDocument,
    params: CompletionParams
  ): Promise<CompletionItem[] | null> {
    if (
      !params.context ||
      params.context.triggerKind !== CompletionTriggerKind.TriggerCharacter
    ) {
      return this.completionByText(document, params);
    } else {
      if (params.context.triggerCharacter === CompletionKeyEnum.ComplexSchema) {
        return this.completionForSchema(document, params);
      } else if (params.context.triggerCharacter === CompletionKeyEnum.Array) {
        return this.completionForArray(document, params);
      }
    }
    return null;
  }

  /**
   * Generates a completion for a schema-attribute with children.
   * It tries to find children for the word at the current position and returns them
   *
   * @private
   * @param {CompletionParams} params parameter that contains the textdocument and the position
   * @returns {(Promise<CompletionItem[] | null>)} items with the found children, null in case of an error
   * @memberof CompletionProvider
   */
  private async completionForSchema(
    document: TextDocument,
    params: CompletionParams
  ): Promise<CompletionItem[] | null> {
    const line = document.getText(
      Range.create(Position.create(params.position.line, 0), params.position)
    );
    const currentWord = StringHelper.getWordAt(line, params.position.character);
    if (String.IsNullOrWhiteSpace(currentWord)) {
      return null;
    }

    const generator = new CompletionBuilder(
      [],
      this.server.getAliasHelper(),
      this.server.schema
    ).addFittingChildren(currentWord);
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
  private async completionForArray(
    document: TextDocument,
    params: CompletionParams
  ): Promise<CompletionItem[] | null> {
    const line = document.getText(
      Range.create(Position.create(params.position.line, 0), params.position)
    );
    const currentWord = StringHelper.getWordAt(line, params.position.character);
    if (String.IsNullOrWhiteSpace(currentWord)) {
      return null;
    }

    let declarations: Variable[] = [];
    const ovDocument = this.ovDocuments.get(params.textDocument.uri);
    if (!!ovDocument) {
      declarations = ovDocument.$declarations;
    }

    const generator = new CompletionBuilder(
      declarations,
      this.server.getAliasHelper(),
      this.server.schema
    ).addOperandsWithTypeOfGivenOperand(currentWord.replace(",", ""));
    return generator.build();
  }

  /**
   * General code-completion which can be triggered by the shortcut or automatically.
   * Parsed the current element and tries to get completion-state from it
   *
   * @private
   * @param {CompletionParams} params parameter that contains the textdocument and the position
   * @returns {(Promise<CompletionItem[] | null>)} generated completion items, null in case of an error
   * @memberof CompletionProvider
   */
  private async completionByText(
    document: TextDocument,
    params: CompletionParams
  ): Promise<CompletionItem[] | null> {
    const documentText: string[] = document.getText().split("\n");

    const itemTuple = this.extractItem(documentText, params.position);
    if (!itemTuple) return null;

    let parseString: string = itemTuple[0].join("\n");
    if (!String.IsNullOrWhiteSpace(parseString)) {
      parseString += "\n\n";
    }

    let declarations: Variable[] = [];

    const ovDocument = this.ovDocuments.get(params.textDocument.uri);
    if (!!ovDocument) {
      declarations = ovDocument.$declarations;
    }

    const response = await ApiProxy.postCompletionData(
      parseString,
      this.server.restParameter,
      ovDocument
    );

    const relativePosition: Position = Position.create(
      params.position.line - itemTuple[1],
      params.position.character
    );

    return this.completionForParsedElement(
      response,
      declarations,
      relativePosition
    );
  }

  /**
   * Generates completion items for the parsed element
   *
   * @private
   * @param {(CompletionResponse | null)} response response of the text at the current position
   * @param {Variable[]} declarations variables of the current document
   * @param {Position} relativePosition position inside given node.
   *  Because we only parsed that element alone it needs to be relative to it
   * @param {string} wordAtCurrentPosition found word at the position. This is used for filtering of items
   * @returns {(Promise<CompletionItem[] | null>)} generated completion items, null in case of an error
   * @memberof CompletionProvider
   */
  private completionForParsedElement(
    response: CompletionResponse | null,
    declarations: Variable[],
    relativePosition: Position
  ): CompletionItem[] | null {
    if (!response) {
      return CompletionBuilder.default(declarations, this.server);
    }

    const relevantElement = response.$scope;
    if (!relevantElement) {
      return CompletionBuilder.default(declarations, this.server);
    }

    const generator: CompletionBuilder = new CompletionBuilder(
      declarations,
      this.server.getAliasHelper(),
      this.server.schema
    );
    return relevantElement!
      .getCompletionContainer(relativePosition)
      .getCompletions(generator)
      .build();
  }

  /**
   * Finds the item at the position and returns it with it's starting-number
   *
   * @param {string[]} textLines text of the current document
   * @param {Position} position position of the completion-request
   * @returns {[string[], number]} tuple of the lines and the starting number of the element
   * @memberof CompletionProvider
   */
  private extractItem(
    textLines: string[],
    position: Position
  ): [string[], number] | null {
    let startLine: number = -1;
    let currentLines: string[] = [];

    if (position.line >= textLines.length) return [currentLines, startLine];

    // Find previous items
    let foundWhiteSpace: boolean = false;
    for (let index = position.line; index >= 0; index--) {
      const element = textLines[index];
      if (String.IsNullOrWhiteSpace(element)) {
        // Then the current Whitespace belongs to the element
        if (
          !foundWhiteSpace &&
          index > 0 &&
          String.IsNullOrWhiteSpace(textLines[index - 1])
        ) {
          foundWhiteSpace = true;
        } else {
          break;
        }
      }
      startLine = index;
      currentLines.push(textLines[index]);
    }

    // Then we wanted completion inside an paragraph
    if (currentLines.length == 0 && position.line != 0) {
      return null;
    }

    // To get the correct order
    currentLines.reverse();

    // Find items after it
    for (let index = position.line + 1; index < textLines.length; index++) {
      const element = textLines[index];
      if (String.IsNullOrWhiteSpace(element)) break;

      currentLines.push(textLines[index]);
    }

    return [currentLines, startLine];
  }
}
