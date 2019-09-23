import { CompletionItem, CompletionItemKind, InsertTextFormat } from "vscode-languageserver";
import { AliasHelper } from "../../aliases/AliasHelper";
import { AliasKey } from "../../aliases/AliasKey";
import { OvServer } from "../../OvServer";
import { Variable } from "../../rest-interface/intelliSenseTree/Variable";
import { ISchemaProperty } from "../../rest-interface/schema/ISchemaProperty";
import { ISchemaType } from "../../rest-interface/schema/ISchemaType";

export class CompletionGenerator {
    private completionList: CompletionItem[];

    constructor(
        // private readonly mainNode: MainNode,
        private readonly declarations: Variable[],
        private readonly aliasHelper: AliasHelper,
        private readonly schema: ISchemaType,
        private readonly prependedText: string | null
    ) {
        this.completionList = []
    }

    public static default(declarations: Variable[], server: OvServer) {
        return new CompletionGenerator(declarations, server.aliasHelper, server.schema, null).addGlobals().build();
    }

    /**
     * Adds all Keywords that should be globally available
     *
     * @memberof CompletionBuilder
     */
    public addGlobals(): CompletionGenerator {
        this.addKeyword(this.aliasHelper.getKeywordByString("if"), "a");

        this.addSnippet("Variable", "$1 ALS ${2:variable}", "c");
        this.addSnippet("Short Rule", "$1 MUSS $2", "c");
        return this;
    }

    public addFittingOperator(datatype: string | null): CompletionGenerator {
        for (const operator of this.aliasHelper.getOperators()) {
            if (datatype == operator[1] || "Object" == operator[1])
                this.addKeyword(operator[0], "a");
        }

        return this;
    }

    public addFittingChilds(parentName: string): CompletionGenerator {
        this.schema.complexData.forEach(property => {
            if (property.parent == parentName.replace('.', '')) {
                var schemaProperty: ISchemaProperty[] = this.schema.dataProperties.filter(p => p.name == property.child);
                var dataType: string | null = schemaProperty.length > 0 ? schemaProperty[0].type : null;
                if (!!dataType)
                    this.addVariable(property.child, dataType, "a");
            }
        });
        return this;
    }

    public addOperandsWithTypeOfGivenOperand(operandName: string): CompletionGenerator {
        var variables: Variable | undefined = this.declarations.find(declaration => declaration.getName() == operandName);
        if (!!variables) {
            return this.addFittingIdentifier(operandName, variables.getDataType())
        }

        var schema: ISchemaProperty | undefined = this.schema.dataProperties.find(property => property.name == operandName);
        if (!!schema) {
            return this.addFittingIdentifier(operandName, schema.type);
        }

        return this;
    }

    public addFittingIdentifier(name: string | null, datatype: string | null): CompletionGenerator {
        this.declarations.forEach(variable => {
            console.log(datatype);
            if ((!!variable.getDataType() && variable.getDataType() == datatype && variable.getName() != name) ||
                (!name && !datatype)) {
                this.addVariable(variable.getName(), variable.getDataType(), "a");
            }
        });

        this.schema.dataProperties.forEach(property => {
            if ((property.type == datatype && property.name != name) ||
                (!name && !datatype)) {
                this.addVariable(property.name, property.type, "b");
            }
        });

        var functions = this.aliasHelper.getFunctions();
        functions.forEach(func => {
            this.addFunction(func, "", "c");
        })
        return this;
    }

    public addLogicalOperators(): CompletionGenerator {
        for (const logicalOperator of this.aliasHelper.getLogicalOperators()) {
            this.addKeyword(logicalOperator, "a");
        }
        return this;
    }

    public addThenKeyword(): CompletionGenerator {
        this.addKeyword(this.aliasHelper.getKeywordByString(AliasKey.THEN), "a");
        return this;
    }

    public addAsKeyword(): CompletionGenerator {
        var keyword = this.aliasHelper.getKeywordByString(AliasKey.AS);
        this.addSnippet(keyword, keyword + " ${1:variable}", "a");
        return this;
    }

    public build(): CompletionItem[] {
        return this.completionList;
    }

    private addVariable(label: string | null, dataType: string, sortText: string): CompletionGenerator {
        if (!label) return this;

        var completionItem = this.createCompletionItem(label, sortText);
        completionItem.kind = CompletionItemKind.Variable;
        completionItem.detail = dataType;
        this.completionList.push(completionItem);
        return this;
    }

    private addFunction(label: string | null, dataType: string, sortText: string): CompletionGenerator {
        if (!label) return this;

        var completionItem = this.createCompletionItem(label, sortText);
        completionItem.kind = CompletionItemKind.Function;
        completionItem.detail = dataType;
        this.completionList.push(completionItem);
        return this;
    }

    private addKeyword(label: string | null, sortText: string): CompletionGenerator {
        if (!label) return this;

        var completionItem = this.createCompletionItem(label, sortText);
        completionItem.kind = CompletionItemKind.Keyword;
        this.completionList.push(completionItem);
        return this;
    }

    private addSnippet(label: string | null, text: string, sortText: string): CompletionGenerator {
        if (!label) return this;

        var completionItem = this.createCompletionItemWithTextInsertion(label, text, sortText);
        completionItem.kind = CompletionItemKind.Snippet;
        completionItem.insertTextFormat = InsertTextFormat.Snippet;
        completionItem.sortText = sortText;
        this.completionList.push(completionItem);

        return this;
    }

    /**
     * Creates a CompletionItem, that holds the information for code-completion
     * with a different label and text to insert
     *
     * @static
     * @param {string} label label to show in the suggestion-list
     * @param {string} text text to insert, when suggestion gets picked
     * @returns {CompletionItem} created CompletionItem
     * @memberof CompletionItemHelper
     */
    private createCompletionItemWithTextInsertion(label: string, text: string, sortText: string): CompletionItem {
        var item = CompletionItem.create(label);
        item.sortText = sortText;

        var tmpPrepended: string = !this.prependedText ? "" : this.prependedText;
        item.insertText = tmpPrepended + text;

        return item;
    }

    /**
     * Creates a CompletionItem, that holds the information for code-completion,
     * with the same label and text to insert
     *
     * @static
     * @param {string} text label of the item and text to insert, when suggestion gets picked
     * @returns {CompletionItem} created CompletionItem
     * @memberof CompletionItemHelper
     */
    private createCompletionItem(text: string, sortText: string): CompletionItem {
        return this.createCompletionItemWithTextInsertion(text, text + " ", sortText);
    }
}