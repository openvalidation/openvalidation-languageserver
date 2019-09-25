import { Diagnostic, Position, Range } from "vscode-languageserver-types";
import { CommentNode } from "../../rest-interface/intelliSenseTree/element/CommentNode";
import { RuleNode } from "../../rest-interface/intelliSenseTree/element/RuleNode";
import { VariableNode } from "../../rest-interface/intelliSenseTree/element/VariableNode";
import { GenericNode } from "../../rest-interface/intelliSenseTree/GenericNode";

/**
 * Saves all elements of an OvDocument and provides a few methods 
 * for getting specific elements
 *
 * @export
 * @class OvElementManager
 */
export class OvElementManager {
    private _elements: GenericNode[];
    private _errors: Diagnostic[][];

    constructor() {
        this._elements = [];
        this._errors = [];
    }

    /**
     * Returns generic Elements
     *
     * @readonly
     * @type {GenericNode[]}
     * @memberof OvElementManager
     */
    public getElements(): GenericNode[] {
        return this._elements;
    }

    public addElement(element: GenericNode) {
        this._elements.push(element);
    }

    public overrideElement(element: GenericNode, index: number) {
        if (this._elements.length <= index) {
            this._elements.push(element);
            if (this._elements.length <= index)
                throw Error("Can't override Element");
        }

        this._elements[index] = element;
    }

    public addElements(element: GenericNode[]) {
        this._elements = this._elements.concat(element);
    }

    public getErrors(): Diagnostic[][] {
        return this._errors;
    }

    public addError(element: Diagnostic[]) {
        this._errors.push(element);
    }

    public overrideError(element: Diagnostic[], index: number) {
        if (this._errors.length <= index) {
            this._errors.push(element)
            if (this._errors.length <= index)
                throw Error("Can't override Error");
        }
        this._errors[index] = element;
    }

    /**
     * Returns all known variables
     *
     * @readonly
     * @type {OvVariable[]}
     * @memberof OvElementManager
     */
    public getVariables(): VariableNode[] {
        return this._elements.filter(element => element instanceof VariableNode) as VariableNode[];
    }

    /**
     * Returns all known rules
     *
     * @readonly
     * @type {OvRule[]}
     * @memberof OvElementManager
     */
    public getRules(): RuleNode[] {
        return this._elements.filter(element => element instanceof RuleNode) as RuleNode[];
    }

    /**
     * Returns all known comments
     *
     * @readonly
     * @type {OvComment[]}
     * @memberof OvElementManager
     */
    public getComments(): CommentNode[] {
        return this._elements.filter(element => element instanceof CommentNode) as CommentNode[];
    }

    /**
     * Finds and returns the element at an specific position in the document
     *
     * @param {Position} position position where the element should be found
     * @returns {(GenericNode | undefined)} found rule
     * @memberof OvDocument
     */
    public getElementByPosition(position: Position): GenericNode | undefined {
        var lineNumber = position.line;

        var element = this.getElements().filter(rule => {
            var range = rule.getRange();
            if (!range) return false;

            return range.getStart().getLine() <= lineNumber &&
                range.getEnd().getLine() >= lineNumber;
        });
        if (!element || element.length == 0) return undefined;

        return element[0];
    }

    /**
     * Finds and returns the element at an specific position in the document
     *
     * @param {Position} range position where the element should be found
     * @returns {GenericNode[]} found rules
     * @memberof OvDocument
     */
    public getElementsByRange(range: Range): GenericNode[] {
        var elements = this.getElements().filter(rule => {
            var elementRange = rule.getRange();
            if (!elementRange) return false;

            var afterStart = range.start.line <= elementRange.getStart().getLine();
            var beforeEnd = range.end.line >= elementRange.getEnd().getLine();
            return afterStart && beforeEnd;
        });
        return elements;
    }

    /**
     * Searches for a rule with the specified name and returns it
     *
     * @param {string} name name of the defined rule
     * @returns {(OvVariable | null)} the found rule or null
     * @memberof OvDocument
     */
    public getVariablesByName(name: string): VariableNode[] | null {
        var filteredVariables: VariableNode[] = this.getVariables().filter(element => !!element.getNameNode() && element.getNameNode()!.getName().toLowerCase() == name.toLowerCase());
        if (filteredVariables.length > 0) {
            return filteredVariables;
        }
        return null;
    }

    public getLines(): string {
        var lines: string[] = this._elements.map(element => element.getLines().join('\n'));
        return lines.join("\n\n");
    }

    public updateElementRanges(lineIndices: [number, number][]): void {
        for (let index = 0; index < lineIndices.length; index++) {
            const indices: [number, number] = lineIndices[index];
            if (index >= this.getElements().length) break;

            var element = this.getElements()[index];
            var difference: number = indices[0] - element.getRange().getStart().getLine();
            element.updateRangeLines(difference);

            var errors = this.getErrors()[index];
            for (const error of errors) {
                error.range = Range.create(indices[0], 0, indices[1], 20);
            }
        }
    }
}