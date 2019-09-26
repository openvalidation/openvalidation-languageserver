import { Position } from "vscode-languageserver";
import { AliasHelper } from "../../../aliases/AliasHelper";
import { HoverContent } from "../../../helper/HoverContent";
import { CompletionContainer } from "../../../provider/code-completion/CompletionContainer";
import { GenericNode } from "../GenericNode";
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

    public getCompletionContainer(position: Position): CompletionContainer {
        return CompletionContainer.init().emptyTransition();
    }
}