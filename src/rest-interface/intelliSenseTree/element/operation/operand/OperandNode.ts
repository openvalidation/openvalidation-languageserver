import { Position } from "vscode-languageserver";
import { AliasHelper } from "../../../../../aliases/AliasHelper";
import { FormattingHelper } from "../../../../../helper/FormattingHelper";
import { HoverContent } from "../../../../../helper/HoverContent";
import { CompletionContainer } from "../../../../../provider/code-completion/CompletionContainer";
import { GenericNode } from "../../../GenericNode";
import { IndexRange } from "../../../IndexRange";
import { BaseOperandNode } from "./BaseOperandNode";
import { CompletionState } from "../../../../../provider/code-completion/CompletionStates";

export class OperandNode extends BaseOperandNode {
    constructor(lines: string[], range: IndexRange, dataType: string, name: string | null) {
        super(lines, range, dataType, name);
    }

    public getChildren(): GenericNode[] {
        var childList: GenericNode[] = [];
        return childList;
    }

    public getHoverContent(): HoverContent | null {
        var stringContent: string = "Operand " + this.getName() + ": " + this.getDataType();
        var content: HoverContent = new HoverContent(this.getRange(), stringContent);
        return content;
    }

    public getCompletionContainer(position: Position): CompletionContainer {
        var container = CompletionContainer.create(CompletionState.Empty);
        container.setDataType(this.getDataType());
        return container;
    }

    public isComplete(): boolean {
        return false;
    }
    
    public getBeautifiedContent(aliasesHelper: AliasHelper): string {
        return this.getLines().map(line => FormattingHelper.removeDuplicateWhitespacesFromLine(line)).join("\n");
    }
}
