import { CompletionBuilder } from "../CompletionBuilder";
import { StateTransition } from "./StateTransition";
import { IStateTransition } from "./state-constructor/IStateTransition";

/**
 * Transition for operator-transitions.
 * This transition depends on the given datatype.
 *
 * @export
 * @class OperatorTransition
 * @extends {StateTransition}
 */
export class OperatorTransition extends StateTransition {
  private dataType: string;

  /**
   * Creates an instance of OperatorTransition.
   * @param {string} dataType datatype the operator should have
   * @param {IStateTransition} [constructor] interface that contains some extra attributes
   * @memberof OperatorTransition
   */
  constructor(dataType: string, constructor?: IStateTransition) {
    super(constructor);

    this.dataType = dataType;
  }

  public get $dataType(): string {
    return this.dataType;
  }

  /**
   * Adds the fitting operators to the builder
   *
   * @param {CompletionBuilder} builder builder that need to be manipulated
   * @memberof OperatorTransition
   */
  public addCompletionItems(builder: CompletionBuilder): void {
    builder.addFittingOperator(this);
  }
}
