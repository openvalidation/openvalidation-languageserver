/**
 * Define the currently support AST-Types
 *
 * @export
 * @enum {number}
 */
export enum AstKey {
    Comment = 'CommentNode',
    Rule = 'RuleNode',
    Variable = 'VariableNode',
    Unknown = 'UnkownNode',
    OperationCondition = 'ConditionNode',
    OperationConditionGroup = 'ConnectedOperationNode',

    OperandFunction = 'FunctionOperandNode',
    OperandNode = 'OperandNode'
}