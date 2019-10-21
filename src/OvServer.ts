import * as YAML from "js-yaml";
import {
  createConnection,
  IConnection,
  InitializeParams,
  InitializeResult,
  MessageReader,
  MessageWriter,
  ServerCapabilities,
  TextDocuments
} from "vscode-languageserver";
import { URI } from "vscode-uri";
import { AliasHelper } from "./aliases/AliasHelper";
import { OvDocuments } from "./data-model/ov-document/OvDocuments";
import { CompletionKeyEnum } from "./enums/CompletionKeyEnum";
import { CultureEnum } from "./enums/CultureEnum";
import { LanguageEnum } from "./enums/LanguageEnum";
import { NotificationEnum } from "./enums/NotificationEnum";
import { CompletionProvider } from "./provider/CompletionProvider";
import { DocumentActionProvider } from "./provider/DocumentActionProvider";
import { DocumentSymbolProvider } from "./provider/DocumentSymbolProvider";
import { FoldingRangesProvider } from "./provider/FoldingRangesProvider";
import { FormattingProvider } from "./provider/FormattingProvider";
import { GotoDefinitionProvider } from "./provider/GotoDefinitionProvider";
import { HoverProvider } from "./provider/HoverProvider";
import { RenameProvider } from "./provider/RenameProvider";
import { ApiProxy } from "./rest-interface/ApiProxy";
import { LintingResponse } from "./rest-interface/response/LintingResponse";
import { RestParameter } from "./rest-interface/RestParameter";
import { ISchemaType } from "./rest-interface/schema/ISchemaType";

export function startServer(
  reader: MessageReader,
  writer: MessageWriter
): OvServer {
  const connection = createConnection(reader, writer);
  const server = new OvServer(connection);
  server.start();
  return server;
}

/**
 * Main-object to bind the websocket connection to the function-providers
 *
 * @export
 * @class OvServer
 */
export class OvServer {
  /**
   * Generates and returns the Parameter for the Rest-Api
   *
   * @readonly
   * @type {RestParameter} generated parameter
   * @memberof OvServer
   */
  public get restParameter(): RestParameter {
    return new RestParameter(
      this.jsonSchema,
      this.culture,
      this.language,
      this.aliasHelper
    );
  }
  public readonly documents = new TextDocuments();
  public readonly ovDocuments = new OvDocuments();

  public aliasHelper = new AliasHelper();

  public language: LanguageEnum;
  public culture: CultureEnum;

  public schema: ISchemaType;
  public jsonSchema: JSON;
  protected workspaceRoot: URI | undefined;

  private readonly documentActionProvider: DocumentActionProvider;

  /**
   * Creates an instance of OvServer.
   * @param {IConnection} connection connection the server should connect to
   * @memberof OvServer
   */
  constructor(public readonly connection: IConnection) {
    this.language = LanguageEnum.Java;
    this.culture = CultureEnum.German;
    this.schema = { complexData: [], dataProperties: [] };
    this.jsonSchema = JSON.parse(JSON.stringify({}));

    // Listener for document-changes
    this.documents.listen(this.connection);
    this.documentActionProvider = DocumentActionProvider.bind(this);

    // Listener for client requests
    this.connection.onInitialize(params => this.initialize(params));
    CompletionProvider.bind(this);
    RenameProvider.bind(this);
    HoverProvider.bind(this);
    DocumentSymbolProvider.bind(this);
    FormattingProvider.bind(this);
    FoldingRangesProvider.bind(this);
    GotoDefinitionProvider.bind(this);

    // Own Listener for every additional paramater we need for ov-parsing
    this.connection.onNotification(
      NotificationEnum.SchemaChanged,
      (params: { schema: string; uri: string }) =>
        this.validateAndSetSchemaDefinition(params)
    );
    this.connection.onNotification(
      NotificationEnum.LanguageChanged,
      (params: { language: string; uri: string }) => this.setLanguage(params)
    );
    this.connection.onNotification(
      NotificationEnum.CultureChanged,
      (params: { culture: string; uri: string }) => this.setCulture(params)
    );
  }

  /**
   * Set the new schema generated schema
   *
   * @param {GeneralApiResponse} data current parsing result
   * @memberof OvServer
   */
  public setGeneratedSchema(data: LintingResponse) {
    if (!!data.$schema) {
      this.schema = data.$schema;
    }
  }

