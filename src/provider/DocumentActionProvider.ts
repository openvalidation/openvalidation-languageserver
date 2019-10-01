import { ICodeResponse } from "src/rest-interface/response/ICodeResponse";
import { LintingResponse } from "src/rest-interface/response/LintingResponse";
import { Diagnostic, DiagnosticSeverity, TextDocument, TextDocumentChangeEvent, Range } from "vscode-languageserver-types";
import { OvDocument } from "../data-model/ov-document/OvDocument";
import { OvServer } from "../OvServer";
import { ApiProxy } from "../rest-interface/ApiProxy";
import { SyntaxNotifier } from "./SyntaxNotifier";
import { Provider } from "./Provider";

/**
 * Provider to handle every response which deals with documents. 
 * In addition, it handels the `onDidOpen`, `onDidChangeContent` and `onDidClose` requests
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
    static bind(server: OvServer): DocumentActionProvider {
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
        this.server.documents.onDidChangeContent(event => this.validate(event.document.uri));
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
        this.pendingValidationRequests.set(uri, setTimeout(() => {
            this.pendingValidationRequests.delete(uri);
            this.doValidate(uri);
        }));
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
    private async doValidate(uri: string): Promise<void> {
        var document = this.server.documents.get(uri);
        if (document == null) {
            this.cleanDiagnostics(document);
            return;
        }

        var apiResponse: LintingResponse | null = null;
        var ovDocument: OvDocument | undefined = this.server.ovDocuments.get(uri);

        try {
            apiResponse = await ApiProxy.postLintingData(document.getText(), this.server.restParameter);
        } catch (err) {
            console.error("doValidate: " + err);
            return;
        }

        if (!apiResponse) return;
        ovDocument = this.generateDocumentWithAst(apiResponse, document.getText());

        if (!ovDocument) return;
        var diagnostics: Diagnostic[] = this.generateDiagnostics(apiResponse);
        if (diagnostics !== [])
            this.sendDiagnostics(document, diagnostics);

        if (!ovDocument) return;
        this.server.ovDocuments.addOrOverrideOvDocument(document.uri, ovDocument);
        this.server.setGeneratedSchema(apiResponse);
        this.syntaxNotifier.sendTextMateGrammarIfNecessary(apiResponse);

        var codeGenerationResponse: ICodeResponse | null = null;
        try {
            codeGenerationResponse = await ApiProxy.postData(document.getText(), this.server.restParameter);
        }
        catch (err) { console.error("Code generation Error: " + err); }

        if (!codeGenerationResponse) return;
        this.syntaxNotifier.sendGeneratedCodeIfNecessary(codeGenerationResponse);
    }

    /**
     * Generates an ovDocument with the given response and text
     *
     * @private
     * @param {(LintingResponse | null)} apiResponse response that holds the ast
     * @param {string} documentText test that is in the corresponding document
     * @returns {(OvDocument | null)} generated document
     * @memberof DocumentActionProvider
     */
    private generateDocumentWithAst(apiResponse: LintingResponse | null, text: string): OvDocument | undefined {
        if (!apiResponse ||
            !apiResponse.$mainAstNode ||
            !apiResponse.$mainAstNode.$scopes)
            return undefined;

        return new OvDocument(apiResponse.$mainAstNode.$scopes,
            apiResponse.$mainAstNode.$declarations,
            this.server.aliasHelper);
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
    private generateDiagnostics(apiResponse: LintingResponse | null): Diagnostic[] {
        if (apiResponse == null) return [];

        var diagnostics: Diagnostic[] = [];
        for (const error of apiResponse.$errors) {
            var diagnosticRange: Range = !error.$range ? Range.create(0, 0, 0, 1) : error.$range.asRange();
            var diagnostic: Diagnostic = Diagnostic.create(diagnosticRange, error.$message);
            diagnostic.severity = DiagnosticSeverity.Error;
            diagnostics.push(diagnostic);
        }

        return diagnostics;
    }

    /**
     * Deletes the diagnostics completely
     *
     * @private
     * @param {TextDocument} document document for which the diagnostics should be deleted
     * @memberof DocumentActionProvider
     */
    private cleanDiagnostics(document: TextDocument | undefined): void {
        if (document != undefined)
            this.sendDiagnostics(document, []);
    }

    /**
     * Sends the given diagnostics to the client
     *
     * @private
     * @param {TextDocument} document document which gets validated
     * @param {Diagnostic[]} diagnostics diagnostics that are generated
     * @memberof DocumentActionProvider
     */
    private sendDiagnostics(document: TextDocument, diagnostics: Diagnostic[]): void {
        this.server.connection.sendDiagnostics({
            uri: document.uri, diagnostics
        });
    }
}