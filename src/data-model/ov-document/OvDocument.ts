import { String } from "typescript-string-operations";
import { Position, Range } from "vscode-languageserver-types";
import { AliasHelper } from "../../aliases/AliasHelper";
import { StringHelper } from "../../helper/StringHelper";
import { GenericNode } from "../syntax-tree/GenericNode";
import { Variable } from "../syntax-tree/Variable";
import { OvElementManager } from "./OvElementManager";

/**
 * Holds the information of the current document. It saves every rule
 * with extra information in it
 *
 * @export
 * @class OvDocument
 */
export class OvDocument {
  public get $declarations(): Variable[] {
    return this.declarations;
  }

  public get $elementManager(): OvElementManager {
    return this.elementManager;
  }

  public get $aliasesHelper(): AliasHelper {
    return this.aliasesHelper;
  }

  private elementManager: OvElementManager;
  private declarations: Variable[];

  /**
   * Creates an instance of OvDocument.
   * @param {GenericNode[]} astElements parsed elements
   * @param {Variable[]} declarations found variables inside the document
   * @param {AliasHelper} aliasesHelper helper that contains the available aliases
   * @memberof OvDocument
   */
  constructor(
    astElements: GenericNode[],
    declarations: Variable[],
    private aliasesHelper: AliasHelper
  ) {
    this.elementManager = new OvElementManager();
    this.declarations = declarations;
    this.create(astElements);
  }

  /**
   * Finds and returns a word an an specific position in the document
   *
   * @param {Position} position where the word should be found
   * @returns {string} found word
   * @memberof OvDocument
   */
  public getStringByPosition(position: Position): [string, Range] | null {
    const line = this.getLineByLineNumber(position.line);
    if (String.IsNullOrWhiteSpace(line)) {
      return null;
    }

    const currentWord = StringHelper.getWordAt(line, position.character);
    if (String.IsNullOrWhiteSpace(currentWord)) {
      return null;
    }

    const indexOfWord = line.indexOf(currentWord);
    const wordRange = Range.create(
      position.line,
      indexOfWord,
      position.line,
      indexOfWord + currentWord.length
    );

    if (
      this.elementManager
        .getVariables()
        .find(v => !!v.$nameNode && v.$nameNode.$name === currentWord)
    ) {
      return [currentWord, wordRange];
    } else {
      // If this word is inside a variable name
      const variableContainsWord = this.elementManager
        .getVariables()
        .find(
          v =>
            !!v.$nameNode &&
            v.$nameNode.$name.search(
              new RegExp("\\b" + currentWord + "\\b")
            ) !== -1
        );
      if (!variableContainsWord) {
        return [currentWord, wordRange];
      }

      const variableName = variableContainsWord.$nameNode!.$name;
      const indexOfName = line.indexOf(variableName);
      if (indexOfName === -1) {
        return [currentWord, wordRange];
      }

      const rangeName = Range.create(
        position.line,
        indexOfName,
        position.line,
        indexOfName + variableName.length
      );
      return [variableName, rangeName];
    }
  }

  /**
   * Initializes the list of elements
   *
   * @private
   * @param {AstElement[]} astElements parsed elements
   * @param {string} documentText text of the document
   * @memberof OvDocument
   */
  private create(astElements: GenericNode[]): void {
    this.elementManager.addElements(astElements);
  }

  /**
   * Finds and returns the line with a specific number
   *
   * @param {number} position where the line should be found
   * @returns {string} found line
   * @memberof OvDocument
   */
  private getLineByLineNumber(lineNumber: number): string {
    if (this.elementManager.$elements.length === 0) {
      return "";
    }

    const elementList = this.elementManager.$elements.filter(rule => {
      const range = rule.$range;
      if (!range || !range.$start || !range.$end) {
        return false;
      }

      return range.$start.$line <= lineNumber && range.$end.$line >= lineNumber;
    });
    if (!elementList || elementList.length === 0) {
      return "";
    }

    const element = elementList[0];
    if (!element.$range || !element.$range.$start || !element.$range.$end) {
      return "";
    }
    return element.$lines[lineNumber - element.$range.$start.$line];
  }
}
