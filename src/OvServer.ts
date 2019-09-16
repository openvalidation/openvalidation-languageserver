import * as YAML from "js-yaml";
import { IConnection, InitializeParams, InitializeResult, ServerCapabilities, TextDocuments } from 'vscode-languageserver';
import Uri from 'vscode-uri';
import { AliasHelper } from './aliases/AliasHelper';
import { CompletionKey } from './Constants';
import { OvDocuments } from "./data-model/ov-document/OvDocuments";
import { CompletionProvider } from "./provider/CompletionProvider";
import { DocumentActionProvider } from "./provider/DocumentActionProvider";
import { DocumentSymbolProvider } from "./provider/DocumentSymbolProvider";
import { FoldingRangesProvider } from "./provider/FoldingRangesProvider";
import { FormattingProvider } from "./provider/FormattingProvider";
import { GotoDefinitionProvider } from "./provider/GotoDefinitionProvider";
import { HoverProvider } from "./provider/HoverProvider";
import { RenameProvider } from "./provider/RenameProvider";
import { ApiProxy } from './rest-interface/ApiProxy';
import { Culture, Language } from "./rest-interface/ParsingEnums";
import { RestParameter } from './rest-interface/RestParameter';
import { ISchemaType } from './rest-interface/schema/ISchemaType';
import { LintingResponse } from "./rest-interface/response/LintingResponse";

/**
 * Main-object to bind the websocket connection to the function-providers
 *
 * @export
 * @class OvServer
 */
export class OvServer {
    public readonly documents = new TextDocuments();
    public readonly ovDocuments = new OvDocuments();

    public aliasHelper = new AliasHelper();

    private readonly documentActionProvider: DocumentActionProvider;
    protected workspaceRoot: Uri | undefined;

    public language: Language;
    public culture: Culture;

    public schema: ISchemaType;
    public jsonSchema: JSON;

    constructor(public readonly connection: IConnection) {
        this.language = Language.Java;
        this.culture = Culture.German;
        this.schema = { complexData: [], dataProperties: [] };
        this.jsonSchema = JSON.parse(JSON.stringify({}));

        //Listener for document-changes
        this.documents.listen(this.connection);
        this.documentActionProvider = DocumentActionProvider.bind(this);

        //Listener for client requests
        this.connection.onInitialize(params => this.initialize(params));
        CompletionProvider.bind(this);
        RenameProvider.bind(this);
        HoverProvider.bind(this);
        DocumentSymbolProvider.bind(this);
        FormattingProvider.bind(this);
        FoldingRangesProvider.bind(this);
        GotoDefinitionProvider.bind(this);

        //Own Listener for every additional notifications we need for ov-parsing
        this.connection.onNotification("textDocument/schemaChanged", (params: { schema: string, uri: string }) => this.validateAndSetSchemaDefinition(params));
        this.connection.onNotification("textDocument/languageChanged", (params: { language: string, uri: string }) => this.setLanguage(params));
        this.connection.onNotification("textDocument/cultureChanged", (params: { culture: string, uri: string }) => this.setCulture(params));
    }


    /**
     * Generates and returns the Parameter for the Rest-Api
     *
     * @readonly
     * @type {RestParameter} generated parameter
     * @memberof OvServer
     */
    public get restParameter(): RestParameter {
        return new RestParameter(this.jsonSchema, this.culture, this.language);
    }

