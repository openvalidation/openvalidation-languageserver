import { StateTransition } from "./StateTransition";
import { CompletionBuilder } from "../CompletionBuilder";

/**
 * Transition for the logical connections like `or` or `and`
 *
 * @export
 * @class ConnectionTransition
 * @extends {StateTransition}
 */
export class ConnectionTransition extends StateTransition {

    /**
     * Creates an instance of ConnectionTransition.
     * @memberof ConnectionTransition
     */
    constructor() {
        super()
    }
    
    /**
     * Adds the logical operators to the builder
     *
     * @param {CompletionBuilder} builder builder that should be manipulated
     * @memberof ConnectionTransition
     */
    public addCompletionItems(builder: CompletionBuilder): void {
        builder.addLogicalOperators(this);
    }
}