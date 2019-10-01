import { CompletionBuilder } from "../CompletionGenerator";

/**
 * Generic class for all transitions that provides methods for all transitions
 *
 * @export
 * @abstract
 * @class StateTransition
 */
export abstract class StateTransition {
    private prependingText: string;

    /**
     * Creates an instance of StateTransition.
     * @param {string} [prependingText] text that should apear before the completion-item if the item is selected
     * @memberof StateTransition
     */
    constructor(prependingText?: string) {
        this.prependingText = !prependingText ? "" : prependingText;
    }

    public get $prependingText(): string {
        return this.prependingText;
    }

    /**
     * Adds the required-items to the builder
     *
     * @abstract
     * @param {CompletionBuilder} builder builder that need to be manipulated
     * @memberof StateTransition
     */
    abstract addCompletionItems(builder: CompletionBuilder): void;
}