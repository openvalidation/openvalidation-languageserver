import { plainToClass } from 'class-transformer';
import 'jest';
import { CommentNode } from '../../src/data-model/syntax-tree/element/CommentNode';
import { ConnectedOperationNode } from '../../src/data-model/syntax-tree/element/operation/ConnectedOperationNode';
import { ArrayOperandNode } from '../../src/data-model/syntax-tree/element/operation/operand/ArrayOperandNode';
import { FunctionOperandNode } from '../../src/data-model/syntax-tree/element/operation/operand/FunctionOperandNode';
import { OperandNode } from '../../src/data-model/syntax-tree/element/operation/operand/OperandNode';
import { OperatorNode } from '../../src/data-model/syntax-tree/element/operation/operand/OperatorNode';
import { OperationNode } from '../../src/data-model/syntax-tree/element/operation/OperationNode';
import { RuleNode } from '../../src/data-model/syntax-tree/element/RuleNode';
import { VariableNode } from '../../src/data-model/syntax-tree/element/VariableNode';
import { MainNode } from '../../src/data-model/syntax-tree/MainNode';
import { Variable } from '../../src/data-model/syntax-tree/Variable';

describe('plainToClass Test, checks type inference of JSON-Schemas', () => {

    test('check type of MainNodeJson, expect MainNode', async () => {
        const actual = plainToClass(MainNode, mainNodeJson());
        const expectedType = MainNode;

        expect(actual).toBeInstanceOf(expectedType);
        for (const condition of actual.$declarations) {
            expect(condition).toBeInstanceOf(Variable);
        }

        for (const condition of actual.$scopes) {
            expect(condition).toBeInstanceOf(OperandNode);
        }
    });

    test('check type of OperandNodeJson, expect OperandNode', async () => {
        const actual = plainToClass(OperandNode, operandNodeJson());
        const expectedType = OperandNode;

        expect(actual).toBeInstanceOf(expectedType);
    });

    test('check type of an OperatorJson, expect OperatorNode', async () => {
        const actual = plainToClass(OperatorNode, operandNodeJson());
        const expectedType = OperatorNode;

        expect(actual).toBeInstanceOf(expectedType);
    });

    test('check type of an OperationJson, expect OperationNode', async () => {
        const actual = plainToClass(OperationNode, operationJson());
        const expectedType = OperationNode;

        expect(actual).toBeInstanceOf(expectedType);
        expect(actual.$operator).toBeInstanceOf(OperatorNode);
        expect(actual.$leftOperand).toBeInstanceOf(OperandNode);
        expect(actual.$rightOperand).toBeInstanceOf(OperandNode);
    });

    test('check type of another OperationJson, expect OperationNode', async () => {
        const actual = plainToClass(OperationNode, secondOperationJson());
        const expectedType = OperationNode;

        expect(actual).toBeInstanceOf(expectedType);
        expect(actual.$operator).toBeInstanceOf(OperatorNode);
        expect(actual.$leftOperand).toBeInstanceOf(OperandNode);
        expect(actual.$rightOperand).toBeInstanceOf(OperandNode);
    });

    test('check type of an ConnectedOperationJson, expect ConnectedOperationNode', async () => {
        const actual = plainToClass(ConnectedOperationNode, connectedOperationJson());
        const expectedType = ConnectedOperationNode;

        expect(actual).toBeInstanceOf(expectedType);

        for (const condition of actual.getConditions()) {
            expect(condition).toBeInstanceOf(OperationNode);
            expect((condition as OperationNode).$operator).toBeInstanceOf(OperatorNode);
            expect((condition as OperationNode).$leftOperand).toBeInstanceOf(OperandNode);
            expect((condition as OperationNode).$rightOperand).toBeInstanceOf(OperandNode);
        }
    });

    test('check type of an CommentJson, expect CommendNode', async () => {
        const actual = plainToClass(CommentNode, commentJson());
        const expectedType = CommentNode;

        expect(actual).toBeInstanceOf(expectedType);
    });

    test('check type of an VariableJson, expect VariableNode', async () => {
        const actual = plainToClass(VariableNode, variableJson());
        const expectedType = VariableNode;

        expect(actual).toBeInstanceOf(expectedType);
        expect(actual.getValue()).toBeInstanceOf(OperationNode);
        expect((actual.getValue() as OperationNode).$operator).toBeInstanceOf(OperatorNode);
        expect((actual.getValue() as OperationNode).$rightOperand).toBeInstanceOf(OperandNode);
        expect((actual.getValue() as OperationNode).$leftOperand).toBeInstanceOf(OperandNode);
    });

    test('check type of an RuleJson, expect RuleNode', async () => {
        const actual = plainToClass(RuleNode, ruleJson());
        const expectedType = RuleNode;

        expect(actual).toBeInstanceOf(expectedType);
        expect(actual.getCondition()).toBeInstanceOf(OperationNode);
        expect((actual.getCondition() as OperationNode).$operator).toBeInstanceOf(OperatorNode);
        expect((actual.getCondition() as OperationNode).$rightOperand).toBeInstanceOf(OperandNode);
        expect((actual.getCondition() as OperationNode).$leftOperand).toBeInstanceOf(OperandNode);
    });

    test('check type of an FunctionJson, expect FunctionOperandNode', async () => {
        const actual = plainToClass(FunctionOperandNode, functionJson());
        const expectedType = FunctionOperandNode;

        expect(actual).toBeInstanceOf(expectedType);

        for (const parameter of actual.$parameters) {
            expect(parameter).toBeInstanceOf(OperandNode);
        }
    });

    test('check type of an ArrayJson, expect ArrayOperandNode', async () => {
        const actual = plainToClass(ArrayOperandNode, arrayJson());
        const expectedType = ArrayOperandNode;

        expect(actual).toBeInstanceOf(expectedType);

        for (const parameter of actual.$items) {
            expect(parameter).toBeInstanceOf(OperandNode);
        }
    });

    //#region JSON-Definitions
    function mainNodeJson() {
        return {
            declarations: [
                {
                    name: 'Hello',
                    dataType: 'Test'
                }
            ],
            scopes: [
                operandNodeJson()
            ],
            range: {
                start: {
                    line: 0,
                    column: 42
                },
                end: {
                    line: 0,
                    column: 55
                }
            }
        };
    }

    function operandNodeJson() {
        return {
            lines: [
                'der Bewerber Minderjährig'
            ],
            range: {
                start: {
                    line: 0,
                    column: 5
                },
                end: {
                    line: 0,
                    column: 30
                }
            },
            dataType: 'String',
            name: 'der Bewerber Minderjährig',
            type: 'OperandNode'
        };
    }

    function secondOperandJson() {
        return {
            lines: [
                'sein Wohnort'
            ],
            range: {
                start: {
                    line: 0,
                    column: 42
                },
                end: {
                    line: 0,
                    column: 55
                }
            },
            dataType: 'String',
            name: 'Wohnort',
            type: 'OperandNode'
        };
    }

    function operatorJson() {
        return {
            lines: [
                ' ist nicht '
            ],
            range: {
                start: {
                    line: 0,
                    column: 56
                },
                end: {
                    line: 0,
                    column: 65
                }
            },
            dataType: 'Boolean',
            validType: 'Object',
            operator: 'NOT_EQUALS',
            type: 'OperatorNode'
        };
    }

    function operationJson() {
        return {
            lines: [
                'der Bewerber Minderjährig ist'
            ],
            range: {
                start: {
                    line: 0,
                    column: 5
                },
                end: {
                    line: 0,
                    column: 34
                }
            },
            connector: null,
            constrained: false,
            dataType: 'Boolean',
            name: null,
            leftOperand: operandNodeJson(),
            rightOperand: secondOperandJson(),
            operator: operatorJson(),
            type: 'OperationNode'
        };
    }

    function secondOperationJson() {
        return {
            lines: [
                'oder sein Wohnort ist Dortmund)'
            ],
            range: {
                start: {
                    line: 0,
                    column: 75
                },
                end: {
                    line: 0,
                    column: 106
                }
            },
            dataType: 'Boolean',
            name: null,
            connector: null,
            constrained: false,
            leftOperand: {
                lines: [
                    'sein Wohnort'
                ],
                range: {
                    start: {
                        line: 0,
                        column: 80
                    },
                    end: {
                        line: 0,
                        column: 92
                    }
                },
                dataType: 'String',
                name: 'Wohnort',
                type: 'OperandNode'
            },
            rightOperand: {
                lines: [
                    'Dortmund)'
                ],
                range: {
                    start: {
                        line: 0,
                        column: 97
                    },
                    end: {
                        line: 0,
                        column: 106
                    }
                },
                dataType: 'String',
                name: 'Dortmund',
                type: 'OperandNode'
            },
            operator: {
                lines: [
                    ' ist '
                ],
                range: {
                    start: {
                        line: 0,
                        column: 93
                    },
                    end: {
                        line: 0,
                        column: 96
                    }
                },
                dataType: 'Boolean',
                validType: 'Object',
                operator: 'EQUALS',
                type: 'Operator'
            },
            type: 'OperationNode'
        };
    }

    function connectedOperationJson() {
        return {
            lines: [
                'der Bewerber Minderjährig ist    und (sein Wohnort ist nicht Dortmund oder sein Wohnort ist Dortmund)'
            ],
            range: {
                start: {
                    line: 0,
                    column: 5
                },
                end: {
                    line: 0,
                    column: 106
                }
            },
            dataType: 'Boolean',
            name: null,
            conditions: [
                operationJson(),
                secondOperationJson()
            ],
            connector: null,
            type: 'ConnectedOperationNode'
        };
    }

    function commentJson() {
        return {
            lines: [
                'Kommentar das ist ein Test'
            ],
            range: {
                start: {
                    line: 0,
                    column: 0
                },
                end: {
                    line: 0,
                    column: 26
                }
            },
            content: 'das ist ein Test',
            type: 'CommentNode'
        };
    }

    function variableJson() {
        return {
            lines: [
                'Alter kleiner 20 ALS test'
            ],
            range: {
                start: {
                    line: 0,
                    column: 0
                },
                end: {
                    line: 0,
                    column: 25
                }
            },
            name: 'test',
            value: {
                lines: [
                    'Alter kleiner 20'
                ],
                range: {
                    start: {
                        line: 0,
                        column: 0
                    },
                    end: {
                        line: 0,
                        column: 16
                    }
                },
                dataType: 'Boolean',
                name: null,
                leftOperand: {
                    lines: [
                        'Alter'
                    ],
                    range: {
                        start: {
                            line: 0,
                            column: 0
                        },
                        end: {
                            line: 0,
                            column: 5
                        }
                    },
                    dataType: 'Decimal',
                    name: 'Alter',
                    type: 'OperandNode'
                },
                rightOperand: {
                    lines: [
                        '20'
                    ],
                    range: {
                        start: {
                            line: 0,
                            column: 14
                        },
                        end: {
                            line: 0,
                            column: 16
                        }
                    },
                    dataType: 'Decimal',
                    name: '20.0',
                    type: 'OperandNode'
                },
                operator: {
                    lines: [
                        ' kleiner '
                    ],
                    range: {
                        start: {
                            line: 0,
                            column: 6
                        },
                        end: {
                            line: 0,
                            column: 13
                        }
                    },
                    dataType: 'Boolean',
                    validType: 'Decimal',
                    operator: 'LESS_THAN',
                    type: 'Operator'
                },
                type: 'OperationNode'
            },
            type: 'VariableNode'
        };
    }

    function ruleJson() {
        return {
            lines: [
                'Wenn Alter kleiner 20 Dann hallo'
            ],
            range: {
                start: {
                    line: 0,
                    column: 0
                },
                end: {
                    line: 0,
                    column: 32
                }
            },
            errorMessage: 'hallo',
            condition: {
                lines: [
                    'Alter kleiner 20'
                ],
                range: {
                    start: {
                        line: 0,
                        column: 5
                    },
                    end: {
                        line: 0,
                        column: 21
                    }
                },
                dataType: 'Boolean',
                name: null,
                leftOperand: {
                    lines: [
                        'Alter'
                    ],
                    range: {
                        start: {
                            line: 0,
                            column: 5
                        },
                        end: {
                            line: 0,
                            column: 10
                        }
                    },
                    dataType: 'Decimal',
                    name: 'Alter',
                    type: 'OperandNode'
                },
                rightOperand: {
                    lines: [
                        '20'
                    ],
                    range: {
                        start: {
                            line: 0,
                            column: 19
                        },
                        end: {
                            line: 0,
                            column: 21
                        }
                    },
                    dataType: 'Decimal',
                    name: '20.0',
                    type: 'OperandNode'
                },
                operator: {
                    lines: [
                        ' kleiner '
                    ],
                    range: {
                        start: {
                            line: 0,
                            column: 11
                        },
                        end: {
                            line: 0,
                            column: 18
                        }
                    },
                    dataType: 'Boolean',
                    validType: 'Decimal',
                    operator: 'LESS_THAN',
                    type: 'Operator'
                },
                type: 'OperationNode'
            },
            type: 'RuleNode'
        };
    }

    function functionJson() {
        return {
            lines: [
                'Summe von Einkaufsliste.Preis'
            ],
            range: {
                start: {
                    line: 0,
                    column: 0
                },
                end: {
                    line: 0,
                    column: 29
                }
            },
            dataType: 'Decimal',
            name: 'SUM_OF',
            parameters: [
                {
                    lines: [
                        'Einkaufsliste.Preis'
                    ],
                    range: {
                        start: {
                            line: 0,
                            column: 10
                        },
                        end: {
                            line: 0,
                            column: 29
                        }
                    },
                    dataType: 'Decimal',
                    name: 'Einkaufsliste.Preis',
                    type: 'OperandNode'
                }
            ],
            type: 'FunctionOperandNode'
        };
    }

    function arrayJson() {
        return {
            lines: [
                'Günther, Gans'
            ],
            range: {
                start: {
                    line: 0,
                    column: 14
                },
                end: {
                    line: 0,
                    column: 27
                }
            },
            dataType: 'String',
            name: null,
            items: [
                {
                    lines: [
                        'Günther'
                    ],
                    range: {
                        start: {
                            line: 0,
                            column: 14
                        },
                        end: {
                            line: 0,
                            column: 21
                        }
                    },
                    dataType: 'String',
                    name: 'Günther',
                    type: 'OperandNode'
                },
                {
                    lines: [
                        'Gans'
                    ],
                    range: {
                        start: {
                            line: 0,
                            column: 23
                        },
                        end: {
                            line: 0,
                            column: 27
                        }
                    },
                    dataType: 'String',
                    name: 'Gans',
                    type: 'OperandNode'
                }
            ],
            type: 'ArrayOperandNode'
        };
    }

    //#endregion
});
