import { CompletionGenerator } from "../CompletionGenerator";

export abstract class StateTransition {
    private prependingText: string;

    constructor(prependingText?: string) {
        this.prependingText = !prependingText ? "" : prependingText;
    }

    public getPrependingText(): string {
        return this.prependingText;
    }

    abstract addCompletionItems(generator: CompletionGenerator): void;
}