import { AliasHelper } from "../../aliases/AliasHelper";
import { IComplexData } from "../../rest-interface/schema/IComplexData";
import { String } from "typescript-string-operations";
import { AliasKey } from "../../aliases/AliasKey";
import { StringHelper } from "../../helper/StringHelper";
import { TreeTraversal } from "../../helper/TreeTraversal";
import { OvServer } from "../../OvServer";
import { LintingResponse } from "../../rest-interface/response/LintingResponse";
import { ISchemaProperty } from "../../rest-interface/schema/ISchemaProperty";
import { Pattern } from "./TextMateJson";
import { SyntaxHighlightingCapture } from "./SyntaxHighlightingCapture";
import { OperationNode } from "../../data-model/syntax-tree/element/operation/OperationNode";
import { BaseOperandNode } from "../../data-model/syntax-tree/element/operation/operand/BaseOperandNode";

export class TextMateParameter {
    private _keywords: string[];
    private _identifier: string[];
    private _complexSchemaProperties: IComplexData[];
    private _asKeyword: string | null;
    private _thenKeyword: string | null;
    private _commentKeyword: string | null;

    private _operations: OperationNode[];
    private _operands: BaseOperandNode[];

    private aliasHelper: AliasHelper;

    constructor(private readonly apiResponse: LintingResponse, server: OvServer) {
        this.aliasHelper = server.aliasHelper;

        this._identifier = this.getIdentifier(server.schema.dataProperties);
        this._complexSchemaProperties = server.schema.complexData;
        this._keywords = server.aliasHelper.getGenericKeywords();

        if (!!apiResponse.$mainAstNode) {
            var traversal = new TreeTraversal();
            this._operations = traversal.getOperations(apiResponse.$mainAstNode.getScopes());
            this._operands = traversal.getLonelyOperands(apiResponse.$mainAstNode.getScopes());
        } else {
            this._operations = [];
            this._operands = [];
        }

        this._asKeyword = server.aliasHelper.getKeywordByAliasKey(AliasKey.AS);
        this._thenKeyword = server.aliasHelper.getKeywordByAliasKey(AliasKey.THEN);
        this._commentKeyword = server.aliasHelper.getKeywordByAliasKey(AliasKey.COMMENT);
    }

    public get keywords(): string[] {
        return this._keywords;
    }
    public get identifier(): string[] {
        return this._identifier;
    }
    public get complexSchemaProperties(): IComplexData[] {
        return this._complexSchemaProperties;
    } 
    public get asKeyword(): string | null {
        return this._asKeyword;
    }
    public get thenKeyword(): string | null {
        return this._thenKeyword;
    }
    public get commentKeyword(): string | null {
        return this._commentKeyword;
    }
    public get operations(): OperationNode[] {
        return this._operations;
    }
    public get operands(): BaseOperandNode[] {
        return this._operands;
    }

    /**
     * Generates a list of all identifiers which includes the schema and variableNames
     *
     * @private
     * @param {GeneralApiResponse} apiResponse response, that holds the variableNames
     * @param {JSON} schema schema that contains the identifiers
     * @returns {string[]} list of all identifiers
     * @memberof OvSyntaxNotifier
     */
    private getIdentifier(schema: Array<ISchemaProperty>): string[] {
        var identifier: string[] = [];

        if (!!this.apiResponse.$mainAstNode &&
            !!this.apiResponse.$mainAstNode.getDeclarations()) {
            var names: string[] = this.apiResponse.$mainAstNode.getDeclarations().map(d => d.name);
            identifier = identifier.concat(names.filter(n => !String.IsNullOrWhiteSpace(n)));
        }

        if (!!schema && schema.length > 0)
            identifier = identifier.concat(schema.map(property => property.name));

        return identifier;
    }

    /**
     *
     *
     * @returns {(string | null)}
     * @memberof TextMateParameter
     */
    public getOperationAndOperandPatterns(): Pattern[] {
        var patternList: Pattern[] = [];

        for (const operation of this.operations) {
            var tmpPattern: SyntaxHighlightingCapture | null = operation.getPatternInformation();
            if (!tmpPattern) continue;

            var pattern = tmpPattern.buildPattern();
            if (!pattern) continue;
            patternList.push(pattern);
        }

        for (const operand of this.operands) {
            var tmpPattern: SyntaxHighlightingCapture | null = operand.getPatternInformation();
            if (!tmpPattern) continue;

            var pattern = tmpPattern.buildPattern();
            if (!pattern) continue;
            patternList.push(pattern);
        }

        return patternList;
    }
    
    /**
     *
     *
     * @returns {(string | null)}
     * @memberof TextMateParameter
     */
    public getComplexSchemaRegExp(): string | null {
        if (!this.complexSchemaProperties) return null;
       
        var ofKeywordString = ".*" + StringHelper.getCaseUnsensitiveOredRegExForWords(...this.aliasHelper.getOfKeywords()) + ".*";

        var propertyStrings: string[] = [];
        for (const schemaProperty of this.complexSchemaProperties) {
            var tmpString = StringHelper.getComplexRegExWithOutherBounds(schemaProperty.child, ofKeywordString, schemaProperty.parent, false);
            if (!tmpString) continue;
            
            propertyStrings.push(tmpString);
        }

        if (propertyStrings.length == 0) return null;

        return StringHelper.getOredRegEx(propertyStrings);
    }
}