import { NotificationEnum } from "ov-language-server-types";
import { Diagnostic, DiagnosticSeverity, Range, TextDocument, TextDocumentChangeEvent } from "vscode-languageserver";
import { URI } from "vscode-uri";
import { OvDocument } from "../data-model/ov-document/OvDocument";
import { UseSchemaNode } from "../data-model/syntax-tree/UseSchemaNode";
import { SchemaProvider } from "../helper/SchemaProvider";
import { UseSchemaDataclass } from "../helper/UseSchemaDataclass";
import { OvServer } from "../OvServer";
import { ApiProxy } from "../rest-interface/ApiProxy";
import { ICodeResponse } from "../rest-interface/response/ICodeResponse";
import { LintingResponse } from "../rest-interface/response/LintingResponse";
import { Provider } from "./Provider";
import { SyntaxNotifier } from "./SyntaxNotifier";

/**
 * Provider to handle every response which deals with documents.
 * In addition, it handles the `onDidOpen`, `onDidChangeContent` and `onDidClose` requests
 *
 * @export
 * @class DocumentActionProvider
 * @extends {Provider}
 */
export class DocumentActionProvider extends Provider {
  /**
   * Creates the provider and binds the server to it.
   *
   * @static
   * @param {OvServer} server server we want to bind the provider to
   * @returns {DocumentActionProvider}
   * @memberof DocumentActionProvider
   */
  public static bind(server: OvServer): DocumentActionProvider {
    return new DocumentActionProvider(server);
  }

  private readonly pendingValidationRequests: Map<string, number>;
  private readonly syntaxNotifier: SyntaxNotifier;

  /**
   * Creates an instance of DocumentActionProvider.
   * @param {OvServer} server server we will connect to
   * @memberof DocumentActionProvider
   */
  constructor(server: OvServer) {
    super(server);
    this.pendingValidationRequests = new Map<string, number>();
    this.syntaxNotifier = new SyntaxNotifier(server);

    this.server.documents.onDidOpen(event => this.validate(event.document.uri));
    this.server.documents.onDidChangeContent(event =>
      this.validate(event.document.uri)
    );
    this.server.documents.onDidClose(event => this.close(event));
  }

  /**
   * Cleans current validation and starts a new validation-process
   *
   * @param {string} uri  parameter that holds the uri to the document
   * @memberof DocumentActionProvider
   */
  public validate(uri: string): void {
    this.cleanPendingValidation(uri);
    this.pendingValidationRequests.set(
      uri,
      setTimeout(() => {
        this.pendingValidationRequests.delete(uri);
        this.validateDocumentWithUri(uri);
      })
    );
  }

  /**
   * Cleans the diagnostics for the given file
   *
   * @param {TextDocumentChangeEvent} event parameter that defines the specific document
   * @memberof DocumentActionProvider
   */
  public close(event: TextDocumentChangeEvent) {
    this.cleanPendingValidation(event.document.uri);
    this.cleanDiagnostics(event.document);
  }

  /**
   * Deletes the diagnostics completely
   *
   * @private
   * @param {TextDocument} document document for which the diagnostics should be deleted
   * @memberof DocumentActionProvider
   */
  public cleanDiagnostics(document: TextDocument | undefined): void {
    if (!!document) {
      this.sendDiagnostics(document.uri, []);
    }
  }

  /**
   * Cancels the pending validation-request for the given file
   *
   * @private
   * @param {string} uri  parameter that holds the uri to the document
   * @memberof DocumentActionProvider
   */
  private cleanPendingValidation(uri: string): void {
    const request = this.pendingValidationRequests.get(uri);
    if (request !== undefined) {
      clearTimeout(request);
      this.pendingValidationRequests.delete(uri);
    }
  }

  /**
   * Validates the given document and send the diagnostics and specific ov-notification if necessary
   * Posts the data to the REST-API in two steps. First we parse it for the linting function which contains
   *  only the parse-tree and the error-messages. Afterwards we only generate the code in another parsing process.
   *
   * @private
   * @param {string} uri parameter that holds the uri to the document
   * @returns {Promise<void>}
   * @memberof DocumentActionProvider
   */
  private async validateDocumentWithUri(uri: string): Promise<void> {
    const document = this.server.documents.get(uri);
    if (!document) {
      this.cleanDiagnostics(document);
      return;
    }

    return this.validateText(uri, document.getText());
  }

