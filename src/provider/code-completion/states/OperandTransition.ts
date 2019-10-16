import { String } from "typescript-string-operations";
import { CompletionBuilder } from "../CompletionBuilder";
import { StateTransition } from "./StateTransition";

/**
 * Transition for operands
 *
 * @export
 * @class OperandTransition
 * @extends {StateTransition}
 */
export class OperandTransition extends StateTransition {
  private dataType: string | undefined;
  private nameFilter: string[];

  constructor(
    datatype?: string,
    nameFilter?: string[],
    prependingText?: string
  ) {
    super(prependingText);

    this.dataType = datatype;
    this.nameFilter = !nameFilter ? [] : nameFilter;
  }

  public get $dataType(): string | undefined {
    return this.dataType;
  }

  public get $nameFilter(): string[] {
    const filterList: string[] = this.nameFilter;
    for (const filter of this.nameFilter) {
      const complexChild: string[] = filter.split(".");
      if (complexChild.length > 1) {
        filterList.push(complexChild[complexChild.length - 1]);
      }
    }
    return filterList;
  }

  /**
   * Adds a name to the list of name-filter
   *
   * @param {string} filter
   * @memberof OperandTransition
   */
  public addNameFilter(filter: string): void {
    this.nameFilter.push(filter);
  }

  /**
   * Verifies weather the given name and datatype are valid for this transition.
   * It is valid, if the datatype fits the datatype of this transition and if the name is `not` inside the filter.
   *
   * @param {string} name name that will be compared to the name-filter
   * @param {string} datatype datatype that will be compared to the datatype
   * @returns {boolean}
   * @memberof OperandTransition
   */
  public isValid(name: string, datatype: string): boolean {
    if (!this.dataType && this.$nameFilter.length === 0) {
      return true;
    }

    // Wrong Datatype
    if (
      !String.IsNullOrWhiteSpace(this.dataType!) &&
      datatype !== this.dataType
    ) {
      return false;
    }

    // The Attribute with the name is not allowed
    if (!!this.$nameFilter && this.$nameFilter.includes(name)) {
      return false;
    }

    return true;
  }

  /**
   * Adds the fitting identifier to the given builder
   *
   * @param {CompletionBuilder} builder builder that need to be manipulated
   * @memberof OperandTransition
   */
  public addCompletionItems(builder: CompletionBuilder): void {
    builder.addFittingIdentifier(this);
  }
}
