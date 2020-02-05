import * as rpc from "vscode-ws-jsonrpc";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { plainToClass } from "class-transformer";
import { createConnection, IConnection } from "vscode-languageserver";
import { AliasKey } from "../src/aliases/AliasKey";
import { OvDocument } from "../src/data-model/ov-document/OvDocument";
import { RuleNode } from "../src/data-model/syntax-tree/element/RuleNode";
import { IndexRange } from "../src/data-model/syntax-tree/IndexRange";
import { MainNode } from "../src/data-model/syntax-tree/MainNode";
import { OvServer } from "../src/OvServer";
import { CompletionProvider } from "../src/provider/CompletionProvider";
import { DocumentActionProvider } from "../src/provider/DocumentActionProvider";
import { DocumentSymbolProvider } from "../src/provider/DocumentSymbolProvider";
import { FoldingRangesProvider } from "../src/provider/FoldingRangesProvider";
import { FormattingProvider } from "../src/provider/FormattingProvider";
import { GotoDefinitionProvider } from "../src/provider/GotoDefinitionProvider";
import { HoverProvider } from "../src/provider/HoverProvider";
import { RenameProvider } from "../src/provider/RenameProvider";
import { SyntaxNotifier } from "../src/provider/SyntaxNotifier";
import { AliasesWithOperators } from "../src/rest-interface/aliases/AliasesWithOperators";
import { CompletionResponse } from "../src/rest-interface/response/CompletionResponse";
import { ICodeResponse } from "../src/rest-interface/response/ICodeResponse";
import { LintingError } from "../src/rest-interface/response/LintingError";
import { LintingResponse } from "../src/rest-interface/response/LintingResponse";
import { ISchemaType } from "../src/rest-interface/schema/ISchemaType";

/**
 * Class that provides some useful classes and that mocks the Axios-Rest-Api
 *
 * @export
 * @class TestInitializer
 */
export class TestInitializer {
  public get $server(): OvServer {
    return this.server;
  }

  public get $connection(): IConnection {
    return this.connection;
  }

  public get completionProvider(): CompletionProvider {
    return new CompletionProvider(this.$server);
  }

  public get documentActionProvider(): DocumentActionProvider {
    return new DocumentActionProvider(this.$server);
  }

  public get documentSymbolProvider(): DocumentSymbolProvider {
    return new DocumentSymbolProvider(this.$server);
  }

  public get foldingRangesProvider(): FoldingRangesProvider {
    return new FoldingRangesProvider(this.$server);
  }

  public get formattingProvider(): FormattingProvider {
    return new FormattingProvider(this.$server);
  }

  public get gotoDefinitionProvider(): GotoDefinitionProvider {
    return new GotoDefinitionProvider(this.$server);
  }

  public get hoverProvider(): HoverProvider {
    return new HoverProvider(this.$server);
  }

  public get renameProvider(): RenameProvider {
    return new RenameProvider(this.$server);
  }

  public get syntaxNotifier(): SyntaxNotifier {
    return new SyntaxNotifier(this.$server);
  }

  private server: OvServer;
  private connection: IConnection;
  private mockAdapter: MockAdapter = new MockAdapter(axios);

