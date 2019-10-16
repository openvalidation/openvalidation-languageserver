import { Type } from "class-transformer";
import { IndexRange } from "../../data-model/syntax-tree/IndexRange";

/**
 * Class for linting-messages we received from the REST-API.
 * It consists of the message and the range of the error source.
 *
 * @export
 * @class LintingError
 */
export class LintingError {
  private message: string;

  @Type(() => IndexRange)
  private range: IndexRange;

  /**
   * Creates an instance of LintingError.
   * @param {string} message error-messsage
   * @param {IndexRange} range range of the error-source
   * @memberof LintingError
   */
  constructor(message: string, range: IndexRange) {
    this.message = message;
    this.range = range;
  }

  public get $message(): string {
    return this.message;
  }

  public get $range(): IndexRange {
    return this.range;
  }
}
