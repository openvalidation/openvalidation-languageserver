import { Type } from 'class-transformer';
import { Position } from 'vscode-languageserver';
import { AliasHelper } from '../../../../aliases/AliasHelper';
import { FormattingHelper } from '../../../../helper/FormattingHelper';
import { HoverContent } from '../../../../helper/HoverContent';
import { CompletionContainer } from '../../../../provider/code-completion/CompletionContainer';
import { SyntaxHighlightingCapture } from '../../../../provider/syntax-highlighting/SyntaxHighlightingCapture';
import { GenericNode } from '../../GenericNode';
import { IndexRange } from '../../IndexRange';
import { ConditionNode } from './ConditionNode';
import { OperationNode } from './OperationNode';

export class ConnectedOperationNode extends ConditionNode {
    @Type(() => ConditionNode, {
        discriminator: {
            property: 'type',
            subTypes: [
                { value: OperationNode, name: 'OperationNode' },
                { value: ConnectedOperationNode, name: 'ConnectedOperationNode' }
            ]
        }
    })
    private conditions: ConditionNode[];

    constructor(conditions: ConditionNode[], lines: string[], range: IndexRange) {
        super(lines, range);
        this.conditions = conditions;
    }

    public get $conditions(): ConditionNode[] {
        return this.conditions;
    }

    public set $conditions(value: ConditionNode[]) {
        this.conditions = value;
    }

    public get $constrained(): boolean {
        return this.$conditions.map(cond => cond.$constrained).some(bool => bool);
    }

    public getChildren(): GenericNode[] {
        const childList: GenericNode[] = [];

        childList.push(...this.conditions);

        return childList;
    }

    public getHoverContent(): HoverContent {
        const content: HoverContent = new HoverContent(this.$range, 'ConnectedOperation');
        return content;
    }

    public getCompletionContainer(position: Position): CompletionContainer {
        if (this.$conditions.length === 0) {
            return CompletionContainer.init().operandTransition();
        }

        for (let index = 0; index < this.$conditions.length - 1; index++) {
            const firstElement = this.$conditions[index];

            if (firstElement.$range.includesPosition(position)) {
                return firstElement.getCompletionContainer(position);
            }

            const secondElement = this.$conditions[index + 1];

            // Position is between both elements
            if (firstElement.$range.endsBefore(position) &&
                secondElement.$range.startsAfter(position)) {
                return firstElement.getCompletionContainer(position);
            }
        }

        return this.$conditions[this.$conditions.length - 1].getCompletionContainer(position);
    }

    public getBeautifiedContent(aliasHelper: AliasHelper): string {
        if (this.$conditions.length === 0) { return this.$lines.join('\n'); }

        let returnString: string = '';

        const extraSpacesForNestedOperation: string = !!this.$connector
            ? FormattingHelper.generateSpaces(this.$connector!.length + 1)
            : '';

        for (let index = 0; index < this.$conditions.length; index++) {
            const element = this.$conditions[index];

            returnString += element.getBeautifiedContent(aliasHelper);
            returnString = returnString.replace(/(?:\r\n|\r|\n)/g, ('\n' + extraSpacesForNestedOperation));

            if (index !== this.$conditions.length - 1) {
                returnString += '\n';
            }
        }

        return returnString;
    }

    public isComplete(): boolean {
        return this.conditions.map(cond => cond.isComplete()).every(bool => bool);
    }

    public getPatternInformation(aliasesHelper: AliasHelper): SyntaxHighlightingCapture | null {
        if (this.conditions.length === 0) { return null; }

        const capture = new SyntaxHighlightingCapture();
        for (const condition of this.conditions) {
            capture.merge(condition.getPatternInformation(aliasesHelper));
        }

        return capture;
    }
}
