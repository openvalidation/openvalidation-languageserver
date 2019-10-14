import { String } from "typescript-string-operations";
import { ScopeEnum } from "../../enums/ScopeEnum";
import { IPatternCapture } from "./TextMateJson";

/**
 * Class that is used for semantic parsing.
 * It is used to generate a regex with many different groups.
 * Every group can receive an own capture string for different highlighting
 *
 * @export
 * @class SyntaxHighlightingCapture
 */
export class SyntaxHighlightingCapture {
  public get $capture(): ScopeEnum[] {
    return this.capture;
  }
  public set $capture(value: ScopeEnum[]) {
    this.capture = value;
  }

  public get $match(): string | null {
    return this.match;
  }
  public set $match(value: string | null) {
    this.match = value;
  }

  private capture: ScopeEnum[];
  private match: string | null;

  constructor() {
    this.capture = [];
    this.match = null;
  }

  /**
   * Adds a new capture string to the list and adds the given regex to the string.
   * The string will be surround by brackets, so is added as a group itself.
   * This will be used for highlighting for the `n`-th group in the regex
   *
   * @param {(string | null)} regex that will be added
   * @param {ScopeEnum} scope scope of the regex
   * @returns {void}
   * @memberof SyntaxHighlightingCapture
   */
  public addRegexGroupAndCapture(regex: string | null, scope: ScopeEnum): void {
    if (!regex || String.IsNullOrWhiteSpace(regex) || scope.length === 0) {
      return;
    }

    this.capture.push(scope);
    this.addRegexToMatch(`(${regex})`);
  }

  /**
   * Adds the content of the given capture to this object
   *
   * @param {(SyntaxHighlightingCapture | null)} capture object to merge
   * @returns {void}
   * @memberof SyntaxHighlightingCapture
   */
  public merge(capture: SyntaxHighlightingCapture | null): void {
    if (
      !capture ||
      !capture.$match ||
      String.IsNullOrWhiteSpace(capture.$match) ||
      capture.$capture.length === 0
    ) {
      return;
    }

    this.capture.push(...capture.$capture);
    this.addRegexToMatch(capture.$match);
  }

  /**
   * Generates a textmate-pattern for the content of the class
   *
   * @returns {(Pattern | null)} builded pattern or null, in an error-case
   * @memberof SyntaxHighlightingCapture
   */
  public buildPattern(): IPatternCapture | null {
    if (!this.$match || this.$capture.length === 0) {
      return null;
    }

    const capture: any = {};
    for (let index = 1; index <= this.capture.length; index++) {
      const scope = this.capture[index - 1];
      if (scope === ScopeEnum.Empty) {
        continue;
      }

      capture[`${index}`] = { name: scope };
    }
    return {
      captures: capture,
      match: this.$match
    };
  }

  /**
   * Adds the given regex to the string.
   *
   * @param {(string | null)} regex string that will be added
   * @returns {void}
   * @memberof SyntaxHighlightingCapture
   */
  private addRegexToMatch(regex: string | null): void {
    if (!regex || String.IsNullOrWhiteSpace(regex)) {
      return;
    }

    if (!this.match) {
      this.match = regex;
    } else {
      this.match += `\\s*${regex}`;
    }
  }
}
