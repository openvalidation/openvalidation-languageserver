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
    private _types: CompletionType[];
    public get types(): CompletionType[] {
        return this._types;
    }
    public set types(value: CompletionType[]) {
        this._types = value;
    }

    constructor(...types: CompletionType[]) {
        this.dataType = null;
        this.filteredName = null;
        this.prependingText = null;
        this._types = types;
        this.possibleStates = [];
    }

    private possibleStates: CompletionState[];

    public getStates(): CompletionState[] {
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
        return this.getStates().every(state => state == CompletionState.Empty);
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
        let uniqueTypes = [... new Set(this.possibleStates)];
        uniqueTypes.forEach(type => {
            switch (type) {
                case CompletionState.OperandMissing:
                case CompletionState.Operator:
                    generator.addFittingIdentifier(this.filteredName, this.dataType);
                    break;
                case CompletionState.Operand:
                    generator.addFittingOperator(this.dataType);
                    break;
                case CompletionState.FunctionOperand:
                case CompletionState.ArrayOperand:
                    generator.addFittingOperator(this.dataType);
                    generator.addFittingIdentifier(this.filteredName, this.dataType);
                    break;
                case CompletionState.OperationEnd:
                    generator.addLogicalOperators();
                    break;
                case CompletionState.RuleEnd:
                    generator.addThenKeyword();
                    break;
                case CompletionState.UnkownOperand:
                    generator.addAsKeyword();
                    break;
                default:
                    break;
            }
        });

        return generator;
    }
}