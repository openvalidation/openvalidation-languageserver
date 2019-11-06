import { CompletionBuilder } from "../CompletionBuilder";
import { IStateTransition } from "./state-constructor/IStateTransition";
import { IndexRange } from "src/data-model/syntax-tree/IndexRange";

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
  private range: IndexRange | null;

  /**
   * Creates an instance of StateTransition.
   * @param {IStateTransition} [constructor] interface that contains some extra attributes
   * @memberof StateTransition
   */
  constructor(constructor?: IStateTransition) {
    if (!constructor) {
      this.prependingText = "";
      this.filterStartText = "";
      this.range = null;
      return;
    }

    this.prependingText = !constructor.prependingText
      ? ""
      : constructor.prependingText;
    this.filterStartText = !constructor.filterStartText
      ? ""
      : constructor.filterStartText;
    this.range = !constructor.range ? null : constructor.range;
  }

  public get $prependingText(): string {
    return this.prependingText;
  }

  public get $filterStartText(): string {
    return this.filterStartText;
  }

  public get $range(): IndexRange | null {
    return this.range;
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
