import { StateTransition } from "./StateTransition";
import { CompletionBuilder } from "../CompletionBuilder";

/**
 * Transition of an `as`-keyword
 *
 * @export
 * @class AsKeywordTransition
 * @extends {StateTransition}
 */
export class AsKeywordTransition extends StateTransition {

    /**
     * Creates an instance of AsKeywordTransition.
     * @memberof AsKeywordTransition
     */
    constructor() {
        super()
    }

    /**
     * Adds the as-keyword to the transition
     *
     * @param {CompletionBuilder} builder builder that need to be manipulated
     * @memberof AsKeywordTransition
     */
    public addCompletionItems(generator: CompletionBuilder): void {
        generator.addAsKeyword(this);
    }
    
}