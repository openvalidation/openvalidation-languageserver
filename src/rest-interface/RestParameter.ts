import { AliasHelper } from "src/aliases/AliasHelper";
import { CultureEnum } from "../enums/CultureEnum";
import { LanguageEnum } from "../enums/LanguageEnum";

/**
 * Class that is used inside the REST-API which contains all the necessary parameters for parsing.
 *
 * @export
 * @class RestParameter
 */
export class RestParameter {
  /**
   * Creates an instance of RestParameter.
   * @param {JSON} schema parsed schema
   * @param {CultureEnum} culture enum that determines the current culture
   * @param {LanguageEnum} language enum that determines the current language
   * @param {AliasHelper} aliasHelper helper that contains a list of all available aliases
   * @memberof RestParameter
   */
  constructor(
    private schema: JSON,
    private culture: CultureEnum,
    private language: LanguageEnum,
    private aliasHelper: AliasHelper
  ) {}

  public get $language(): LanguageEnum {
    return this.language;
  }
  public get $culture(): CultureEnum {
    return this.culture;
  }
  public get $schema(): JSON {
    return this.schema;
  }
  public get $aliasHelper(): AliasHelper {
    return this.aliasHelper;
  }
}