  /**
   * starts listening for requests or notifications of the given connection
   *
   * @memberof OvServer
   */
  public start(): void {
    this.connection.listen();
  }

  /**
   * Sets the received language as our language and validates the current file
   *
   * @private
   * @param {{ language: string, uri: string }} params that contains the language and the uri of the current document
   * @returns {void}
   * @memberof OvServer
   */
  public async setLanguage(params: {
    language: string;
    uri: string;
  }): Promise<void> {
    if (!params) {
      return;
    }

    const languageEnum = params.language as LanguageEnum;
    this.language = languageEnum;

    this.documentActionProvider.validate(params.uri);
  }

  /**
   * Sets the received culture as our culture and validates the current file
   *
   * @private
   * @param {{ culture: string, uri: string }} params that contains the language and the uri of the current document
   * @returns {void}
   * @memberof OvServer
   */
  public async setCulture(params: {
    culture: string;
    uri: string;
  }): Promise<void> {
    if (!params) {
      return;
    }

    const cultureEnum = params.culture as CultureEnum;
    this.culture = cultureEnum;
    this.setAliases();

    this.documentActionProvider.validate(params.uri);
  }

  /**
   * Gets the new aliases and sets them to the alias-helper. Furthermore it
   * sends a Notification to inform the client about the new aliases
   *
   * @private
   * @returns {Promise<void>}
   * @memberof OvServer
   */
  public async setAliases(): Promise<void> {
    const returnAliases = await ApiProxy.getAliases(this.culture);
    if (!returnAliases) {
      return;
    }

    // Because of strange error, where the keys are not displayed as a string
    const aliases = new Map<string, string>();
    for (const aliasPair of returnAliases.$aliases) {
      if (!new RegExp("^$|[()*+-/^]").test(aliasPair[0])) {
        aliases.set(aliasPair[0], aliasPair[1]);
      }
    }

    this.aliasHelper.$aliases = aliases;
    this.aliasHelper.$operators = returnAliases.$operators;

    const commentKeyword = this.aliasHelper.getCommentKeyword();
    if (!!commentKeyword) {
      this.connection.sendNotification(
        NotificationEnum.CommentKeywordChanged,
        commentKeyword
      );
    }
  }

  /**
   * Returns a specification of the available functions of the server
   *
   * @private
   * @param {InitializeParams} params parameter of the client, which specify the rootPath
   * @returns {InitializeResult} result of the available functions
   * @memberof OvServer
   */
  private async initialize(
    params: InitializeParams
  ): Promise<InitializeResult> {
    if (!!params.rootPath) {
      this.workspaceRoot = URI.file(params.rootPath);
    } else if (!!params.rootUri) {
      this.workspaceRoot = URI.parse(params.rootUri);
    }

    this.setAliases();

    const capabilities: ServerCapabilities & {
      semanticNotification: boolean;
      ovlSpecificNotification: boolean;
    } = {
      textDocumentSync: this.documents.syncKind,
      codeActionProvider: false,
      completionProvider: {
        resolveProvider: false,
        triggerCharacters: [
          CompletionKeyEnum.Array,
          CompletionKeyEnum.ComplexSchema
        ]
      },
      definitionProvider: true,
      renameProvider: {
        prepareProvider: true
      },
      hoverProvider: true,
      documentSymbolProvider: true,
      documentRangeFormattingProvider: true,
      executeCommandProvider: {
        commands: ["json.documentUpper", "language"]
      },
      colorProvider: false,
      foldingRangeProvider: true,

      // Boolean for the OV-specific features
      semanticNotification: true,
      ovlSpecificNotification: true
    };

    return {
      capabilities
    };
  }

  /**
   * Sets the received schema as our new schema and validates the current file
   *
   * @private
   * @param {{ schema: string, uri: string }} params schema that we received from the client and uri of the document
   * @returns {void}
   * @memberof OvServer
   */
  private validateAndSetSchemaDefinition(params: {
    schema: string;
    uri: string;
  }): void {
    if (!params) {
      return;
    }

    const yaml = YAML.load(params.schema);
    this.jsonSchema = JSON.parse(JSON.stringify(yaml));

    this.documentActionProvider.validate(params.uri);
  }
}