  private aliasesJson = {
    aliases: {
      "HÖHER ALS": "ʬoperatorʬgreater_than",
      GEGEBEN: "ʬoperatorʬexists",
      MINUS: "ʬarithmoperatorʬsubtract",
      MÜSSEN: "ʬconstraintʬmust",
      "KLEINER ALS": "ʬoperatorʬless_than",
      ERRORCODE: "ʬerrorcodeʬ",
      "EIN TESTFALL": "TESTCASE",
      GLEICH: "ʬoperatorʬequals",
      "TESTFALL MULTI": "TESTCASE_MULTI",
      MAXIMUM: "ʬoperatorʬless_or_equals",
      "SORTIERT NACH": "ʬorderedʬ",
      UNGLEICH: "ʬoperatorʬnot_equals",
      WENN: "ʬifʬ",
      "*": "ʬarithmoperatorʬmultiply",
      "MULTIPLIZIERT MIT": "ʬarithmoperatorʬmultiply",
      "+": "ʬarithmoperatorʬadd",
      "NIEDRIGER ALS": "ʬoperatorʬless_than",
      MUSS: "ʬconstraintʬmust",
      ÜBERSTEIGEN: "ʬoperatorʬgreater_than",
      "-": "ʬarithmoperatorʬsubtract",
      "/": "ʬarithmoperatorʬdivide",
      "MEHR ALS": "ʬoperatorʬgreater_than",
      MIT: "ʬwithʬ",
      MAL: "ʬarithmoperatorʬmultiply",
      "NICHT VORHANDEN": "ʬoperatorʬnot_exists",
      "MIT CODE": "ʬerrorcodeʬ",
      EXISTIERT: "ʬoperatorʬexists",
      SOLLTE: "ʬifʬ",
      NOCHEINER: "TESTCASE_MULTI",
      "ADDIERT MIT": "ʬarithmoperatorʬadd",
      KÜRZER: "ʬoperatorʬless_than",
      "MÜSSEN NICHT": "ʬconstraintʬmustnot",
      "^": "ʬarithmoperatorʬpower",
      MULTIPLIZIERT: "ʬarithmoperatorʬmultiply",
      ODER: "ʬorʬ",
      IST: "ʬoperatorʬequals",
      "EINS VON": "ʬoperatorʬat_least_one_of",
      "SUMME VON": "ʬfunctionʬsum_of",
      DARF: "ʬconstraintʬmust",
      "KÜRZER ALS": "ʬoperatorʬless_than",
      "DARF NICHT": "ʬconstraintʬmustnot",
      "LÄNGER ALS": "ʬoperatorʬgreater_than",
      ANGEGEBEN: "ʬoperatorʬexists",
      LÄNGER: "ʬoperatorʬgreater_than",
      "VON DEM": "ʬofʬ",
      KLEINER: "ʬoperatorʬless_than",
      MEHR: "ʬoperatorʬgreater_than",
      "NICHT ANGEGEBEN": "ʬoperatorʬnot_exists",
      "VON DER": "ʬofʬ",
      ALS: "ʬasʬ",
      HOCH: "ʬarithmoperatorʬpower",
      NIEDRIGER: "ʬoperatorʬless_than",
      "DIVIDIERT DURCH": "ʬarithmoperatorʬdivide",
      GIBT: "ʬoperatorʬexists",
      "GERINGER ALS": "ʬoperatorʬless_than",
      NICHT: "ʬoperatorʬnot_equals",
      "SOLL NICHT": "ʬconstraintʬmustnot",
      SOLLEN: "ʬconstraintʬmust",
      AUS: "ʬfromʬ",
      VORHANDEN: "ʬoperatorʬexists",
      GERINGER: "ʬoperatorʬless_than",
      MINDESTENS: "ʬoperatorʬgreater_or_equals",
      "MUSS NICHT": "ʬconstraintʬmustnot",
      KOMMENTAR: "ʬcommentʬ",
      MODULO: "ʬarithmoperatorʬmodulo",
      "NICHT GIBT": "ʬoperatorʬnot_exists",
      "GETEILT DURCH": "ʬarithmoperatorʬdivide",
      "SOLLEN NICHT": "ʬconstraintʬmustnot",
      GRÖßER: "ʬoperatorʬgreater_than",
      VON: "ʬofʬ",
      VOM: "ʬofʬ",
      MAXIMAL: "ʬoperatorʬless_or_equals",
      DÜRFEN: "ʬconstraintʬmust",
      PLUS: "ʬarithmoperatorʬadd",
      NIMM: "ʬfunctionʬʬtake",
      "GRÖßER ODER GLEICH": "ʬoperatorʬgreater_or_equals",
      UND: "ʬandʬ",
      "WENIGER ALS": "ʬoperatorʬless_than",
      "KLEINER ODER GLEICH": "ʬoperatorʬless_or_equals",
      ÜBERSTEIGT: "ʬoperatorʬgreater_than",
      "NICHT GEGEBEN": "ʬoperatorʬnot_exists",
      IMPORTIERE: "INCLUDE",
      "KEINS VON": "ʬoperatorʬnone_of",
      "WENIGER ALS ODER GLEICH": "ʬoperatorʬless_or_equals",
      KEIN: "ʬoperatorʬnot_equals",
      "DÜRFEN NICHT": "ʬconstraintʬmustnot",
      DURCH: "ʬarithmoperatorʬdivide",
      "MIT ERRORCODE": "ʬerrorcodeʬ",
      DANN: "ʬthenʬ",
      WENIGER: "ʬoperatorʬless_than",
      MOD: "ʬarithmoperatorʬmodulo",
      "SORTIERE NACH": "ʬorderedʬ",
      "NICHT GLEICH": "ʬoperatorʬnot_equals",
      "GRÖßER ALS": "ʬoperatorʬgreater_than",
      DER: "ʬofʬ",
      DES: "ʬofʬ",
      "MEHR ODER GLEICH": "ʬoperatorʬgreater_or_equals",
      "ES SEI DENN": "ʬunlessʬ",
      SOLL: "ʬconstraintʬmust",
      "NICHT EXISTIERT": "ʬoperatorʬnot_exists",
      HÖHER: "ʬoperatorʬgreater_than"
    },
    operators: {
      AT_LEAST_ONE_OF: "Array",
      IS_BETWEEN: "Unknown",
      EXISTS: "Array",
      ONE_OF: "Array",
      CONTAINS: "String",
      NOT_EXISTS: "Array",
      GREATER_THAN: "Decimal",
      LESS_OR_EQUALS: "Decimal",
      EQUALS: "Object",
      IS: "Object",
      NOT_EMPTY: "String",
      ALL_OF: "Array",
      EMPTY: "String",
      GREATER_OR_EQUALS: "Decimal",
      NONE_OF: "Array",
      NOT_EQUALS: "Object",
      SUM_OF: "String",
      LESS_THAN: "Decimal"
    }
  };

