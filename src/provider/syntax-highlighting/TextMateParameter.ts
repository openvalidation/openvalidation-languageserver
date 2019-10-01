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
    private keywords: string[];
    private identifier: string[];
    private complexSchemaProperties: IComplexData[];
    private asKeyword: string | null;
    private thenKeyword: string | null;
    private commentKeyword: string | null;

    private operations: OperationNode[];
    private operands: BaseOperandNode[];

    private aliasHelper: AliasHelper;

    constructor(private readonly apiResponse: LintingResponse, server: OvServer) {
        this.aliasHelper = server.aliasHelper;

        this.identifier = this.getIdentifier(server.schema.dataProperties);
        this.complexSchemaProperties = server.schema.complexData;
        this.keywords = server.aliasHelper.getGenericKeywords();

        if (!!apiResponse.$mainAstNode) {
            var traversal = new TreeTraversal();
            this.operations = traversal.getOperations(apiResponse.$mainAstNode.getScopes());
            this.operands = traversal.getLonelyOperands(apiResponse.$mainAstNode.getScopes());
        } else {
            this.operations = [];
            this.operands = [];
        }

        this.asKeyword = server.aliasHelper.getKeywordByAliasKey(AliasKey.AS);
        this.thenKeyword = server.aliasHelper.getKeywordByAliasKey(AliasKey.THEN);
        this.commentKeyword = server.aliasHelper.getKeywordByAliasKey(AliasKey.COMMENT);
    }

    public get $keywords(): string[] {
        return this.keywords;
    }
    public get $identifier(): string[] {
        return this.identifier;
    }
    public get $complexSchemaProperties(): IComplexData[] {
        return this.complexSchemaProperties;
    } 
    public get $asKeyword(): string | null {
        return this.asKeyword;
    }
    public get $thenKeyword(): string | null {
        return this.thenKeyword;
    }
    public get $commentKeyword(): string | null {
        return this.commentKeyword;
    }
    public get $operations(): OperationNode[] {
        return this.operations;
    }
    public get $operands(): BaseOperandNode[] {
        return this.operands;
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
     * Generates textmate-pattern that are capable for semantic parsing of operations and operands.
     * A pattern is generated for every operation and operand which only highlights the relevant data.
     * The relevant data is direcly transfered of the syntax-tree
     *
     * @returns {Pattern[]} generated patterns
     * @memberof TextMateParameter
     */
    public getOperationAndOperandPatterns(): Pattern[] {
        var patternList: Pattern[] = [];

        for (const operation of this.$operations) {
            var tmpPattern: SyntaxHighlightingCapture | null = operation.getPatternInformation();
            if (!tmpPattern) continue;

            var pattern = tmpPattern.buildPattern();
            if (!pattern) continue;
            patternList.push(pattern);
        }

        for (const operand of this.$operands) {
            var tmpPattern: SyntaxHighlightingCapture | null = operand.getPatternInformation();
            if (!tmpPattern) continue;

            var pattern = tmpPattern.buildPattern();
            if (!pattern) continue;
            patternList.push(pattern);
        }

        return patternList;
    }
    
    /**
     * Generates the complex regular expression for complex schema properties.
     * This is responsible for parsing the `of`-keyword only in a valid context.
     * A valid context is e.g. `child of parent`.
     *
     * @returns {(string | null)}
     * @memberof TextMateParameter
     */
    public getComplexSchemaRegExp(): string | null {
        if (!this.$complexSchemaProperties) return null;
       
        var ofKeywordString = ".*" + StringHelper.getCaseUnsensitiveOredRegExForWords(...this.aliasHelper.getOfKeywords()) + ".*";

        var propertyStrings: string[] = [];
        for (const schemaProperty of this.$complexSchemaProperties) {
            var tmpString = StringHelper.getComplexRegExWithOutherBounds(schemaProperty.child, ofKeywordString, schemaProperty.parent, false);
            if (!tmpString) continue;
            
            propertyStrings.push(tmpString);
        }

        if (propertyStrings.length == 0) return null;

        return StringHelper.getOredRegEx(propertyStrings);
    }
}