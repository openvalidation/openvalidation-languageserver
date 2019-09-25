import * as rpc from '@sourcegraph/vscode-ws-jsonrpc';
import axios from "axios";
import MockAdapter from 'axios-mock-adapter';
import { plainToClass } from "class-transformer";
import { createConnection } from "vscode-languageserver";
import { AliasKey } from "../src/aliases/AliasKey";
import { OvDocument } from "../src/data-model/ov-document/OvDocument";
import { OvServer } from "../src/OvServer";
import { CompletionProvider } from "../src/provider/CompletionProvider";
import { DocumentActionProvider } from "../src/provider/DocumentActionProvider";
import { DocumentSymbolProvider } from "../src/provider/DocumentSymbolProvider";
import { FoldingRangesProvider } from "../src/provider/FoldingRangesProvider";
import { FormattingProvider } from "../src/provider/FormattingProvider";
import { GotoDefinitionProvider } from "../src/provider/GotoDefinitionProvider";
import { HoverProvider } from "../src/provider/HoverProvider";
import { OvSyntaxNotifier } from "../src/provider/OvSyntaxNotifier";
import { RenameProvider } from "../src/provider/RenameProvider";
import { CommentNode } from "../src/rest-interface/intelliSenseTree/element/CommentNode";
import { RuleNode } from "../src/rest-interface/intelliSenseTree/element/RuleNode";
import { VariableNode } from "../src/rest-interface/intelliSenseTree/element/VariableNode";
import { MainNode } from "../src/rest-interface/intelliSenseTree/MainNode";
import { CodeResponse } from "../src/rest-interface/response/CodeResponse";
import { LintingResponse } from "../src/rest-interface/response/LintingResponse";
import { CompletionResponse } from '../src/rest-interface/response/CompletionResponse';

/**
 * Class that provides some useful classes and that mocks the Axios-Rest-Api
 *
 * @export
 * @class TestInitializer
 */
export class TestInitializer {
    constructor(fullOvDocument: boolean) {
        this.mockAxios();

        var socket: rpc.IWebSocket = this.getDummySocket();
        const reader = new rpc.WebSocketMessageReader(socket);
        const writer = new rpc.WebSocketMessageWriter(socket);
        const connection = createConnection(reader, writer);
        this._server = new OvServer(connection);

        if (!fullOvDocument) {
            this._server.ovDocuments.addOrOverrideOvDocument("test.ov", new OvDocument([], [], this._server.aliasHelper));
        } else {
            this._server.aliasHelper.updateAliases(this.getAliases());
            this._server.aliasHelper.updateOperators(this.getOperators());
            var document = new OvDocument(this.getCorrectParseResult().getScopes(), [], this._server.aliasHelper);
            this._server.ovDocuments.addOrOverrideOvDocument("test.ov", document);
        }
    }

    private _server: OvServer;

    private getDummySocket(): rpc.IWebSocket {
        var webSocket: rpc.IWebSocket = {
            send: (content: string) => "",
            onMessage: (cb: (data: any) => void) => "",
            onError: (cb: (reason: any) => void) => "",
            onClose: (cb: (code: number, reason: string) => void) => "",
            dispose: () => ""
        }

        // For 100% Test-Coverage
        webSocket.send("");
        webSocket.dispose();

        return webSocket;
    }

    public mockEmptyCode(): CodeResponse {
        var json: CodeResponse = {
            variableNames: [],
            staticStrings: [],
            ruleErrors: [],
            implementationResult: "",
            frameworkResult: ""
        };

        return json;
    }

    public mockEmptyLintingResponse(): LintingResponse {
        var json = {
            staticStrings: [],
            mainAstNode: undefined,
            schema: {
                dataProperties: [],
                complexData: []
            }
        };
        
        var response: LintingResponse = plainToClass(LintingResponse, json);

        return response;
    }

