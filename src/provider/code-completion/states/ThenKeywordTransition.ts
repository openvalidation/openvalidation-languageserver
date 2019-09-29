import { StateTransition } from "./StateTransition";
import { StateTransitionEnum } from "./StateTransitionEnum";
import { CompletionGenerator } from "../CompletionGenerator";

export class ThenKeywordTransition extends StateTransition {
    constructor() {
        super(StateTransitionEnum.ThenKeyword)
    }

    public addCompletionItems(generator: CompletionGenerator): void {
        generator.addThenKeyword(this);
    }
}