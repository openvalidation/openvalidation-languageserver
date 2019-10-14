import { Type } from "class-transformer";

/**
 * Data-class that is used for the transfer of aliases.
 * Especially it is used for operators, which receive the valid-datatype whith them
 *
 * @export
 * @class AliasesWithOperators
 */
export class AliasesWithOperators {
  @Type(() => Map)
  private aliases: Map<string, string>;

  @Type(() => Map)
  private operators: Map<string, string>;

  /**
   * Creates an instance of AliasesWithOperators.
   * @param {Map<string, string>} aliases map whith all aliases which contains the key and the natural-text
   * @param {Map<string, string>} operators map with all operators
   *  which contains the natural-text and the datatype of the operator
   * @memberof AliasesWithOperators
   */
  constructor(aliases: Map<string, string>, operators: Map<string, string>) {
    this.aliases = aliases;
    this.operators = operators;
  }

  public get $aliases(): Map<string, string> {
    return this.aliases;
  }

  public get $operators(): Map<string, string> {
    return this.operators;
  }
}
