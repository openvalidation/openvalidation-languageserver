import { AliasHelper } from "../../aliases/AliasHelper";
import { ISchemaType } from "../../rest-interface/schema/ISchemaType";
import { Variable } from "../../rest-interface/intelliSenseTree/Variable";
import { CompletionGenerator } from "./CompletionGenerator";
import { CompletionState } from "./CompletionStates";
import { CompletionType } from "../../enums/CompletionType";

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
        this.possibleStates = [];
    }

    private possibleStates: CompletionState[];

    public getState(): CompletionState[] {
        return this.possibleStates;
    }
    public addState(value: CompletionState) {
        if (value != CompletionState.Empty)
            this.possibleStates.push(value);
    }
    public setState(...value: CompletionState[]) {
        this.possibleStates = value.filter(v => v != CompletionState.Empty);
    }

    public getDataType(): string | null {
        return this.dataType;
    }

    public static create(state: CompletionState): CompletionContainer {
        var container = new CompletionContainer();
        container.setState(state);
        return container;
    }



    public static empty(): CompletionContainer {
        return new CompletionContainer(CompletionType.None);
    }

    public static logicalOperator(): CompletionContainer {
        return new CompletionContainer(CompletionType.LogicalOperator);
    }

    public static operand(datatype: string): CompletionContainer {
        var container = new CompletionContainer(CompletionType.Operand);
        container.setDataType(datatype);
        return container;
    }

    public static operator(datatype: string): CompletionContainer {
        var container = new CompletionContainer(CompletionType.Operator);
        container.setDataType(datatype);
        return container;
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

    public setDataType(dataType: string): CompletionContainer {
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