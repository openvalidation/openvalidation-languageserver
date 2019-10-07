import { GenericNode } from "../GenericNode";
import { HoverContent } from "../../../helper/HoverContent";
import { AliasHelper } from "../../../aliases/AliasHelper";
import { CompletionContainer } from "../../../provider/code-completion/CompletionContainer";
import { Position } from "vscode-languageserver";
import { IndexRange } from "../IndexRange";

export class ActionErrorNode extends GenericNode {

    private errorMessage: string;

    constructor(lines: string[], range: IndexRange, errorMessage: string) {
        super(lines, range);
        this.errorMessage = errorMessage;
    }

    public get $errorMessage(): string {
        return this.errorMessage;
    }

    public getChildren(): GenericNode[] {
        return [];
    }

    public getHoverContent(): HoverContent {
        return new HoverContent(this.$range, "Error-Message: " + this.errorMessage);
    }

    public getBeautifiedContent(aliasesHelper: AliasHelper): string {
        return this.defaultFormatting();
    }

    public getCompletionContainer(position: Position): CompletionContainer {
        return CompletionContainer.init().emptyTransition();
    }
}