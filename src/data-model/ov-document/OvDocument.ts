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

    private elementManager: OvElementManager;
    private declarations: Variable[];

    constructor(astElements: GenericNode[], declarations: Variable[], private _aliaseHelper: AliasHelper) {
        this.elementManager = new OvElementManager();
        this.declarations = declarations;
        this.create(astElements);
    }

    public get $declarations(): Variable[] {
        return this.declarations;
    }

    public get $elementManager(): OvElementManager {
        return this.elementManager;
    }

    public get $aliaseHelper(): AliasHelper {
        return this._aliaseHelper;
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
     * Finds and returns a word an an specific position in the document
     *
     * @param {Position} position where the word should be found
     * @returns {string} found word
     * @memberof OvDocument
     */
    public getStringByPosition(position: Position): [string, Range] | null {
        var line = this.getLineByLineNumber(position.line);
        if (String.IsNullOrWhiteSpace(line)) return null;

        var currentWord = StringHelper.getWordAt(line, position.character);
        if (String.IsNullOrWhiteSpace(currentWord)) return null;

        var indexOfWord = line.indexOf(currentWord);
        var wordRange = Range.create(position.line, indexOfWord, position.line, indexOfWord + currentWord.length);

        if (this.elementManager.getVariables().find(v => !!v.getNameNode() && v.getNameNode()!.getName() == currentWord)) {
            return [currentWord, wordRange];
        } else {
            // If this word is inside a variable name
            var variableContainsWord = this.elementManager.getVariables()
                .find(v => v.getNameNode()!.getName().search(new RegExp('\\b' + currentWord + '\\b')) !== -1);
            if (!variableContainsWord) return [currentWord, wordRange];

            var variableName = variableContainsWord.getNameNode()!.getName();
            var indexOfName = line.indexOf(variableName);
            if (indexOfName == -1) return [currentWord, wordRange];

            var rangeName = Range.create(position.line, indexOfName, position.line, indexOfName + variableName.length);
            return [variableName, rangeName];
        }
    }

    /**
     * Finds and returns the line with a specific number
     *
     * @param {number} position where the line should be found
     * @returns {string} found line
     * @memberof OvDocument
     */
    private getLineByLineNumber(lineNumber: number): string {
        if (this.elementManager.$elements.length == 0) return "";

        var elementList = this.elementManager.$elements.filter(rule => {
            var range = rule.getRange();
            if (!range) return false;

            return range.getStart().getLine() <= lineNumber &&
                range.getEnd().getLine() >= lineNumber;
        });
        if (!elementList || elementList.length == 0) return "";

        var element = elementList[0];
        return element.getLines()[lineNumber - element.getRange().getStart().getLine()];
    }
}
