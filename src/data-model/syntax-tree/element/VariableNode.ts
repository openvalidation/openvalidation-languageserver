import { Type } from 'class-transformer';
import { String } from 'typescript-string-operations';
import { Position, Range } from 'vscode-languageserver';
import { AliasHelper } from '../../../aliases/AliasHelper';
import { AliasKey } from '../../../aliases/AliasKey';
import { FormattingHelper } from '../../../helper/FormattingHelper';
import { HoverContent } from '../../../helper/HoverContent';
import { CompletionContainer } from '../../../provider/code-completion/CompletionContainer';
import { GenericNode } from '../GenericNode';
import { IndexRange } from '../IndexRange';
import { ConnectedOperationNode } from './operation/ConnectedOperationNode';
import { ArrayOperandNode } from './operation/operand/ArrayOperandNode';
import { BaseOperandNode } from './operation/operand/BaseOperandNode';
import { FunctionOperandNode } from './operation/operand/FunctionOperandNode';
import { OperandNode } from './operation/operand/OperandNode';
import { OperationNode } from './operation/OperationNode';
import { VariableNameNode } from './VariableNameNode';

export class VariableNode extends GenericNode {
    @Type(() => BaseOperandNode, {
        discriminator: {
            property: 'type',
            subTypes: [
                { value: OperationNode, name: 'OperationNode' },
                { value: ConnectedOperationNode, name: 'ConnectedOperationNode' },
                { value: FunctionOperandNode, name: 'FunctionOperandNode' },
                { value: OperandNode, name: 'OperandNode' },
                { value: ArrayOperandNode, name: 'ArrayOperandNode' }
            ]
        }
    })
    private value: BaseOperandNode | null;

    @Type(() => VariableNameNode)
    private nameNode: VariableNameNode | null;

    constructor(nameNode: VariableNameNode | null, value: BaseOperandNode | null, lines: string[], range: IndexRange) {
        super(lines, range);
        this.nameNode = nameNode;
        this.value = value;
    }

    public getChildren(): GenericNode[] {
        const childList: GenericNode[] = [];

        if (!!this.value) {
            childList.push(this.value);
        }

        return childList;
    }

    public get $value(): BaseOperandNode | null {
        return this.value;
    }
    public set $value(value: BaseOperandNode | null) {
        this.value = value;
    }

    public get $nameNode(): VariableNameNode | null {
        return this.nameNode;
    }
    public set $nameNode(value: VariableNameNode | null) {
        this.nameNode = value;
    }

    /**
     * Returns the Range of the name of this variable
     *
     * @returns {(IndexRange | null)}
     * @memberof OvVariable
     */
    public getRangeOfVariableName(): Range {
        if (!this.$nameNode) { return this.$range.asRange(); }

        return this.$nameNode.$range.asRange();
    }

    public getHoverContent(): HoverContent {
        let contentText = 'Variable' + (!this.$nameNode ? ' ' : ' ' + this.$nameNode.$name);
        if (!!this.$value) {
            contentText += ': ' + this.$value.$dataType;
        }

        const content: HoverContent = new HoverContent(this.$range, contentText);
        return content;
    }

    public getCompletionContainer(position: Position): CompletionContainer {
        if (!!this.$nameNode && !this.$nameNode.$range.startsAfter(position)) {
            return CompletionContainer.init().emptyTransition();
        }

        const nameFilter: string | undefined = !this.$nameNode ? undefined : this.$nameNode.$name;

        if (!this.value) {
            return CompletionContainer.init().operandTransition(undefined, nameFilter);
        }

        const container = this.value.getCompletionContainer(position);
        if (container.isEmpty()) {
            container.operatorTransition(this.value.$dataType);
        }

        if (!!nameFilter) {
            container.addNameFilterToAllOperands(nameFilter);
        }

        return container;
    }

    public getBeautifiedContent(aliasesHelper: AliasHelper): string {
        const variableString: string = this.$lines.join('\n');
        if (!this.value) { return variableString; }

        const asKeyword: string | null = aliasesHelper.getKeywordByAliasKey(AliasKey.AS);
        if (!asKeyword) { return variableString; }

        const splittedVariable: string[] = variableString.split(this.value.$lines.join('\n'));
        let returnString: string = '';

        const spaces = FormattingHelper.generateSpaces(asKeyword.length + 1);
        let conditionString: string = this.value.getBeautifiedContent(aliasesHelper);
        conditionString = conditionString.replace(new RegExp('\n', 'g'), '\n' + spaces);
        returnString += spaces + conditionString + '\n';

        for (const splittedLine of splittedVariable) {
            if (!String.IsNullOrWhiteSpace(splittedLine)) {
                returnString += FormattingHelper.removeDuplicateWhitespacesFromLine(splittedLine);
            }
        }
        return returnString;
    }
}