  constructor(fullOvDocument: boolean) {
    this.mockAxios();

    const socket: rpc.IWebSocket = this.getDummySocket();
    const reader = new rpc.WebSocketMessageReader(socket);
    const writer = new rpc.WebSocketMessageWriter(socket);
    this.connection = createConnection(reader, writer);
    this.server = new OvServer(this.connection);

    if (!fullOvDocument) {
      this.server.ovDocuments.addOrOverrideOvDocument(
        new OvDocument([], [], this.server.getAliasHelper(), "test.ov")
      );
    } else {
      this.server.getAliasHelper().$aliases = this.getAliases();
      this.server.getAliasHelper().$operators = this.getOperators();

      this.server.schema.dataProperties = [
        { name: "Einkaufsliste.Preis", type: "Decimal" },
        { name: "Preis", type: "Decimal" },
        { name: "Einkaufsliste", type: "Object" }
      ];
      this.server.schema.complexData = [
        { parent: "Einkaufsliste", child: "Preis" }
      ];

      const document = new OvDocument(
        this.getCorrectParseResult().$scopes,
        this.getCorrectParseResult().$declarations,
        this.server.getAliasHelper(),
        "test.ov"
      );
      this.server.ovDocuments.addOrOverrideOvDocument(document);
    }
  }

  public mockEmptyCode(): ICodeResponse {
    const json: ICodeResponse = {
      implementationResult: "",
      frameworkResult: ""
    };

    return json;
  }

  public mockLintingResponseWithEmptyMainAst(): LintingResponse {
    const json = {
      mainAstNode: {
        scopes: [],
        declarations: []
      },
      schema: {
        dataProperties: [],
        complexData: []
      }
    };

    const response: LintingResponse = plainToClass(LintingResponse, json);
    return response;
  }

