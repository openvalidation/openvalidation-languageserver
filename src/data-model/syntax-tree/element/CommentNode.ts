import { Position } from "vscode-languageserver";
import { AliasHelper } from "../../../aliases/AliasHelper";
import { FormattingHelper } from "../../../helper/FormattingHelper";
import { HoverContent } from "../../../helper/HoverContent";
import { CompletionContainer } from "../../../provider/code-completion/CompletionContainer";
import { GenericNode } from "../GenericNode";
import { IndexRange } from "../IndexRange";

export class CommentNode extends GenericNode {
  public content: string;

  constructor(lines: string[], range: IndexRange, content: string) {
    super(lines, range);
    this.content = content;
  }

  public getChildren(): GenericNode[] {
    const childList: GenericNode[] = [];
    return childList;
  }

  public getHoverContent(): HoverContent {
    const content: HoverContent = new HoverContent(this.$range, "Comment");
    return content;
  }

  public getCompletionContainer(range: Position): CompletionContainer {
    return CompletionContainer.init().emptyTransition();
  }

  public getBeautifiedContent(aliasesHelper: AliasHelper): string {
    const commentKeyword: string | null = aliasesHelper.getCommentKeyword();
    if (!commentKeyword) {
      return this.$lines.join("\\n");
    }

    const spaces = FormattingHelper.generateSpaces(commentKeyword.length + 1);

    let returnString: string = FormattingHelper.removeDuplicateWhitespacesFromLine(
      this.$lines[0]
    );
    for (let index = 1; index < this.$lines.length; index++) {
      const lineWithoutSpaces = FormattingHelper.removeDuplicateWhitespacesFromLine(
        this.$lines[index]
      );
      const element = "\n" + spaces + lineWithoutSpaces.trim();
      returnString += element;
    }
    return returnString;
  }
}