  private async validateText(uri: string, documentText: string): Promise<void> {
    let apiResponse: LintingResponse | null = null;

    const useSchema:
      | UseSchemaDataclass
      | undefined = SchemaProvider.parseSpecificSchema(
        documentText,
        this.server,
        URI.parse(uri)
      );

    var schema = this.server.jsonSchema;
    if (!!useSchema) {
      documentText = useSchema.ovText;
      if (!!useSchema.schemaText) schema = useSchema.schemaText;
    }

    try {
      apiResponse = await ApiProxy.postLintingData(
        documentText,
        this.server.restParameter,
        schema
      );
    } catch (err) {
      console.error("doValidate: " + err);
      return;
    }

    if (!apiResponse) return;

    if (!!useSchema) {
      apiResponse.$mainAstNode.$scopes.forEach(scope =>
        scope.modifyRangeOfEveryNode(useSchema.schemaLineIndex + 1)
      );
      apiResponse.$mainAstNode.$scopes.unshift(
        new UseSchemaNode(
          useSchema.schemaLineIndex,
          useSchema.useSchemaLine,
          useSchema.schemaText,
          useSchema.schemaPath
        )
      );
    }

    let ovDocument: OvDocument | undefined = this.generateDocumentWithAst(
      apiResponse,
      uri
    );
    if (!ovDocument) return;

    const diagnostics: Diagnostic[] = this.generateDiagnostics(
      apiResponse,
      useSchema
    );

    this.sendApiResponseToClient(apiResponse, diagnostics);

    if (!ovDocument) return;

    this.server.ovDocuments.addOrOverrideOvDocument(ovDocument);
    this.server.setGeneratedSchema(apiResponse);
    this.syntaxNotifier.sendTextMateGrammarIfNecessary(apiResponse);

    // Then we can't generate code anyway
    if (apiResponse.$errors.length > 0) return;

    let codeGenerationResponse: ICodeResponse | null = null;
    try {
      codeGenerationResponse = await ApiProxy.postData(
        documentText,
        this.server.restParameter,
        schema
      );
    } catch (err) {
      console.error("Code generation Error: " + err);
    }

    if (!codeGenerationResponse) return;
    this.syntaxNotifier.sendGeneratedCodeIfNecessary(codeGenerationResponse);
  }

  /**
   * Generates the diagnostics for the given document
   *
   * @private
   * @param {(LintingResponse | null)} apiResponse response of the REST-Api
   * @param {OvDocument} ovDocument document das should be validated
   * @returns {Diagnostic[]}
   * @memberof DocumentActionProvider
   */
  public generateDiagnostics(
    apiResponse: LintingResponse | null,
    useSchemaDataclass?: UseSchemaDataclass
  ): Diagnostic[] {
    if (apiResponse == null) {
      return [];
    }

    let lineModification: number = !useSchemaDataclass
      ? 0
      : useSchemaDataclass.schemaLineIndex + 1;

    const diagnostics: Diagnostic[] = [];
    for (const error of apiResponse.$errors) {
      const diagnosticRange: Range = !error.$range
        ? Range.create(0, 0, 0, 1)
        : error.$range.moveLines(lineModification).asRange();
      const diagnostic: Diagnostic = Diagnostic.create(
        diagnosticRange,
        error.$message
      );
      diagnostic.severity = DiagnosticSeverity.Error;
      diagnostics.push(diagnostic);
    }

    if (!!useSchemaDataclass)
      diagnostics.push(...useSchemaDataclass.diagnostics);

    return diagnostics;
  }

  /**
   * Generates an ovDocument with the given response and text
   *
   * @private
   * @param {(LintingResponse | null)} apiResponse response that holds the ast
   * @returns {(OvDocument | null)} generated document
   * @memberof DocumentActionProvider
   */
  private generateDocumentWithAst(
    apiResponse: LintingResponse | null,
    uri: string
  ): OvDocument | undefined {
    if (
      !apiResponse ||
      !apiResponse.$mainAstNode ||
      !apiResponse.$mainAstNode.$scopes
    ) {
      return undefined;
    }

    return new OvDocument(
      apiResponse.$mainAstNode.$scopes,
      apiResponse.$mainAstNode.$declarations,
      this.server.getAliasHelper(),
      uri
    );
  }

  /**
   * Sends the given diagnostics to the client
   *
   * @private
   * @param {TextDocument} document document which gets validated
   * @param {Diagnostic[]} diagnostics diagnostics that are generated
   * @memberof DocumentActionProvider
   */
  private sendDiagnostics(
    documentUri: string,
    diagnostics: Diagnostic[]
  ): void {
    this.server.connection.sendDiagnostics({
      uri: documentUri,
      diagnostics
    });
  }

  private sendApiResponseToClient(apiResponse: LintingResponse, diagnostics: Diagnostic[]) {
    this.server.connection.sendNotification(NotificationEnum.ParsingResult, {
      variables: apiResponse.$mainAstNode.$declarations,
      diagnostics: diagnostics,
      parsedSchema: apiResponse.$schema
    });
  }
}
