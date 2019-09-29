import { StateTransition } from "./StateTransition";
import { CompletionGenerator } from "../CompletionGenerator";

export class EmptyTransition extends StateTransition {
    constructor() {
        super()
    }

    public addCompletionItems(generator: CompletionGenerator): void {
    }
}