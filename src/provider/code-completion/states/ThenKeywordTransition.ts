import { StateTransition } from "./StateTransition";
import { CompletionGenerator } from "../CompletionGenerator";

export class ThenKeywordTransition extends StateTransition {
    constructor() {
        super()
    }

    public addCompletionItems(generator: CompletionGenerator): void {
        generator.addThenKeyword(this);
    }
}