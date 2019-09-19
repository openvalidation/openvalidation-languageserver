import { AliasHelper } from "src/aliases/AliasHelper";
import { ISchemaType } from "src/rest-interface/schema/ISchemaType";
import { CompletionType } from "../../enums/CompletionType";
import { Variable } from "../../rest-interface/intelliSenseTree/Variable";
import { CompletionGenerator } from "./CompletionGenerator";

export class CompletionContainer {
    private dataType: string | null;
    private filteredName: string | null;
    private prependingText: string | null;
    private types: CompletionType[];

    constructor(...types: CompletionType[]) {
        this.dataType = null;
        this.filteredName = null;
        this.prependingText = null;
        this.types = types;
    }

    public static createEmpty(): CompletionContainer {
        return new CompletionContainer(CompletionType.None);
    }

    public isEmpty(): boolean {
        return this.getTypes().filter(types => types == CompletionType.None).length > 0;
    }

    public containsOperator(): boolean {
        return this.getTypes().filter(types => types == CompletionType.Operator).length > 0;
    }
    
    public containsLogicalOperator(): boolean {
        return this.getTypes().filter(types => types == CompletionType.LogicalOperator).length > 0;
    }

    public getTypes(): CompletionType[] {
        return this.types;
    }

    public addType(type: CompletionType) {
        this.types.push(type);
    }

    public specificDataType(dataType: string): CompletionContainer {
        this.dataType = dataType;
        return this;
    }

    public specifyNameFiltering(filteredName: string | null): CompletionContainer {
        this.filteredName = filteredName;
        return this;
    }

    public specifyPrependingText(text: string): CompletionContainer {
        this.prependingText = text;
        return this;
    }

    public getCompletions(declarations: Variable[], aliasHelper: AliasHelper, schema: ISchemaType): CompletionGenerator {
        var generator: CompletionGenerator = new CompletionGenerator(declarations, aliasHelper, schema, this.prependingText);
        let uniqueTypes = [... new Set(this.types)];
        uniqueTypes.forEach(type => {
            switch (type) {
                case CompletionType.Globals:
                    generator.addGlobals();
                    break;
                case CompletionType.Operand:
                    generator.addFittingIdentifier(this.filteredName, this.dataType);
                    break;
                case CompletionType.Operator:
                    generator.addFittingOperator(this.dataType);
                    break;
                case CompletionType.LogicalOperator:
                    generator.addLogicalOperators();
                    break;
                case CompletionType.Then:
                    generator.addThenKeyword();
                    break;
                case CompletionType.As:
                    generator.addAsKeyword();
                    break;
                default:
                    break;
            }
        });

        return generator;
    }
}