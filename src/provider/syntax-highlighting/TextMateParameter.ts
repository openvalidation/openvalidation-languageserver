import { AliasHelper } from "src/aliases/AliasHelper";
import { IComplexData } from "src/rest-interface/schema/IComplexData";
import { String } from "typescript-string-operations";
import { AliasKey } from "../../aliases/AliasKey";
import { StringHelper } from "../../helper/StringHelper";
import { TreeTraversal } from "../../helper/TreeTraversal";
import { OvServer } from "../../OvServer";
import { LintingResponse } from "../../rest-interface/response/LintingResponse";
import { ISchemaProperty } from "../../rest-interface/schema/ISchemaProperty";
import { OperationSyntaxStructure } from "./OperatorSyntaxStructure";

export class TextMateParameter {
    private _keywords: string[];
    private _identifier: string[];
    private _complexSchemaProperties: IComplexData[];
    private _staticStrings: string[];
    private _thenKeyword: string | null;
    private _commentKeyword: string | null;
    private _operations: OperationSyntaxStructure[];

    private aliasHelper: AliasHelper;

    constructor(private readonly apiResponse: LintingResponse, server: OvServer) {
        this.aliasHelper = server.aliasHelper;

        this._staticStrings = !apiResponse.getStaticStrings() ? [] : apiResponse.getStaticStrings();
        this._identifier = this.getIdentifier(server.schema.dataProperties);
        this._complexSchemaProperties = server.schema.complexData;
        this._keywords = server.aliasHelper.getGenericKeywords();

        if (apiResponse.getMainAstNode() != null) {
            var traversal = new TreeTraversal();
            var tmpOperations = traversal.getOperations(apiResponse.getMainAstNode().getScopes());
            this._operations = tmpOperations.map(o => new OperationSyntaxStructure(o));
        } else {
            this._operations = [];
        }

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
    public get staticStrings(): string[] {
        return this._staticStrings;
    }
    public get thenKeyword(): string | null {
        return this._thenKeyword;
    }
    public get commentKeyword(): string | null {
        return this._commentKeyword;
    }
    public get operations(): OperationSyntaxStructure[] {
        return this._operations;
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

        if (!!this.apiResponse.getMainAstNode() &&
            !!this.apiResponse.getMainAstNode().getDeclarations()) {
            var names: string[] = this.apiResponse.getMainAstNode().getDeclarations().map(d => d.name);
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
    public getOperationRegExp(): string | null {
        var stringList: string[] = [];

        for (const operation of this.operations) {
            var tmpString = operation.getRegExpAsString();
            if (!tmpString) continue;

            stringList.push(tmpString);
        }
        if (stringList.length == 0) return null;
        return StringHelper.getOredRegEx(stringList);
    }


    /**
     *
     *
     * @returns {(string | null)}
     * @memberof TextMateParameter
     */
    public getComplexSchemaRegExp(): string | null {
        if (!this.complexSchemaProperties) return null;
       
        var ofKeywordString = "(?i)\\s*(" + StringHelper.getCaseUnsensitiveOredRegExForWords(...this.aliasHelper.getOfKeywords()) + ")\\s*";

        var propertyStrings: string[] = [];
        for (const schemaProperty of this.complexSchemaProperties) {
            var childString = StringHelper.getOredRegExForWords(schemaProperty.child);
            var parentString = StringHelper.getOredRegExForWords(schemaProperty.parent);

            var tmpString = StringHelper.getComplexRegExWithOutherBounds(childString, ofKeywordString, parentString);
            if (!tmpString) continue;
            
            propertyStrings.push(tmpString);
        }

        if (propertyStrings.length == 0) return null;

        return StringHelper.getOredRegEx(propertyStrings);
    }
}