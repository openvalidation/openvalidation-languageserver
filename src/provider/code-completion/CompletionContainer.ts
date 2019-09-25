import { AliasHelper } from "../../aliases/AliasHelper";
import { ISchemaType } from "../../rest-interface/schema/ISchemaType";
import { Variable } from "../../data-model/syntax-tree/Variable";
import { CompletionGenerator } from "./CompletionGenerator";
import { StateTransition } from "./states/StateTransition";
import { ConnectionTransition } from "./states/ConnectionTransition";
import { ThenKeywordTransition } from "./states/ThenKeywordTransition";
import { OperatorTransition } from "./states/OperatorTransition";
import { OperandTransition } from "./states/OperandTransition";
import { AsKeywordTransition } from "./states/AsKeywordTransition";
import { EmptyTransition } from "./states/EmptyTransition";

export class CompletionContainer {
    private transitions: StateTransition[];

    constructor() {
        this.transitions = [];
    }

    public static init(): CompletionContainer {
        return new CompletionContainer();
    }

    public isEmpty(): boolean {
        return this.getTransitions().length == 0;
    }

    public getTransitions(): StateTransition[] {
        return this.transitions;
    }

    public connectionTransition(): CompletionContainer {
        this.transitions.push(new ConnectionTransition());
        return this;
    }

    public thenKeywordTransition(): CompletionContainer {
        this.transitions.push(new ThenKeywordTransition());
        return this;
    }

    public asKeywordTransition(): CompletionContainer {
        this.transitions.push(new AsKeywordTransition());
        return this;
    }

    public operatorTransition(dataType: string): CompletionContainer {
        this.transitions.push(new OperatorTransition(dataType));
        return this;
    }

    public operandTransition(dataType?: string, nameFilter?: string | null, prependingText?: string): CompletionContainer {
        this.transitions.push(new OperandTransition(dataType, nameFilter, prependingText));
        return this;
    }

    public emptyTransition(): CompletionContainer {
        this.transitions.push(new EmptyTransition());
        return this;
    }

    public getCompletions(declarations: Variable[], aliasHelper: AliasHelper, schema: ISchemaType): CompletionGenerator {
        var generator: CompletionGenerator = new CompletionGenerator(declarations, aliasHelper, schema);
        let uniqueTypes = [... new Set(this.transitions)];
        uniqueTypes.forEach(transition => {
            if (transition instanceof OperandTransition) {
                generator.addFittingIdentifier(transition);
            } else if (transition instanceof OperatorTransition) {
                generator.addFittingOperator(transition);
            } else if (transition instanceof ConnectionTransition) {
                generator.addLogicalOperators(transition);
            } else if (transition instanceof AsKeywordTransition) {
                generator.addAsKeyword(transition);
            } else if (transition instanceof ThenKeywordTransition) {
                generator.addThenKeyword(transition);
            } else if (transition instanceof OperandTransition) {
                generator.addFittingIdentifier(transition);
            }
        });

        return generator;
    }
}