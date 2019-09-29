import { StateTransition } from "./StateTransition";
import { StateTransitionEnum } from "./StateTransitionEnum";
import { CompletionGenerator } from "../CompletionGenerator";

export class AsKeywordTransition extends StateTransition {
    constructor() {
        super(StateTransitionEnum.AsKeyword)
    }

    public addCompletionItems(generator: CompletionGenerator): void {
        generator.addAsKeyword(this);
    }
    
}