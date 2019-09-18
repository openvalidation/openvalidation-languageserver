import { CodeResponse } from "src/rest-interface/response/CodeResponse";
import { LintingResponse } from "src/rest-interface/response/LintingResponse";
import { Diagnostic, DiagnosticSeverity, TextDocument, TextDocumentChangeEvent } from "vscode-languageserver-types";
import { OvDocument } from "../data-model/ov-document/OvDocument";
import { OvServer } from "../OvServer";
import { ApiProxy } from "../rest-interface/ApiProxy";
import { OvSyntaxNotifier } from "./OvSyntaxNotifier";
import { Provider } from "./Provider";

/**
 * Provider to handle every response which deals with documents. In addition, it handels
 *
 * @export
 * @class DocumentActionProvider
 * @extends {Provider}
 */
export class DocumentActionProvider extends Provider {
    static bind(server: OvServer) {
        return new DocumentActionProvider(server);
    }

    private readonly pendingValidationRequests: Map<string, number>;
    private readonly syntaxNotifier: OvSyntaxNotifier;

    constructor(server: OvServer) {
        super(server);
        this.pendingValidationRequests = new Map<string, number>();
        this.syntaxNotifier = new OvSyntaxNotifier(server);

        this.server.documents.onDidOpen(event => this.validate(event.document.uri));
        this.server.documents.onDidChangeContent(event => this.validate(event.document.uri));
        this.server.documents.onDidClose(event => this.close(event));
    }

    /**
     * Cleans current validation and starts a new validation-process
     *
     * @param {TextDocumentChangeEvent} event parameter that holds the document
     * @memberof DocumentActionProvider
     */
    public validate(uri: string): void {
        //TODO: Show error directly at the wrong string
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
     * @param {TextDocument} document the specific document
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
     *
     * @private
     * @param {TextDocument} document document that should be validated
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

        var codeGenerationResponse: CodeResponse | null = null;
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
            !apiResponse.getMainAstNode() ||
            !apiResponse.getMainAstNode()!.getScopes())
            return undefined;

        return new OvDocument(apiResponse.getMainAstNode()!.getScopes(),
            apiResponse.getMainAstNode()!.getDeclarations(),
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
        for (const error of apiResponse.getErrors()) {
            var diagnostic: Diagnostic = Diagnostic.create(error.getRange().asRange(), error.getMessage());
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



// TODO: Code for getting the changed elements
// private getChangedElements(oldNodes: GenericNode[], newString: string): [[string | null, number][], [number, number][]] {
//     var rangeList: [number, number][] = [];
//     var linesList: [string | null, number][] = [];

//     var newElements: [string[], number][] = StringHelper.getLinesPerElement(newString);

//     var index: number = 0;
//     var indexPuffer: number = 0;
//     while (index < newElements.length) {
//         const newElement: [string[], number] = newElements[index + indexPuffer];
//         if (oldNodes.length <= index) break;
//         const oldNode = oldNodes[index];

//         var newLines = newElement[0];
//         var startLine = newElement[1];

//         var relevantLines: string[] = [];

//         // Iterate over every line
//         var linesChanged: boolean = oldNode.getLines().length != newLines.length;
//         for (var secondIndex = 0; secondIndex < newLines.length; secondIndex++) {
//             const newLine = newLines[secondIndex];
//             const oldLine = oldNode.getLines()[secondIndex];

//             if (newLine != oldLine) {
//                 linesChanged = true;
//             }

//             if (!String.IsNullOrWhiteSpace(newLine)) {
//                 relevantLines.push(newLine);
//             }
//         }

//         if (linesChanged) {
//             rangeList.push([startLine, startLine + relevantLines.length - 1]);
//             linesList.push([relevantLines.join("\n"), index]);
//         } else {
//             rangeList.push([startLine, startLine + relevantLines.length - 1]);
//             linesList.push([null, index]);
//         }
//         index++;
//     }

//     // Add new Elements
//     if (index < newElements.length) {
//         for (let j = index; j < newElements.length; j++) {
//             const elementLines = newElements[j][0];
//             const startIndex = newElements[j][1];

//             if (elementLines.length > 0) {
//                 rangeList.push([startIndex, startIndex + elementLines.length - 1]);
//                 linesList.push([elementLines.join("\n"), index]);
//             }
//         }
//     }

//     // TODO: Generate ONLY the changed lines

//     return [linesList, rangeList];
// }


// if (!!ovDocument) {
//     var newString: string = document.getText();
//     var parsingTuple = this.getChangedElements(ovDocument.elementManager.getElements(), newString);

//     for (let index = 0; index < parsingTuple[0].length; index++) {
//         const tuple = parsingTuple[0][index];
//         var scope: GenericNode | null = null;

//         if (!!tuple[0]) {
//             var parsedElement = await ApiProxy.postLintingData(tuple[0], this.server.restParameter, ovDocument);
//             if (!parsedElement || !parsedElement.getScope()) continue;

//             const number = tuple[1];
//             scope = parsedElement.getScope();
//             ovDocument.elementManager.overrideElement(scope!, tuple[1]);

//             // TODO: Manipulate Error, that the Error can be passed to the right position
//             ovDocument.elementManager.overrideError(parsedElement.getErrors().map(err => err.toDiagnostic(scope!.getRange()))!, number);
//         }
//     }

//     ovDocument.elementManager.updateElementRanges(parsingTuple[1]);

//     var diagnostics: Diagnostic[] = [];
//     ovDocument.elementManager.getErrors().forEach(list => diagnostics = diagnostics.concat(list));
//     if (diagnostics !== [])
//         this.sendDiagnostics(document, diagnostics);
// }