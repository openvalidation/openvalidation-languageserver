import { StateTransition } from "./StateTransition";
import { StateTransitionEnum } from "./StateTransitionEnum";
import { CompletionGenerator } from "../CompletionGenerator";

export class ConnectionTransition extends StateTransition {
    constructor() {
        super(StateTransitionEnum.Connection)
    }

    
    public addCompletionItems(generator: CompletionGenerator): void {
        generator.addLogicalOperators(this);
    }
}