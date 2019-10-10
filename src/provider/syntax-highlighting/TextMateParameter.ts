import { String } from 'typescript-string-operations';
import { AliasHelper } from '../../aliases/AliasHelper';
import { AliasKey } from '../../aliases/AliasKey';
import { ConditionNode } from '../../data-model/syntax-tree/element/operation/ConditionNode';
import { BaseOperandNode } from '../../data-model/syntax-tree/element/operation/operand/BaseOperandNode';
import { TreeTraversal } from '../../helper/TreeTraversal';
import { OvServer } from '../../OvServer';
import { LintingResponse } from '../../rest-interface/response/LintingResponse';
import { IComplexData } from '../../rest-interface/schema/IComplexData';
import { SyntaxHighlightingCapture } from './SyntaxHighlightingCapture';
import { Pattern } from './TextMateJson';

export class TextMateParameter {

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
    public get $operations(): ConditionNode[] {
        return this.operations;
    }
    public get $operands(): BaseOperandNode[] {
        return this.operands;
    }

    private keywords: string[];
    private identifier: string[];
    private complexSchemaProperties: IComplexData[];
    private asKeyword: string | null;
    private thenKeyword: string | null;
    private commentKeyword: string | null;

    private operations: ConditionNode[];
    private operands: BaseOperandNode[];

    private aliasHelper: AliasHelper;

    constructor(private readonly apiResponse: LintingResponse, server: OvServer) {
        this.aliasHelper = server.aliasHelper;

        this.identifier = this.getIdentifier();
        this.complexSchemaProperties = server.schema.complexData;

        const keywordFilter: AliasKey[] = [AliasKey.OPERATOR, AliasKey.OF, AliasKey.AS, AliasKey.FUNCTION];
        this.keywords = server.aliasHelper.getFilteredKeywords(...keywordFilter);

        if (!!apiResponse.$mainAstNode) {
            const traversal = new TreeTraversal();
            this.operations = traversal.getOperations(apiResponse.$mainAstNode.$scopes);
            this.operands = traversal.getLonelyOperands(apiResponse.$mainAstNode.$scopes);
        } else {
            this.operations = [];
            this.operands = [];
        }

        this.asKeyword = server.aliasHelper.getKeywordByAliasKey(AliasKey.AS);
        this.thenKeyword = server.aliasHelper.getKeywordByAliasKey(AliasKey.THEN);
        this.commentKeyword = server.aliasHelper.getKeywordByAliasKey(AliasKey.COMMENT);
    }

    /**
     * Generates textmate-pattern that are capable for semantic parsing of operations and operands.
     * A pattern is generated for every operation and operand which only highlights the relevant data.
     * The relevant data is direcly transfered of the syntax-tree
     *
     * @param {string} asKeyword `as`-keyword, used for the operand-regex
     * @returns {Pattern[]} generated patterns
     * @memberof TextMateParameter
     */
    public getOperationAndOperandPatterns(asKeyword: string | null): Pattern[] {
        const patternList: Pattern[] = [];

        for (const operation of this.$operations) {
            const tmpPattern: SyntaxHighlightingCapture | null = operation.getPatternInformation(this.aliasHelper);
            if (!tmpPattern) { continue; }

            const pattern = tmpPattern.buildPattern();
            if (!pattern) { continue; }
            patternList.push(pattern);
        }

        for (const operand of this.$operands) {
            const tmpPattern: SyntaxHighlightingCapture | null = operand.getPatternInformation(this.aliasHelper);
            if (!tmpPattern) { continue; }

            const operandRegex = `^\\s*${tmpPattern.$match}\\s*$|^\\s*${tmpPattern.$match}\\s*(?=(?i)${asKeyword})`;
            tmpPattern.$match = operandRegex;
            tmpPattern.$capture = tmpPattern.$capture.concat(tmpPattern.$capture);

            const pattern = tmpPattern.buildPattern();
            if (!pattern) { continue; }
            patternList.push(pattern);
        }

        return patternList;
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
    private getIdentifier(): string[] {
        let identifier: string[] = [];

        if (!!this.apiResponse.$mainAstNode &&
            !!this.apiResponse.$mainAstNode.$declarations) {
            const names: string[] = this.apiResponse.$mainAstNode.$declarations.map(d => d.$name);
            identifier = identifier.concat(names.filter(n => !String.IsNullOrWhiteSpace(n)));
        }

        return identifier;
    }
}
