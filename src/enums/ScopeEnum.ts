
/**
 * Enum for the textmate-scopes we use in syntax-highlighting
 *
 * @export
 * @enum {number}
 */
export enum ScopeEnum {
    Operation = 'operation.ov',
    Variable = 'variable.parameter.name.ov',
    Keyword = 'keyword.ov',
    
    StaticString = 'string.static.operand.ov',
    StaticNumber = 'constant.numeric.integer.decimal.ov',

    Empty = 'semantical.sugar.ov'
}