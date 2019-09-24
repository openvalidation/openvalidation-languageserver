export enum CompletionState {
    Empty,


    FunctionOperand,
    ArrayOperand,
    Operand,
    
    Variable,
    LeftOperandVariable,
    ConnectedOperation,
    RightOperand,
    Operator,
    OperandMissing,
    RightOperandUnkown,
    RuleStart,
    LeftOperandRule,
    RuleEnd,
    Comment
}