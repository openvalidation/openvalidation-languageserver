import { GenericNode } from "../GenericNode";
import { HoverContent } from "../../../helper/HoverContent";
import { AliasHelper } from "../../../aliases/AliasHelper";
import { CompletionContainer } from "../../../provider/code-completion/CompletionContainer";
import { CompletionState } from "../../../provider/code-completion/CompletionStates";
import { Position } from "vscode-languageserver";
import { IndexRange } from "../IndexRange";

export class VariableNameNode extends GenericNode {
    private name: string;

    constructor(lines: string[], range: IndexRange, name: string) {
        super(lines, range);
        this.name = name;
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string) {
        this.name = name;
    }

    public getChildren(): GenericNode[] {
        return [];
    }

    public getHoverContent(): HoverContent | null {
        return new HoverContent(this.getRange(), "Variable-Name: " + this.name);
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