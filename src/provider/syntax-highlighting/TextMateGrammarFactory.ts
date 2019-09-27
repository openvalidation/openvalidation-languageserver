import { StringHelper } from "../../helper/StringHelper";
import { OvServer } from "../../OvServer";
import { Pattern, TextMateJson } from "./TextMateJson";
import { TextMateParameter } from "./TextMateParameter";
import { LintingResponse } from "../../rest-interface/response/LintingResponse";
// import { RuleNode } from "src/data-model/syntax-tree/element/RuleNode";
// import { OperationNode } from "src/data-model/syntax-tree/element/operation/OperationNode";

export interface IToken {
    startIndex: number;
    scopes: string;
}

export class TextMateGrammarFactory {

    private emptyLineRegex: string = '^[ \t]*$';

    constructor() { }

    /**
     * Generates and returns the TextMateGrammar
     *
     * @private
     * @param {GeneralApiResponse} apiResponse response that holds relevant data like variableNames
     * @param {JSON} schema schema of the parsing-process
     * @returns {object} JSON-Object of the TextMate-Grammar
     * @memberof OvSyntaxNotifier
     */
    public generateTextMateGrammar(apiResponse: LintingResponse, server: OvServer): any {// IToken[][] {
        var parameter: TextMateParameter = new TextMateParameter(apiResponse, server);
        // return this.tokenizeNodes(apiResponse);
        var returnPar = this.fillTextMateGrammar(parameter);
        console.log(returnPar);
        return returnPar;
    }

    // One token-list per line
    // private tokenizeNodes(apiResponse: LintingResponse): IToken[][] {
    //     // var scopes = apiResponse.getMainAstNode().getScopes();
    //     // var scope = scopes[0] as RuleNode;

    //     // var condition = scope!.getCondition() as OperationNode;

    //     // var first: IToken = {
    //     //     scopes: "comment",
    //     //     startIndex: 0
    //     // }
    //     // var leftOperand: IToken = {
    //     //     scopes: "identifier",
    //     //     startIndex: condition!.getRightOperand()!.getRange().getStart().getColumn()
    //     // }
    //     // var filler: IToken = {
    //     //     scopes: "text",
    //     //     startIndex: condition!.getRightOperand()!.getRange().getEnd().getColumn()
    //     // }
    //     // var operator: IToken = {
    //     //     scopes: "keyword",
    //     //     startIndex: condition!.getOperator()!.getRange().getStart().getColumn()
    //     // }
    //     // var secFiller: IToken = {
    //     //     scopes: "text",
    //     //     startIndex: condition!.getOperator()!.getRange().getEnd().getColumn()
    //     // }
    //     // var rightOperator: IToken = {
    //     //     scopes: "keyword",
    //     //     startIndex: condition!.getLeftOperand()!.getRange().getStart().getColumn()
    //     // }
    //     // var thirdFiller: IToken = {
    //     //     scopes: "text",
    //     //     startIndex: condition!.getLeftOperand()!.getRange().getEnd().getColumn()
    //     // }

    //     // var firstLine = [first, leftOperand, filler, operator, secFiller, rightOperator, thirdFiller];
    //     // firstLine.sort((a: IToken, b: IToken) => {
    //     //     return a.startIndex - b.startIndex;
    //     // });


    //     var tmp = [firstLine,
    //         // [
    //         //     {
    //         //         scopes: "keyword",
    //         //         startIndex: 0
    //         //     },
    //         //     {
    //         //         scopes: "variable.parameter.name.ov",
    //         //         startIndex: 9
    //         //     },
    //         // ],
    //         // [
    //         //     {
    //         //         scopes: "keyword",
    //         //         startIndex: 0
    //         //     },
    //         //     {
    //         //         scopes: "variable.parameter.name.ov",
    //         //         startIndex: 9
    //         //     }
    //         // ],
    //         // [
    //         //     {
    //         //         scopes: "keyword",
    //         //         startIndex: 0
    //         //     },
    //         //     {
    //         //         scopes: "variable.parameter.name.ov",
    //         //         startIndex: 9
    //         //     }
    //         // ]
    //     ];

    //     console.log(tmp);
    //     return tmp;
    // }


    private fillTextMateGrammar(parameter: TextMateParameter) {
        var json: TextMateJson = {
            scopeName: "source.ov",
            name: "openVALIDATION",
            fileTypes: ['ov'],
            patterns: this.genericPatterns()
        };

        // Comments
        json.patterns.push({
            comment: 'standard-comment',
            name: 'comment.line',
            begin: '(?i)(' + parameter.commentKeyword + ')',
            end: this.emptyLineRegex
        });

        // Error-Message / Action
        json.patterns.push({
            comment: 'pattern for actions in a rule',
            name: 'string.action.ov',
            begin: '(?<=((?i)(' + parameter.thenKeyword + ')))',
            end: this.emptyLineRegex
        });

        // Variables
        if (parameter.identifier.length > 0) {
            json.patterns.push({
                comment: 'pattern for identifier (variables)',
                name: 'variable.parameter.name.ov',
                match: StringHelper.getCaseUnsensitiveOredRegExForWords(...parameter.identifier)
            });
        }

        // Static Strings
        if (parameter.staticStrings.length > 0) {
            json.patterns.push({
                comment: 'pattern for static strings',
                name: 'string.static.ov',
                match: StringHelper.getOredRegExForWords(...parameter.staticStrings)
            });
        }

        // Keywords without Operators
        if (parameter.keywords.length > 0) {
            json.patterns.push({
                comment: 'pattern for general keywords',
                name: 'keyword.ov',
                match: StringHelper.getCaseUnsensitiveOredRegExForWords(...parameter.keywords)
            });
        }

        // Complex Schema
        var schemaRegex = parameter.getComplexSchemaRegExp();
        if (!!schemaRegex) {
            json.patterns.push({
                comment: 'pattern for complex `of`-keywords',
                name: 'keyword.of.ov',
                match: schemaRegex
            });
        }

        // Operator Keywords
        var operationRegex = parameter.getOperationRegExp();
        if (!!operationRegex) {
            json.patterns.push({
                comment: 'pattern for operations',
                name: 'keyword.operator.ov',
                match: operationRegex
            });
        }

        return json;
    }


    public genericPatterns(): Pattern[] {
        var patterns = [];

        patterns.push({
            comment: "Floating point literal (fraction)",
            name: "constant.numeric.float.ov",
            match: "\\b[0-9][0-9_]*\\.[0-9][0-9_]*([eE][+-]?[0-9_]+)?(f32|f64)?\\b"
        });
        patterns.push({
            comment: "Integer literal (decimal)",
            name: "constant.numeric.integer.decimal.ov",
            match: "\\b[0-9][0-9_]*([ui](8|16|32|64|128|s|size))?\\b"
        });

        return patterns;
    }
}