import { CompletionBuilder } from "../CompletionBuilder";
import { StateTransition } from "./StateTransition";
import { IStateTransition } from "./state-constructor/IStateTransition";

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
  constructor(constructor?: IStateTransition) {
    super(constructor);
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
