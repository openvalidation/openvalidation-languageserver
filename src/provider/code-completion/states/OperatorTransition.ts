import { StateTransition } from "./StateTransition";
import { StateTransitionEnum } from "./StateTransitionEnum";
import { CompletionGenerator } from "../CompletionGenerator";

export class OperatorTransition extends StateTransition {
    private dataType: string;

    constructor(dataType: string) {
        super(StateTransitionEnum.Operator);

        this.dataType = dataType;
    }

    public getDataType(): string {
        return this.dataType;
    }
    
    public addCompletionItems(generator: CompletionGenerator): void {
        generator.addLogicalOperators(this);
    }
}