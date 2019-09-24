export enum CompletionState {
    Empty,
    FunctionOperand,
    ArrayOperand,
    Operand,
    
    OperationEnd,
    Operator,
    OperandMissing,
    
    RuleEnd,
    Comment,
    UnkownOperand
}