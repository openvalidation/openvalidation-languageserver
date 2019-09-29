import { StateTransition } from "./StateTransition";
import { CompletionGenerator } from "../CompletionGenerator";

export class AsKeywordTransition extends StateTransition {
    constructor() {
        super()
    }

    public addCompletionItems(generator: CompletionGenerator): void {
        generator.addAsKeyword(this);
    }
    
}