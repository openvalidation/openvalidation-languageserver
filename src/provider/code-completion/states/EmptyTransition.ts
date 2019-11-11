import { CompletionBuilder } from "../CompletionBuilder";
import { StateTransition } from "./StateTransition";
import { IStateTransition } from "./state-constructor/IStateTransition";

/**
 * Empty-transition which is used as a placeholder for a state where no items should be aded
 *
 * @export
 * @class EmptyTransition
 * @extends {StateTransition}
 */
export class EmptyTransition extends StateTransition {
  constructor(constructor?: IStateTransition) {
    super(constructor);
  }

  /**
   * Adds nothing to the builder
   *
   * @param {CompletionBuilder} builder builder that should be manipulated
   * @memberof EmptyTransition
   */
  public addCompletionItems(builder: CompletionBuilder): void {}
}
