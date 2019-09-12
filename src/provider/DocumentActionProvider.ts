// import { String } from "typescript-string-operations";
import { Diagnostic, DiagnosticSeverity, Position, Range, TextDocument, TextDocumentChangeEvent } from "vscode-languageserver-types";
import { OvDocument } from "../data-model/ov-document/OvDocument";
// import { StringHelper } from "../helper/StringHelper";
import { OvServer } from "../OvServer";
import { ApiProxy } from "../rest-interface/ApiProxy";
// import { GenericNode } from "../rest-interface/intelliSenseTree/GenericNode";
import { ApiGlobalResponseError } from "../rest-interface/response/error/ApiGlobalResponseError";
import { ApiRuleResponseError } from "../rest-interface/response/error/ApiRuleResponseError";
import { GeneralApiResponse } from "../rest-interface/response/GeneralApiResponse";
import { ApiResponseSuccess } from "../rest-interface/response/success/ApiResponseSuccess";
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

    // private getChangedElements(oldNodes: GenericNode[], newString: string): [[string | null, number][], [number, number][]] {
    //     var rangeList: [number, number][] = [];
    //     var linesList: [string | null, number][] = [];

    //     // TODO: Iterate per Line and nicht per "element"

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
    //         var linesChanged: boolean = oldNode.getLines().length != newElement.length;
    //         for (var secondIndex = 0; secondIndex < newElement.length; secondIndex++) {
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

        var apiResponse: GeneralApiResponse | null = null;
        var ovDocument: OvDocument | undefined = this.server.ovDocuments.get(uri);

        // if (!!ovDocument) {
        //     var newString: string = document.getText();
        //     var parsingTupleList = this.getChangedElements(ovDocument.elementManager.getElements(), newString);


        //     ovDocument.elementManager.updateElementRanges(parsingTupleList[1]);
        //     console.log(parsingTupleList);
        //     // TODO: Modify ranges

        //     // for (let index = 0; index < parsingTupleList.length; index++) {
        //     //     const tuple = parsingTupleList[index];
        //     //     var scope: GenericNode | null = null;

        //     //     if (!!tuple[0]) {
        //     //         var parsedElement = await ApiProxy.postLintingData(tuple[0], this.server.restParameter, ovDocument);
        //     //         if (!parsedElement || !parsedElement.getScope()) continue;

        //     //         const number = tuple[1];
        //     //         scope = parsedElement.getScope();
        //     //         // ovDocument.elementManager.overrideElement(scope!, number, tuple[2]);

        //     //         // TODO: Manipulate Error, that the Error can be passed to the right position
        //     //         ovDocument.elementManager.overrideError(parsedElement.getErrors().map(err => err.toDiagnostic(scope!.getRange()))!, number);
        //     //     }
        //     // }

        //     var diagnostics: Diagnostic[] = [];
        //     ovDocument.elementManager.getErrors().forEach(list => diagnostics = diagnostics.concat(list));
        //     if (diagnostics !== [])
        //         this.sendDiagnostics(document, diagnostics);
        // } else {

            try {
                apiResponse = await ApiProxy.postData(document.getText(), this.server.restParameter);
            } catch (err) {
                console.error("doValidate: " + err);

                if (err != null &&
                    err.response != null &&
                    err.response.data != null) {
                    var diagnostic: Diagnostic = Diagnostic.create(Range.create(0, 0, 0, 1), err.response.data.message, DiagnosticSeverity.Error);
                    this.sendDiagnostics(document, [diagnostic]);
                }
                return;
            }

            if (!apiResponse) return;
            ovDocument = this.generateDocumentWithAst(apiResponse, document.getText());

            if (!ovDocument) return;
            var diagnostics: Diagnostic[] = this.generateDiagnostics(apiResponse, ovDocument);
            if (diagnostics !== [])
                this.sendDiagnostics(document, diagnostics);
        // }

        if (!apiResponse || !ovDocument) return;
        this.server.ovDocuments.addOrOverrideOvDocument(document.uri, ovDocument);
        this.server.setGeneratedSchema(apiResponse);

        if (apiResponse != null)
            this.syntaxNotifier.sendNotificationsIfNecessary(apiResponse);
    }

    /**
     * Generates an ovDocument with the given response and text
     *
     * @private
     * @param {(GeneralApiResponse | null)} apiResponse response that holds the ast
     * @param {string} documentText test that is in the corresponding document
     * @returns {(OvDocument | null)} generated document
     * @memberof DocumentActionProvider
     */
    private generateDocumentWithAst(apiResponse: GeneralApiResponse | null, text: string): OvDocument | undefined {
        var successResponse = apiResponse as ApiResponseSuccess;
        if (!successResponse ||
            !successResponse.mainAstNode ||
            !successResponse.mainAstNode.getScopes())
            return undefined;

        return new OvDocument(successResponse.mainAstNode.getScopes(),
            successResponse.mainAstNode.getDeclarations(),
            this.server.aliasHelper, text);
    }

    /**
     * Generates the diagnostics for the given document
     *
     * @private
     * @param {(GeneralApiResponse | null)} apiResponse response of the REST-Api
     * @param {OvDocument} ovDocument document das should be validated
     * @returns {Diagnostic[]}
     * @memberof DocumentActionProvider
     */
    private generateDiagnostics(apiResponse: GeneralApiResponse | null, ovDocument: OvDocument): Diagnostic[] {
        var ruleError = apiResponse as ApiRuleResponseError;
        var diagnostics: Diagnostic[] = [];

        if (ruleError != null &&
            ruleError.errors != null) {

            for (let index = 0; index < ruleError.errors.length; index++) {
                const element = ruleError.errors[index];

                var range: Range;
                var rule = ovDocument.elementManager.getElements()[element.globalElementPosition - 1];
                if (rule == null) continue;

                var elementRange = rule.getRange();
                if (!elementRange) continue;

                var severity: DiagnosticSeverity;
                severity = DiagnosticSeverity.Error;


                var startPosition = Position.create(elementRange.getStart().getLine(), 0);
                var endPosition = Position.create(elementRange.getEnd().getLine(), elementRange.getEnd().getColumn());
                range = Range.create(startPosition, endPosition);

                if (range != null) {
                    diagnostics.push(Diagnostic.create(range, element.userMessage, severity));
                }
            }

            //Then the errors contained an invalid "globalElementPosition"
            if (diagnostics.length == 0) {
                ruleError.errors.forEach(error => {
                    diagnostics.push(Diagnostic.create(Range.create(0, 0, 0, 1), error.userMessage, severity = DiagnosticSeverity.Error));
                });
            }
        } else {
            var globalError = apiResponse as ApiGlobalResponseError;
            if (globalError != null &&
                globalError.errors != null) {
                for (let index = 0; index < ruleError.errors.length; index++) {
                    const element = ruleError.errors[index];
                    var startPosition = Position.create(0, 0);
                    var endPosition = Position.create(0, 1);
                    range = Range.create(startPosition, endPosition);

                    if (range != null) {
                        diagnostics.push(Diagnostic.create(range, element.userMessage, DiagnosticSeverity.Error));
                    }
                }
            }
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
