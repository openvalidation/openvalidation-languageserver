import { Type } from 'class-transformer';
import { AliasHelper } from 'src/aliases/AliasHelper';
import { Position } from 'vscode-languageserver';
import { ScopeEnum } from '../../../../../enums/ScopeEnum';
import { HoverContent } from '../../../../../helper/HoverContent';
import { CompletionContainer } from '../../../../../provider/code-completion/CompletionContainer';
import { SyntaxHighlightingCapture } from '../../../../../provider/syntax-highlighting/SyntaxHighlightingCapture';
import { GenericNode } from '../../../GenericNode';
import { IndexRange } from '../../../IndexRange';
import { ConnectedOperationNode } from '../ConnectedOperationNode';
import { OperationNode } from '../OperationNode';
import { ArrayOperandNode } from './ArrayOperandNode';
import { BaseOperandNode } from './BaseOperandNode';
import { OperandNode } from './OperandNode';

export class FunctionOperandNode extends BaseOperandNode {
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
    private parameters: BaseOperandNode[];

    private acceptedType: string;

    constructor(
        parameters: BaseOperandNode[],
        lines: string[],
        range: IndexRange,
        dataType: string,
        name: string,
        acceptedType: string
    ) {
        super(lines, range, dataType, name);
        this.parameters = parameters;
        this.acceptedType = acceptedType;
    }

    /**
     * Getter parameters
     * @return {BaseOperandNode[]}
     */
    public get $parameters(): BaseOperandNode[] {
        return this.parameters;
    }

    public get $acceptedType(): string {
        return this.acceptedType;
    }

    public getChildren(): GenericNode[] {
        return this.$parameters;
    }

    /**
     * Setter parameters
     * @param {BaseOperandNode[]} value
     */
    public setParameters(value: BaseOperandNode[]) {
        this.parameters = value;
    }

    public getHoverContent(): HoverContent {
        const stringContent: string = 'Function ' + this.$name + ': ' + this.$dataType;
        const content: HoverContent = new HoverContent(this.$range, stringContent);
        return content;
    }

    public getCompletionContainer(position: Position): CompletionContainer {
        const container = CompletionContainer.init();
        if (!this.isComplete()) {
            container.operandTransition(this.$dataType);
        }
        return container;
    }

    public isComplete(): boolean {
        return this.parameters.length > 0;
    }

    public getBeautifiedContent(aliasesHelper: AliasHelper): string {
        return this.defaultFormatting();
    }

    public getPatternInformation(aliasesHelper: AliasHelper): SyntaxHighlightingCapture | null {
        const capture = new SyntaxHighlightingCapture();
        capture.addRegexGroupAndCapture(`(?i)${this.$name}`, ScopeEnum.Keyword);

        for (const parameter of this.$parameters) {
            capture.merge(parameter.getPatternInformation(aliasesHelper));
        }

        return capture;
    }
}
