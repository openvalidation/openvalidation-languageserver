import { CompletionBuilder } from "../CompletionBuilder";

/**
 * Generic class for all transitions that provides methods for all transitions
 *
 * @export
 * @abstract
 * @class StateTransition
 */
export abstract class StateTransition {
  private prependingText: string;
  private filterStartText: string;

  /**
   * Creates an instance of StateTransition.
   * @param {string} [prependingText] text that should apear before the completion-item if the item is selected
   * @memberof StateTransition
   */
  constructor(prependingText?: string, filterStartText?: string) {
    this.prependingText = !prependingText ? "" : prependingText;
    this.filterStartText = !filterStartText ? "" : filterStartText;
  }

  public get $prependingText(): string {
    return this.prependingText;
  }

  public get $filterStartText(): string {
    return this.filterStartText;
  }

  /**
   * Adds the required-items to the builder
   *
   * @abstract
   * @param {CompletionBuilder} builder builder that need to be manipulated
   * @memberof StateTransition
   */
  public abstract addCompletionItems(builder: CompletionBuilder): void;
}
