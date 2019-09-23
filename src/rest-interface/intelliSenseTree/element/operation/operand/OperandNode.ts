import { Position } from "vscode-languageserver";
import { AliasHelper } from "../../../../../aliases/AliasHelper";
import { FormattingHelper } from "../../../../../helper/FormattingHelper";
import { HoverContent } from "../../../../../helper/HoverContent";
import { CompletionContainer } from "../../../../../provider/code-completion/CompletionContainer";
import { GenericNode } from "../../../GenericNode";
import { IndexRange } from "../../../IndexRange";
import { BaseOperandNode } from "./BaseOperandNode";

export class OperandNode extends BaseOperandNode {
    constructor(lines: string[], range: IndexRange, dataType: string, name: string | null) {
        super(lines, range, dataType, name);
    }

    public getChildren(): GenericNode[] {
        var childList: GenericNode[] = [];
        return childList;
    }

    public getHoverContent(): HoverContent | null {
        var content: HoverContent = new HoverContent(this.getRange());

        content.setContent("Operand " + this.getName() + ": " + this.getDataType());

        return content;
    }

    public completionBeforeNode(): CompletionContainer {
        return CompletionContainer.empty();
    }

    public completionAfterNode(): CompletionContainer {
        return CompletionContainer.operator(this.getDataType());
    }

    public completionInsideNode(range: Position): CompletionContainer {
        return CompletionContainer.empty();
    }

    public isComplete(): boolean {
        return true;
    }
    
    public getBeautifiedContent(aliasesHelper: AliasHelper): string {
        return this.getLines().map(line => FormattingHelper.removeDuplicateWhitespacesFromLine(line)).join("\n");
    }
}
