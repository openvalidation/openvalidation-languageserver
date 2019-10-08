
/**
 * Enum for the textmate-scopes we use in syntax-highlighting
 *
 * @export
 * @enum {number}
 */
export enum ScopeEnum {
    Variable = 'variable.parameter.ov',
    Keyword = 'keyword.ov',
    Comment = 'comment.block.ov',

    StaticString = 'string.unquoted.ov',
    StaticNumber = 'constant.numeric.ov',

    Empty = 'semantical.sugar.ov'
}