  public mockEmptyLintingResponse(): LintingResponse {
    const json = {
      mainAstNode: undefined,
      schema: {
        dataProperties: [],
        complexData: []
      }
    };

    const response: LintingResponse = plainToClass(LintingResponse, json);

    return response;
  }

  public mockNotEmptyLintingResponse(): LintingResponse {
    const schema: ISchemaType = {
      dataProperties: [
        {
          name: "Alter",
          type: "Decimal"
        }
      ],
      complexData: [
        {
          parent: "Einkaufsliste",
          child: "Preis"
        }
      ]
    };
    const response: LintingResponse = new LintingResponse(
      this.getCorrectParseResult(),
      schema
    );

    const errors: LintingError[] = [
      new LintingError("Hard error!", IndexRange.create(0, 0, 1, 44))
    ];
    response.$errors = errors;

    return response;
  }

  public mockAxios(): void {
    this.mockAdapter
      .onPost("http://localhost:31057")
      .reply(200, this.mockEmptyCode());
    this.mockAdapter
      .onPost("http://localhost:31057/aliases")
      .reply(200, this.getRestAliases());
    this.mockAdapter
      .onPost("http://localhost:31057/linting")
      .reply(200, this.mockEmptyLintingResponse());
    this.mockAdapter
      .onPost("http://localhost:31057/completion")
      .reply(200, this.getCorrectCompletionResponse());
  }

  public resetAxios(): void {
    this.mockAdapter.reset();
  }

  public getAliases(): Map<string, string> {
    const input = new Map<string, string>();
    input.set("AND", AliasKey.AND);
    input.set("OR", AliasKey.OR);
    input.set("AS", AliasKey.AS);
    input.set("COMMENT", AliasKey.COMMENT);
    input.set("THEN", AliasKey.THEN);
    input.set("IF", AliasKey.IF);
    input.set("EQUALS", AliasKey.EQUALS);
    input.set("SUM OF", AliasKey.SUM_OF);
    input.set("OF", AliasKey.OF);
    input.set("^", "ʬarithmoperatorʬpower");
    return input;
  }

  public getOperators(): Map<string, string> {
    const input = new Map<string, string>();
    input.set("LESS_OR_EQUALS", "Decimal");
    input.set("SUM_OF", "String");
    input.set("NONE_OF", "Array");
    input.set("IS_BETWEEN", "Unknown");
    input.set("GREATER_THAN", "Decimal");
    input.set("GREATER_OR_EQUALS", "Decimal");
    input.set("CONTAINS", "String");
    input.set("IS", "Object");
    input.set("AT_LEAST_ONE_OF", "Array");
    input.set("LESS_THAN", "Decimal");
    input.set("ONE_OF", "Array");
    input.set("EQUALS", "Object");
    input.set("ALL_OF", "Array");
    input.set("EMPTY", "String");
    input.set("NOT_EMPTY", "String");
    input.set("NOT_EQUALS", "Object");
    input.set("EXISTS", "Array");
    input.set("NOT_EXISTS", "Array");
    return input;
  }

  public getDocumentText(): string {
    return `WENN das Alter des Bewerbers KLEINER 18 ist
DANN Sie müssen mindestens 18 Jahre alt sein

    das Alter des Bewerbers ist KLEINER 18
ALS Minderjährig

WENN der Bewerber Minderjährig ist
    UND sein Wohnort ist NICHT Dortmund
DANN Sie müssen mindestens 18 Jahre alt sein und aus Dortmund kommen

Kommentar das ist ein Kommentar

Alter`;
  }

  public getInorrectCompletionResponse(): CompletionResponse {
    return new CompletionResponse(null);
  }

  public getCorrectCompletionResponse(): CompletionResponse {
    return new CompletionResponse(this.getRuleNode());
  }

  public getRestAliases() {
    const aliases: AliasesWithOperators = plainToClass(
      AliasesWithOperators,
      this.aliasesJson
    );
    return aliases;
  }

