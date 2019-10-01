import { Range } from "vscode-languageserver-types";
import { CommentNode } from "../syntax-tree/element/CommentNode";
import { RuleNode } from "../syntax-tree/element/RuleNode";
import { VariableNode } from "../syntax-tree/element/VariableNode";
import { GenericNode } from "../syntax-tree/GenericNode";

/**
 * Saves all elements of an OvDocument and provides a few methods 
 * for getting specific elements
 *
 * @export
 * @class OvElementManager
 */
export class OvElementManager {
    private elements: GenericNode[];

    constructor() {
        this.elements = [];
    }

    /**
     * Returns generic Elements
     *
     * @readonly
     * @type {GenericNode[]}
     * @memberof OvElementManager
     */
    public get $elements(): GenericNode[] {
        return this.elements;
    }

    public addElement(element: GenericNode) {
        this.elements.push(element);
    }

    public addElements(element: GenericNode[]) {
        this.elements.push(...element);
    }

    /**
     * Returns all known variables
     *
     * @returns {VariableNode[]} list of known variables
     * @memberof OvElementManager
     */
    public getVariables(): VariableNode[] {
        return this.elements.filter(element => element instanceof VariableNode) as VariableNode[];
    }

    /**
     * Returns all known rules
     *
     * @readonly
     * @returns {RuleNode[]} list of known variables
     * @memberof OvElementManager
     */
    public getRules(): RuleNode[] {
        return this.elements.filter(element => element instanceof RuleNode) as RuleNode[];
    }

    /**
     * Returns all known comments
     *
     * @readonly
     * @returns {CommentNode[]} list of known comments
     * @memberof OvElementManager
     */
    public getComments(): CommentNode[] {
        return this.elements.filter(element => element instanceof CommentNode) as CommentNode[];
    }

    /**
     * Finds and returns the element at an specific position in the document
     *
     * @param {Position} range position where the element should be found
     * @returns {GenericNode[]} found rules
     * @memberof OvDocument
     */
    public getElementsByRange(range: Range): GenericNode[] {
        var elements = this.elements.filter(rule => {
            var elementRange = rule.getRange();
            if (!elementRange) return false;

            var afterStart = range.start.line <= elementRange.getStart().getLine();
            var beforeEnd = range.end.line >= elementRange.getEnd().getLine();
            return afterStart && beforeEnd;
        });
        return elements;
    }

    /**
     * Searches for variables with the specified name and returns it
     *
     * @param {string} name name of the defined varialbe
     * @returns {(VariableNode[] | null)} the found variables or null
     * @memberof OvDocument
     */
    public getVariablesByName(name: string): VariableNode[] | null {
        var filteredVariables: VariableNode[] = this.getVariables().filter(element => !!element.getNameNode() && element.getNameNode()!.getName().toLowerCase() == name.toLowerCase());
        if (filteredVariables.length > 0) {
            return filteredVariables;
        }
        return null;
    }

    /**
     * Returns all variables, that are used inside the given string
     *
     * @param {string} element string where we search for variables
     * @param {(string | null)} asKeyword as-keyword is used to determine, whether the found variable is the element inside our string.
     * We don't want to get the node which is declared inside the element
     * @returns {VariableNode[]}
     * @memberof OvElementManager
     */
    public getUsedVariables(element: string, asKeyword: string | null): VariableNode[] {
        var returnNode: VariableNode[] = [];

        for (const variable of this.getVariables()) {
            if (!variable.getNameNode() ||
                !variable.getValue() ||
                element.indexOf(variable.getNameNode()!.getName()) == -1)
                continue;

            if (!asKeyword || element.toLowerCase().indexOf(asKeyword.toLowerCase() + " " + variable.getNameNode()!.getName().toLowerCase()) == -1) {
                returnNode.push(variable);
            }
        }

        return returnNode;
    }
}