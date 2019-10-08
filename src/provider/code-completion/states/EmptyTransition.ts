import { CompletionBuilder } from '../CompletionBuilder';
import { StateTransition } from './StateTransition';

/**
 * Empty-transition which is used as a placeholder for a state where no items should be aded
 *
 * @export
 * @class EmptyTransition
 * @extends {StateTransition}
 */
export class EmptyTransition extends StateTransition {
    constructor() {
        super();
    }

    /**
     * Adds nothing to the builder
     *
     * @param {CompletionBuilder} builder builder that should be manipulated
     * @memberof EmptyTransition
     */
    public addCompletionItems(builder: CompletionBuilder): void {
    }
}