  public getCorrectParseResult(): MainNode {
    const mainNodeJson = {
      declarations: [
        {
          name: "Minderjährig",
          dataType: "Boolean"
        }
      ],
      scopes: [
        {
          lines: [
            "WENN das Alter des Bewerbers KLEINER 18 ist",
            "DANN Sie müssen mindestens 18 Jahre alt sein"
          ],
          range: {
            start: {
              line: 0,
              column: 0
            },
            end: {
              line: 1,
              column: 44
            }
          },
          errorNode: {
            lines: ["Sie müssen mindestens 18 Jahre alt sein"],
            range: {
              start: {
                line: 1,
                column: 5
              },
              end: {
                line: 1,
                column: 44
              }
            },
            errorMessage: "Sie müssen mindestens 18 Jahre alt sein",
            type: "ActionErrorNode"
          },
          condition: {
            lines: ["das Alter des Bewerbers KLEINER 18 ist"],
            range: {
              start: {
                line: 0,
                column: 5
              },
              end: {
                line: 0,
                column: 43
              }
            },
            dataType: "Boolean",
            name: null,
            isStatic: false,
            connector: null,
            leftOperand: {
              lines: ["das Alter des Bewerbers"],
              range: {
                start: {
                  line: 0,
                  column: 5
                },
                end: {
                  line: 0,
                  column: 28
                }
              },
              dataType: "String",
              name: "das Alter des Bewerbers",
              isStatic: true,
              type: "OperandNode"
            },
            rightOperand: {
              lines: ["18"],
              range: {
                start: {
                  line: 0,
                  column: 37
                },
                end: {
                  line: 0,
                  column: 39
                }
              },
              dataType: "Decimal",
              name: "18",
              isStatic: true,
              type: "OperandNode"
            },
            operator: {
              lines: ["KLEINER"],
              range: {
                start: {
                  line: 0,
                  column: 29
                },
                end: {
                  line: 0,
                  column: 36
                }
              },
              dataType: "Boolean",
              validType: "Decimal",
              operator: "LESS_THAN",
              type: "Operator"
            },
            constrained: false,
            type: "OperationNode"
          },
          type: "RuleNode"
        },
        {
          lines: [
            "    das Alter des Bewerbers ist KLEINER 18",
            "ALS Minderjährig"
          ],
          range: {
            start: {
              line: 3,
              column: 0
            },
            end: {
              line: 4,
              column: 16
            }
          },
          value: {
            lines: ["das Alter des Bewerbers ist KLEINER 18"],
            range: {
              start: {
                line: 3,
                column: 4
              },
              end: {
                line: 3,
                column: 42
              }
            },
            dataType: "Boolean",
            name: null,
            isStatic: false,
            connector: null,
            leftOperand: {
              lines: ["das Alter des Bewerbers"],
              range: {
                start: {
                  line: 3,
                  column: 4
                },
                end: {
                  line: 3,
                  column: 27
                }
              },
              dataType: "String",
              name: "das Alter des Bewerbers",
              isStatic: true,
              type: "OperandNode"
            },
            rightOperand: {
              lines: ["18"],
              range: {
                start: {
                  line: 3,
                  column: 40
                },
                end: {
                  line: 3,
                  column: 42
                }
              },
              dataType: "Decimal",
              name: "18",
              isStatic: true,
              type: "OperandNode"
            },
            operator: {
              lines: ["KLEINER"],
              range: {
                start: {
                  line: 3,
                  column: 32
                },
                end: {
                  line: 3,
                  column: 39
                }
              },
              dataType: "Boolean",
              validType: "Decimal",
              operator: "LESS_THAN",
              type: "Operator"
            },
            constrained: false,
            type: "OperationNode"
          },
          nameNode: {
            lines: ["ALS Minderjährig"],
            range: {
              start: {
                line: 4,
                column: 0
              },
              end: {
                line: 4,
                column: 16
              }
            },
            name: "Minderjährig",
            type: "VariableNameNode"
          },
          type: "VariableNode"
        },
        {
          lines: ["Kommentar das ist ein Kommentar"],
          range: {
            start: {
              line: 10,
              column: 0
            },
            end: {
              line: 10,
              column: 31
            }
          },
          content: "das ist ein Kommentar",
          type: "CommentNode"
        },
        {
          lines: ["Alter"],
          range: {
            start: {
              line: 12,
              column: 0
            },
            end: {
              line: 12,
              column: 5
            }
          },
          content: {
            lines: ["Alter"],
            range: {
              start: {
                line: 12,
                column: 0
              },
              end: {
                line: 12,
                column: 5
              }
            },
            dataType: "String",
            name: "Alter",
            isStatic: true,
            type: "OperandNode"
          },
          type: "UnknownNode"
        }
      ],
      range: {
        start: {
          line: 0,
          column: 0
        },
        end: {
          line: 12,
          column: 5
        }
      }
    };
    return plainToClass(MainNode, mainNodeJson);
  }

