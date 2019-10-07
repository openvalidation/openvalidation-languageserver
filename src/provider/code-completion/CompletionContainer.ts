import { CompletionBuilder } from "./CompletionBuilder";
import { StateTransition } from "./states/StateTransition";
import { ConnectionTransition } from "./states/ConnectionTransition";
import { ThenKeywordTransition } from "./states/ThenKeywordTransition";
import { OperatorTransition } from "./states/OperatorTransition";
import { OperandTransition } from "./states/OperandTransition";
import { AsKeywordTransition } from "./states/AsKeywordTransition";
import { EmptyTransition } from "./states/EmptyTransition";

/**
 * This class is used for saving the valid transitions of the current state
 *
 * @export
 * @class CompletionContainer
 */
export class CompletionContainer {
    private transitions: StateTransition[];

    /**
     * Creates an instance of CompletionContainer.
     * @memberof CompletionContainer
     */
    constructor() {
        this.transitions = [];
    }

    /**
     * Returns an empty instance of the completionContainer
     *
     * @static
     * @returns {CompletionContainer} this
     * @memberof CompletionContainer
     */
    public static init(): CompletionContainer {
        return new CompletionContainer();
    }

    /**
     * Determines if transitions are allready set
     *
     * @returns {boolean} true, if we have no transitions
     * @memberof CompletionContainer
     */
    public isEmpty(): boolean {
        return this.$transitions.length == 0;
    }

    public get $transitions(): StateTransition[] {
        return this.transitions;
    }

    public addTransition(transition: StateTransition): CompletionContainer {
        this.transitions.push(transition);
        return this;
    }

    /**
     * Adds an connectionTransition to the transitions
     *
     * @returns {CompletionContainer} this
     * @memberof CompletionContainer
     */
    public connectionTransition(): CompletionContainer {
        this.transitions.push(new ConnectionTransition());
        return this;
    }

    /**
     * Adds an thenKeywordTransition to the transitions
     *
     * @returns {CompletionContainer} this
     * @memberof CompletionContainer
     */
    public thenKeywordTransition(): CompletionContainer {
        this.transitions.push(new ThenKeywordTransition());
        return this;
    }

    /**
     * Adds an asKeywordTransition to the transitions
     *
     * @returns {CompletionContainer} this
     * @memberof CompletionContainer
     */
    public asKeywordTransition(): CompletionContainer {
        this.transitions.push(new AsKeywordTransition());
        return this;
    }

    /**
     * Adds an operatorTransition with the given datatype to the transitions
     *
     * @param {string} dataType datatype that the operator should have
     * @returns {CompletionContainer} this
     * @memberof CompletionContainer
     */
    public operatorTransition(dataType: string): CompletionContainer {
        this.transitions.push(new OperatorTransition(dataType));
        return this;
    }

    /**
     * Adds an operandTransition with the given datatype, namefilter and prependingText.
     * If nothing is given, all operands will be shown in the completion
     *
     * @param {string} [dataType] datatype of the operand
     * @param {string} [nameFilter] name of items that shouldn't show up
     * @param {string} [prependingText] text that will be shown before the label incase the item get's selected
     * @returns {CompletionContainer}
     * @memberof CompletionContainer
     */
    public operandTransition(dataType?: string, nameFilter?: string, prependingText?: string): CompletionContainer {
        this.transitions.push(new OperandTransition(dataType, !!nameFilter ? [nameFilter] : [], prependingText));
        return this;
    }

    /**
     * Adds an emptyTransition to the transitions
     *
     * @returns {CompletionContainer} this
     * @memberof CompletionContainer
     */
    public emptyTransition(): CompletionContainer {
        this.transitions.push(new EmptyTransition());
        return this;
    }

    /**
     * Adds a name-filter to all operand-transitions
     *
     * @param {string} name name of an operand that shouldn't appear
     * @memberof CompletionContainer
     */
    public addNameFilterToAllOperands(name: string) {
        this.transitions.forEach(transition => {
            if (transition instanceof OperandTransition) {
                transition.addNameFilter(name);
            }
        })
    }

    /**
     * Fills the given completionBuilder with all transitions
     *
     * @param {CompletionBuilder} generator generator that should be manipulated
     * @returns {CompletionBuilder} manipulated generator
     * @memberof CompletionContainer
     */
    public getCompletions(generator: CompletionBuilder): CompletionBuilder {
        this.transitions.forEach(transition => transition.addCompletionItems(generator));
        return generator;
    }
}