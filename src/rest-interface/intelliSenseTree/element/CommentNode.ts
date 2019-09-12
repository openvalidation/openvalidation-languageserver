import { AliasHelper } from "../../../aliases/AliasHelper";
import { AliasKey } from "../../../aliases/AliasKey";
import { CompletionType } from "../../../enums/CompletionType";
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

    public getChilds(): GenericNode[] {
        var childList: GenericNode[] = [];
        return childList;
    }

    public getHoverContent(): HoverContent | null {
        var content: HoverContent = new HoverContent(this.getRange());

        content.setContent("Comment");

        return content;
    }

    protected formatLine(line: string, aliasesHelper: AliasHelper): string {
        var firstKeyword = line.trim().split(' ')[0];

        var commentKeyword = aliasesHelper.getKeywordByAliasKey(AliasKey.COMMENT);
        if (!commentKeyword ||
            firstKeyword.toUpperCase() === commentKeyword) return line;

        return FormattingHelper.generateSpaces(commentKeyword.length + 1) + line;
    }

    public getCompletionContainer(): CompletionContainer {
        return new CompletionContainer(CompletionType.None);
    }
}
