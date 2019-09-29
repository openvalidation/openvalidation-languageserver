import { StateTransition } from "./StateTransition";
import { StateTransitionEnum } from "./StateTransitionEnum";
import { CompletionGenerator } from "../CompletionGenerator";

export class EmptyTransition extends StateTransition {
    constructor() {
        super(StateTransitionEnum.Empty);
    }

    public addCompletionItems(generator: CompletionGenerator): void {
    }
}