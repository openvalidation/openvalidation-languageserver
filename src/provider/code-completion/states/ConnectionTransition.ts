import { StateTransition } from "./StateTransition";
import { CompletionGenerator } from "../CompletionGenerator";

export class ConnectionTransition extends StateTransition {
    constructor() {
        super()
    }
    
    public addCompletionItems(generator: CompletionGenerator): void {
        generator.addLogicalOperators(this);
    }
}