    /**
     *
     *
     * @returns {ApiResponseSuccess}
     * @memberof TestInitializer
     */
    public mockNotEmptyLintingResponse(): LintingResponse {
        var json = {
            staticStrings: ["Dortmund"],
            mainAstNode: new MainNode(),
            schema: {
                dataProperties: [{
                    name: "Alter",
                    type: "Decimal"
                }],
                complexData: [{
                    parent: "Einkaufsliste",
                    child: "Preis"
                }]
            }
        };

        var response: LintingResponse = plainToClass(LintingResponse, json);

        return response;
    }

    public mockAxios(): void {
        var mockAdapter = new MockAdapter(axios);
        mockAdapter.onPost('http://localhost:31057').reply(200, this.mockEmptyCode());
        mockAdapter.onPost('http://localhost:31057/aliases').reply(200, this.getAliases());
        mockAdapter.onPost('http://localhost:31057/linting').reply(200, this.mockEmptyLintingResponse());
        mockAdapter.onPost('http://localhost:31057/completion').reply(200, this.getCorrectCompletionResponse());
    }

    public get server(): OvServer {
        return this._server;
    }

    public get completionProvider(): CompletionProvider {
        return new CompletionProvider(this.server);
    }

    public get documentActionProvider(): DocumentActionProvider {
        return new DocumentActionProvider(this.server);
    }

    public get documentSymbolProvider(): DocumentSymbolProvider {
        return new DocumentSymbolProvider(this.server);
    }

    public get foldingRangesProvider(): FoldingRangesProvider {
        return new FoldingRangesProvider(this.server);
    }

    public get formattingProvider(): FormattingProvider {
        return new FormattingProvider(this.server);
    }

    public get gotoDefinitionProvider(): GotoDefinitionProvider {
        return new GotoDefinitionProvider(this.server);
    }

    public get hoverProvider(): HoverProvider {
        return new HoverProvider(this.server);
    }

    public get renameProvider(): RenameProvider {
        return new RenameProvider(this.server);
    }

    public get ovSyntaxNotifier(): OvSyntaxNotifier {
        return new OvSyntaxNotifier(this.server);
    }

    public getAliases(): Map<string, string> {
        var input = new Map<string, string>();
        input.set("AND", AliasKey.AND);
        input.set("OR", AliasKey.OR);
        input.set("AS", AliasKey.AS);
        input.set("COMMENT", AliasKey.COMMENT);
        input.set("THEN", AliasKey.THEN);
        input.set("IF", AliasKey.IF);
        input.set("EQUALS", AliasKey.EQUALS);
        return input;
    }

