import { StateTransition } from "./StateTransition";
import { CompletionBuilder } from "../CompletionBuilder";

/**
 * Transition of an `then`-keyword
 *
 * @export
 * @class ThenKeywordTransition
 * @extends {StateTransition}
 */
export class ThenKeywordTransition extends StateTransition {

    /**
     * Creates an instance of ThenKeywordTransition.
     * @memberof ThenKeywordTransition
     */
    constructor() {
        super()
    }

    /**
     * Adds the then-keyword to the builder
     *
     * @param {CompletionBuilder} builder builder that need to be manipulated
     * @memberof ThenKeywordTransition
     */
    public addCompletionItems(builder: CompletionBuilder): void {
        builder.addThenKeyword(this);
    }
}