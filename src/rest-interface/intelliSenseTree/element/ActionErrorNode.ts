import { GenericNode } from "../GenericNode";
import { HoverContent } from "../../../helper/HoverContent";
import { AliasHelper } from "../../../aliases/AliasHelper";
import { CompletionContainer } from "../../../provider/code-completion/CompletionContainer";
import { CompletionState } from "../../../provider/code-completion/CompletionStates";
import { Position } from "vscode-languageserver";
import { IndexRange } from "../IndexRange";

export class ActionErrorNode extends GenericNode {

    private errorMessage: string;

    constructor(lines: string[], range: IndexRange, errorMessage: string) {
        super(lines, range);
        this.errorMessage = errorMessage;
    }

    public getErrorMessage(): string {
        return this.errorMessage;
    }

    public setErrorMessage(errorMessage: string) {
        this.errorMessage = errorMessage;
    }

    public getChildren(): GenericNode[] {
        return [];
    }

    public getHoverContent(): HoverContent | null {
        return new HoverContent(this.getRange(), "Error-Message: " + this.errorMessage);
    }

    public getBeautifiedContent(aliasesHelper: AliasHelper): string {
        return this.getLines().join("\n");
    }

    public isComplete(): boolean {
        return true;
    }

    public getCompletionContainer(position: Position): CompletionContainer {
        return CompletionContainer.create(CompletionState.Empty);
    }
}