    public getOperators(): Map<string, string> {
        var input = new Map<string, string>();
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

Kommentar das ist ein Kommentar`
    }

    public getCorrectParseResult(): MainNode {
        var json = {
            "scope": [],
            "errors": []
        };
        var mainNode: MainNode = plainToClass(MainNode, json);

        var ruleNode: RuleNode = plainToClass(RuleNode, this.ruleJson);
        var variableNode: VariableNode = plainToClass(VariableNode, this.variableNode);
        var complexRuleNode: RuleNode = plainToClass(RuleNode, this.complexRuleNode);
        var commentNode: CommentNode = plainToClass(CommentNode, this.commentNode);
        mainNode.setScopes([ruleNode, complexRuleNode, variableNode, commentNode]);

        return mainNode;
    }

    public getCorrectCompletionResponse(): CompletionResponse {
        var ruleNode: RuleNode = plainToClass(RuleNode, this.ruleJson);
        return new CompletionResponse(ruleNode);
    }

    private ruleJson = {
        "lines": [
            "WENN das Alter des Bewerbers KLEINER 18 ist",
            "DANN Sie müssen mindestens 18 Jahre alt sein"
        ],
        "range": {
            "start": {
                "line": 0,
                "column": 0
            },
            "end": {
                "line": 1,
                "column": 44
            }
        },
        "errorNode": {
            "lines": [
                "DANN Sie müssen mindestens 18 Jahre alt sein"
            ],
            "range": {
                "start": {
                    "line": 1,
                    "column": 0
                },
                "end": {
                    "line": 1,
                    "column": 44
                }
            },
            "errorMessage": "Sie müssen mindestens 18 Jahre alt sein",
            "type": "ActionErrorNode"
        },
        "condition": {
            "lines": [
                "das Alter des Bewerbers KLEINER 18 ist"
            ],
            "range": {
                "start": {
                    "line": 0,
                    "column": 5
                },
                "end": {
                    "line": 0,
                    "column": 43
                }
            },
            "dataType": "Boolean",
            "name": null,
            "leftOperand": {
                "lines": [
                    "das Alter des Bewerbers"
                ],
                "range": {
                    "start": {
                        "line": 0,
                        "column": 5
                    },
                    "end": {
                        "line": 0,
                        "column": 28
                    }
                },
                "dataType": "Decimal",
                "name": "Alter",
                "type": "OperandNode"
            },
            "rightOperand": {
                "lines": [
                    "18"
                ],
                "range": {
                    "start": {
                        "line": 0,
                        "column": 37
                    },
                    "end": {
                        "line": 0,
                        "column": 39
                    }
                },
                "dataType": "Decimal",
                "name": "18.0",
                "type": "OperandNode"
            },
            "operator": {
                "lines": [
                    " KLEINER "
                ],
                "range": {
                    "start": {
                        "line": 0,
                        "column": 28
                    },
                    "end": {
                        "line": 0,
                        "column": 37
                    }
                },
                "dataType": "Boolean",
                "operator": "LESS_THAN",
                "type": "Operator"
            },
            "constrained": false,
            "type": "OperationNode"
        },
        "type": "RuleNode"
    };

    private commentNode = {
        "lines": [
            "Kommentar das ist ein Kommentar"
        ],
        "range": {
            "start": {
                "line": 9,
                "column": 0
            },
            "end": {
                "line": 9,
                "column": 31
            }
        },
        "content": "das ist ein Kommentar",
        "type": "CommentNode"
    };

    private complexRuleNode = {
        "lines": [
            "WENN der Bewerber Minderjährig ist",
            "    UND sein Wohnort ist NICHT Dortmund",
            "DANN Sie müssen mindestens 18 Jahre alt sein und aus Dortmund kommen"
        ],
        "range": {
            "start": {
                "line": 6,
                "column": 0
            },
            "end": {
                "line": 8,
                "column": 68
            }
        },
        "errorNode": {
            "lines": [
                "DANN Sie müssen mindestens 18 Jahre alt sein und aus Dortmund kommen"
            ],
            "range": {
                "start": {
                    "line": 8,
                    "column": 0
                },
                "end": {
                    "line": 8,
                    "column": 68
                }
            },
            "errorMessage": "Sie müssen mindestens 18 Jahre alt sein und aus Dortmund kommen",
            "type": "ActionErrorNode"
        },
        "condition": {
            "lines": [
                "der Bewerber Minderjährig ist",
                "    UND sein Wohnort ist NICHT Dortmund"
            ],
            "range": {
                "start": {
                    "line": 6,
                    "column": 5
                },
                "end": {
                    "line": 7,
                    "column": 39
                }
            },
            "dataType": "Boolean",
            "name": null,
            "conditions": [
                {
                    "lines": [
                        "der Bewerber Minderjährig ist"
                    ],
                    "range": {
                        "start": {
                            "line": 6,
                            "column": 5
                        },
                        "end": {
                            "line": 6,
                            "column": 34
                        }
                    },
                    "dataType": "Boolean",
                    "name": null,
                    "leftOperand": {
                        "lines": [
                            "der Bewerber Minderjährig"
                        ],
                        "range": {
                            "start": {
                                "line": 6,
                                "column": 5
                            },
                            "end": {
                                "line": 6,
                                "column": 30
                            }
                        },
                        "dataType": "Boolean",
                        "name": "Minderjährig",
                        "type": "OperandNode"
                    },
                    "rightOperand": {
                        "lines": [],
                        "range": null,
                        "dataType": "Boolean",
                        "name": "true",
                        "type": "OperandNode"
                    },
                    "operator": {
                        "lines": [
                            " ist"
                        ],
                        "range": {
                            "start": {
                                "line": 6,
                                "column": 30
                            },
                            "end": {
                                "line": 6,
                                "column": 34
                            }
                        },
                        "dataType": "Boolean",
                        "operator": "EQUALS",
                        "type": "Operator"
                    },
                    "constrained": false,
                    "type": "OperationNode"
                },
                {
                    "lines": [
                        "UND sein Wohnort ist NICHT Dortmund"
                    ],
                    "range": {
                        "start": {
                            "line": 7,
                            "column": 4
                        },
                        "end": {
                            "line": 7,
                            "column": 39
                        }
                    },
                    "dataType": "Boolean",
                    "name": null,
                    "leftOperand": {
                        "lines": [
                            "sein Wohnort"
                        ],
                        "range": {
                            "start": {
                                "line": 7,
                                "column": 8
                            },
                            "end": {
                                "line": 7,
                                "column": 20
                            }
                        },
                        "dataType": "String",
                        "name": "Wohnort",
                        "type": "OperandNode"
                    },
                    "rightOperand": {
                        "lines": [
                            "Dortmund"
                        ],
                        "range": {
                            "start": {
                                "line": 7,
                                "column": 31
                            },
                            "end": {
                                "line": 7,
                                "column": 39
                            }
                        },
                        "dataType": "String",
                        "name": "Dortmund",
                        "type": "OperandNode"
                    },
                    "operator": {
                        "lines": [
                            " ist NICHT "
                        ],
                        "range": {
                            "start": {
                                "line": 7,
                                "column": 20
                            },
                            "end": {
                                "line": 7,
                                "column": 31
                            }
                        },
                        "dataType": "Boolean",
                        "operator": "NOT_EQUALS",
                        "type": "Operator"
                    },
                    "constrained": false,
                    "type": "OperationNode"
                }
            ],
            "type": "ConnectedOperationNode"
        },
        "type": "RuleNode"
    };

    private variableNode = {
        "lines": [
            "    das Alter des Bewerbers ist KLEINER 18",
            "ALS Minderjährig"
        ],
        "range": {
            "start": {
                "line": 3,
                "column": 0
            },
            "end": {
                "line": 4,
                "column": 16
            }
        },
        "nameNode": {
            "lines": [
                "ALS Minderjährig"
            ],
            "range": {
                "start": {
                    "line": 4,
                    "column": 0
                },
                "end": {
                    "line": 4,
                    "column": 16
                }
            },
            "name": "Minderjährig",
            "type": "VariableNameNode"
        },
        "value": {
            "lines": [
                "das Alter des Bewerbers ist KLEINER 18"
            ],
            "range": {
                "start": {
                    "line": 3,
                    "column": 4
                },
                "end": {
                    "line": 3,
                    "column": 42
                }
            },
            "dataType": "Boolean",
            "name": null,
            "leftOperand": {
                "lines": [
                    "das Alter des Bewerbers"
                ],
                "range": {
                    "start": {
                        "line": 3,
                        "column": 4
                    },
                    "end": {
                        "line": 3,
                        "column": 27
                    }
                },
                "dataType": "Decimal",
                "name": "Alter",
                "type": "OperandNode"
            },
            "rightOperand": {
                "lines": [
                    "18"
                ],
                "range": {
                    "start": {
                        "line": 3,
                        "column": 40
                    },
                    "end": {
                        "line": 3,
                        "column": 42
                    }
                },
                "dataType": "Decimal",
                "name": "18.0",
                "type": "OperandNode"
            },
            "operator": {
                "lines": [
                    " ist KLEINER "
                ],
                "range": {
                    "start": {
                        "line": 3,
                        "column": 27
                    },
                    "end": {
                        "line": 3,
                        "column": 40
                    }
                },
                "dataType": "Boolean",
                "operator": "LESS_THAN",
                "type": "Operator"
            },
            "constrained": false,
            "type": "OperationNode"
        },
        "type": "VariableNode"
    };
}