    /**
     * Returns a specification of the available functions of the server
     *
     * @private
     * @param {InitializeParams} params parameter of the client, which specify the rootPath
     * @returns {InitializeResult} result of the available functions
     * @memberof OvServer
     */
    private async initialize(params: InitializeParams): Promise<InitializeResult> {
        if (params.rootPath) {
            this.workspaceRoot = Uri.file(params.rootPath);
        } else if (params.rootUri) {
            this.workspaceRoot = Uri.parse(params.rootUri);
        }

        this.setAliases();

        var capabilities: ServerCapabilities & {
            semanticNotification: boolean,
            ovlSpecificNotification: boolean
        } = {
            textDocumentSync: this.documents.syncKind,
            codeActionProvider: false,
            completionProvider: {
                resolveProvider: true,
                triggerCharacters: [CompletionKey.Array, CompletionKey.ComplexSchema]
            },
            definitionProvider: true,
            renameProvider: {
                prepareProvider: true
            },
            hoverProvider: true,
            documentSymbolProvider: true,
            documentRangeFormattingProvider: true,
            executeCommandProvider: {
                commands: ['json.documentUpper', 'language']
            },
            colorProvider: false,
            foldingRangeProvider: true,

            // Boolean for the OV-specific features
            semanticNotification: true,
            ovlSpecificNotification: true
        }

        return {
            capabilities: capabilities
        }
    }

    /**
     * Sets the received schema as our new schema and validates the current file
     *
     * @private
     * @param { schema: string, uri: string } params schema that we received from the client and uri of the corresponding document
     * @param {OvServer} _this
     * @returns {void}
     * @memberof OvServer
     */
    private validateAndSetSchemaDefinition(params: { schema: string, uri: string }): void {
        if (!params) return;

        var yaml = YAML.load(params.schema);
        this.jsonSchema = JSON.parse(JSON.stringify(yaml));

        this.documentActionProvider.validate(params.uri);
    }

    /**
     * Sets the received language as our language and validates the current file
     *
     * @private
     * @param {{ language: string, uri: string }} params that contains the langauge and the uri of the current document
     * @returns {void}
     * @memberof OvServer
     */
    private async setLanguage(params: { language: string, uri: string }): Promise<void> {
        if (!params) return;

        var languageEnum = params.language as Language;
        this.language = languageEnum;

        this.documentActionProvider.validate(params.uri);
    }

    /**
     * Sets the received culture as our culture and validates the current file
     * 
     * @private
     * @param {{ language: string, uri: string }} params that contains the langauge and the uri of the current document
     * @returns {void}
     * @memberof OvServer
     */
    private async setCulture(params: { culture: string, uri: string }): Promise<void> {
        if (!params) return;

        var cultureEnum = params.culture as Culture;
        this.culture = cultureEnum;
        this.setAliases();

        this.documentActionProvider.validate(params.uri);
    }

    /**
     * Set the new schema generated schema
     *
     * @param {GeneralApiResponse} data current parsing result
     * @memberof OvServer
     */
    public setGeneratedSchema(data: LintingResponse) {
        if (!!data.getSchema())
            this.schema = data.getSchema();
    }

    /**
     * Gets the new aliases and sets them to the alias-helper. Furthermore it 
     * sends a Notification to inform the client about the new aliases
     *
     * @private
     * @returns {Promise<void>}
     * @memberof OvServer
     */
    private async setAliases(): Promise<void> {
        var returnAliases = await ApiProxy.getAliases(this.culture);
        if (!returnAliases || !returnAliases.data) return;

        // Because of strange error, where the keys are not displayed as a string
        var aliases = new Map<string, string>();
        for (const aliasPair of returnAliases.data.getAliases()) {
            if (!new RegExp("^$|[\(\)\*\+\-\/\^]").test(aliasPair[0])) {
                aliases.set(aliasPair[0], aliasPair[1]);
            }
        }

        if (aliases) {
            this.aliasHelper.updateAliases(aliases);
            this.aliasHelper.updateOperators(returnAliases.data.getOperators());

            var commentKeyword = this.aliasHelper.getCommentKeyword();
            if (!!commentKeyword)
                this.connection.sendNotification("textDocument/aliasesChanges", commentKeyword);
        }
    }

    /**
     * starts listening for requests or notifications of the given connection
     *
     * @memberof OvServer
     */
    start() {
        this.connection.listen();
    }
}