import { Position } from "vscode-languageserver";
import { AliasHelper } from "../../../aliases/AliasHelper";
import { FormattingHelper } from "../../../helper/FormattingHelper";
import { HoverContent } from "../../../helper/HoverContent";
import { CompletionContainer } from "../../../provider/code-completion/CompletionContainer";
import { GenericNode } from "../GenericNode";
import { IndexRange } from "../IndexRange";

export class CommentNode extends GenericNode {
    public content: string;

    constructor(content: string, lines: string[], range: IndexRange) {
        super(lines, range)
        this.content = content;
    }

    public getChildren(): GenericNode[] {
        var childList: GenericNode[] = [];
        return childList;
    }

    public getHoverContent(): HoverContent | null {
        var content: HoverContent = new HoverContent(this.getRange(), "Comment");
        return content;
    }

    public getCompletionContainer(range: Position): CompletionContainer {
        return CompletionContainer.init();
    }

    public isComplete(): boolean {
        return true;
    }

    public getBeautifiedContent(aliasesHelper: AliasHelper): string {
        var commentKeyword: string | null = aliasesHelper.getCommentKeyword();
        if (!commentKeyword) return this.getLines().join('\\n');

        var spaces = FormattingHelper.generateSpaces(commentKeyword.length + 1);

        var returnString: string = FormattingHelper.removeDuplicateWhitespacesFromLine(this.getLines()[0]);
        for (let index = 1; index < this.getLines().length; index++) {
            const lineWithoutSpaces = FormattingHelper.removeDuplicateWhitespacesFromLine(this.getLines()[index]);
            const element =  "\n" + spaces + lineWithoutSpaces.trim();
            returnString += element;
        }
        return returnString;
    }
}
