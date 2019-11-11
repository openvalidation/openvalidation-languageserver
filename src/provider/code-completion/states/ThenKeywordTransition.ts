import { CompletionBuilder } from "../CompletionBuilder";
import { StateTransition } from "./StateTransition";
import { IStateTransition } from "./state-constructor/IStateTransition";

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
  constructor(constructor?: IStateTransition) {
    super(constructor);
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