  private getDummySocket(): rpc.IWebSocket {
    const webSocket: rpc.IWebSocket = {
      send: (content: string) => "",
      onMessage: (cb: (data: any) => void) => "",
      onError: (cb: (reason: any) => void) => "",
      onClose: (cb: (code: number, reason: string) => void) => "",
      dispose: () => ""
    };

    // For 100% Test-Coverage
    webSocket.send("");
    webSocket.dispose();

    return webSocket;
  }

  private getRuleNode(): RuleNode {
    const ruleNodeJson = {
      lines: [
        "WENN das Alter des Bewerbers KLEINER 18 ist",
        "DANN Sie müssen mindestens 18 Jahre alt sein"
      ],
      range: {
        start: {
          line: 0,
          column: 0
        },
        end: {
          line: 1,
          column: 44
        }
      },
      keywords: [
        {
          lines: ["WENN"],
          range: {
            start: {
              line: 0,
              column: 0
            },
            end: {
              line: 0,
              column: 4
            }
          },
          keywords: [],
          type: "KeywordNode"
        },
        {
          lines: ["DANN"],
          range: {
            start: {
              line: 1,
              column: 0
            },
            end: {
              line: 1,
              column: 4
            }
          },
          keywords: [],
          type: "KeywordNode"
        }
      ],
      errorNode: {
        lines: ["Sie müssen mindestens 18 Jahre alt sein"],
        range: {
          start: {
            line: 1,
            column: 5
          },
          end: {
            line: 1,
            column: 44
          }
        },
        keywords: [],
        errorMessage: "Sie müssen mindestens 18 Jahre alt sein",
        type: "ActionErrorNode"
      },
      condition: {
        lines: ["das Alter des Bewerbers KLEINER 18 ist"],
        range: {
          start: {
            line: 0,
            column: 5
          },
          end: {
            line: 0,
            column: 43
          }
        },
        keywords: [],
        dataType: "Boolean",
        name: null,
        isStatic: false,
        connector: null,
        leftOperand: {
          lines: ["das Alter des Bewerbers"],
          range: {
            start: {
              line: 0,
              column: 5
            },
            end: {
              line: 0,
              column: 28
            }
          },
          keywords: [],
          dataType: "String",
          name: "das Alter des Bewerbers",
          isStatic: true,
          type: "OperandNode"
        },
        rightOperand: {
          lines: ["18"],
          range: {
            start: {
              line: 0,
              column: 37
            },
            end: {
              line: 0,
              column: 39
            }
          },
          keywords: [],
          dataType: "Decimal",
          name: "18",
          isStatic: true,
          type: "OperandNode"
        },
        operator: {
          lines: ["KLEINER"],
          range: {
            start: {
              line: 0,
              column: 29
            },
            end: {
              line: 0,
              column: 36
            }
          },
          keywords: [],
          dataType: "Boolean",
          validType: "Decimal",
          operator: "LESS_THAN",
          type: "Operator"
        },
        constrained: false,
        type: "OperationNode"
      },
      type: "RuleNode"
    };

    return plainToClass(RuleNode, ruleNodeJson);
  }
}
