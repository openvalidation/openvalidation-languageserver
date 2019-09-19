import { CompletionType } from "../../../enums/CompletionType";
import { HoverContent } from "../../../helper/HoverContent";
import { CompletionContainer } from "../../../provider/code-completion/CompletionContainer";
import { GenericNode } from "../GenericNode";
import { IndexRange } from "../IndexRange";
import { AliasHelper } from "src/aliases/AliasHelper";
import { TextEdit, Position } from "vscode-languageserver";

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
        var content: HoverContent = new HoverContent(this.getRange());
        content.setContent("Comment");
        return content;
    }

        /**
     * Generates a list of edits for formatting this element
     *
     * @returns {TextEdit[]} text-edits that need to be done for the formatting of this element
     * @memberof OvRule
     */
    public formatCode(aliasesHelper: AliasHelper): TextEdit[] {
        var commentKeyword: string | null = aliasesHelper.getCommentKeyword();
        if (!commentKeyword) return [];

        // var spaces = commentKeyword.length + 1;

        //Foreach line
        // var textEdit: TextEdit = {
        //     newText: formattedLine,
        //     range: Range.create(currentLineNumber, 0, currentLineNumber, lineToCheck.length)
        // }
        // textEdits.push(textEdit);
        return [];
    }

    public getCompletionContainer(range: Position): CompletionContainer {
        return new CompletionContainer(CompletionType.None);
    }    

    public isComplete(): boolean {
        return true;
    }
}
