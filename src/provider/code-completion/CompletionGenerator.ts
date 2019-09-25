import { CompletionItem, CompletionItemKind, InsertTextFormat } from "vscode-languageserver";
import { AliasHelper } from "../../aliases/AliasHelper";
import { AliasKey } from "../../aliases/AliasKey";
import { OvServer } from "../../OvServer";
import { Variable } from "../../rest-interface/intelliSenseTree/Variable";
import { ISchemaProperty } from "../../rest-interface/schema/ISchemaProperty";
import { ISchemaType } from "../../rest-interface/schema/ISchemaType";
import { AsKeywordTransition } from "./states/AsKeywordTransition";
import { ThenKeywordTransition } from "./states/ThenKeywordTransition";
import { ConnectionTransition } from "./states/ConnectionTransition";
import { OperandTransition } from "./states/OperandTransition";
import { OperatorTransition } from "./states/OperatorTransition";

export class CompletionGenerator {
    private completionList: CompletionItem[];

    constructor(
        private readonly declarations: Variable[],
        private readonly aliasHelper: AliasHelper,
        private readonly schema: ISchemaType
    ) {
        this.completionList = []
    }

    public static default(declarations: Variable[], server: OvServer) {
        return new CompletionGenerator(declarations, server.aliasHelper, server.schema).addGlobals().build();
    }

    // Generic completion
    /**
     * Adds all Keywords that should be globally available
     *
     * @memberof CompletionBuilder
     */
    public addGlobals(): CompletionGenerator {
        this.addKeyword(this.aliasHelper.getKeywordByString("if"), "a", "");

        this.addSnippet("Variable", "$1 ALS ${2:variable}", "c", "");
        this.addSnippet("Short Rule", "$1 MUSS $2", "c", "");
        return this;
    }

    public addFittingOperator(transition: OperatorTransition): CompletionGenerator {
        for (const operator of this.aliasHelper.getOperators()) {
            if (transition.getDataType() == operator[1] || "Object" == operator[1])
                this.addKeyword(operator[0], "a", transition.getPrependingText());
        }

        return this;
    }

    public addFittingIdentifier(transition: OperandTransition): CompletionGenerator {
        this.declarations.forEach(variable => {
            if ((!!variable.getDataType() && 
                    variable.getDataType() == transition.getDataType()  && 
                    variable.getName() != transition.getNameFilter()) ||
                (!transition.getNameFilter() && !transition.getDataType())) {
                this.addVariable(variable.getName(), variable.getDataType(), "a", transition.getPrependingText());
            }
        });

        this.schema.dataProperties.forEach(property => {
            if ((property.type == transition.getDataType() && property.name != transition.getNameFilter()) ||
                (!transition.getNameFilter() && !transition.getDataType())) {
                this.addVariable(property.name, property.type, "b", transition.getPrependingText());
            }
        });

        var functions = this.aliasHelper.getFunctions();
        functions.forEach(func => {
            this.addFunction(func, "", "c", transition.getPrependingText());
        })
        return this;
    }

    public addLogicalOperators(transition: ConnectionTransition): CompletionGenerator {
        for (const logicalOperator of this.aliasHelper.getLogicalOperators()) {
            this.addKeyword(logicalOperator, "a", transition.getPrependingText());
        }
        return this;
    }

    public addThenKeyword(transition: ThenKeywordTransition): CompletionGenerator {
        this.addKeyword(this.aliasHelper.getKeywordByString(AliasKey.THEN), "a", transition.getPrependingText());
        return this;
    }

    public addAsKeyword(transition: AsKeywordTransition): CompletionGenerator {
        var keyword = this.aliasHelper.getKeywordByString(AliasKey.AS);
        this.addSnippet(keyword, keyword + " ${1:variable}", "a", transition.getPrependingText());
        return this;
    }

    // Schema completion
    public addFittingChilds(parentName: string): CompletionGenerator {
        this.schema.complexData.forEach(property => {
            if (property.parent == parentName.replace('.', '')) {
                var schemaProperty: ISchemaProperty[] = this.schema.dataProperties.filter(p => p.name == property.child);
                var dataType: string | null = schemaProperty.length > 0 ? schemaProperty[0].type : null;
                if (!!dataType)
                    this.addVariable(property.child, dataType, "a", "");
            }
        });
        return this;
    }

    // Array completion
    public addOperandsWithTypeOfGivenOperand(operandName: string): CompletionGenerator {
        var variables: Variable | undefined = this.declarations.find(declaration => declaration.getName() == operandName);
        if (!!variables) {
            return this.addFittingIdentifier(new OperandTransition(variables.getDataType(), operandName, " "))
        }

        var schema: ISchemaProperty | undefined = this.schema.dataProperties.find(property => property.name == operandName);
        if (!!schema) {
            return this.addFittingIdentifier(new OperandTransition(schema.type, operandName, " "));
        }

        return this;
    }


    public build(): CompletionItem[] {
        return this.completionList;
    }

    private addVariable(label: string | null, dataType: string, sortText: string, prependedText: string): CompletionGenerator {
        if (!label) return this;

        var completionItem = this.createCompletionItem(label, sortText, prependedText);
        completionItem.kind = CompletionItemKind.Variable;
        completionItem.detail = dataType;
        this.completionList.push(completionItem);
        return this;
    }

    private addFunction(label: string | null, dataType: string, sortText: string, prependedText: string): CompletionGenerator {
        if (!label) return this;

        var completionItem = this.createCompletionItem(label, sortText, prependedText);
        completionItem.kind = CompletionItemKind.Function;
        completionItem.detail = dataType;
        this.completionList.push(completionItem);
        return this;
    }

    private addKeyword(label: string | null, sortText: string, prependedText: string): CompletionGenerator {
        if (!label) return this;

        var completionItem = this.createCompletionItem(label, sortText, prependedText);
        completionItem.kind = CompletionItemKind.Keyword;
        this.completionList.push(completionItem);
        return this;
    }

    private addSnippet(label: string | null, text: string, sortText: string, prependedText: string): CompletionGenerator {
        if (!label) return this;

        var completionItem = this.createCompletionItemWithTextInsertion(label, text, sortText, prependedText);
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
    private createCompletionItemWithTextInsertion(label: string, text: string, sortText: string, prependedText: string): CompletionItem {
        var item = CompletionItem.create(label);
        item.sortText = sortText;

        var tmpPrepended: string = !prependedText ? "" : prependedText;
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
    private createCompletionItem(text: string, sortText: string, prependedText: string): CompletionItem {
        return this.createCompletionItemWithTextInsertion(text, text + " ", sortText, prependedText);
    }

    public getSortText(optional: boolean, trueCase?: string, falseCase?: string) {
        trueCase = !trueCase ? "z" : trueCase;
        falseCase = !falseCase ? "a" : falseCase;
        return optional ? trueCase : falseCase;
    }
}