import { TypeOptions } from "class-transformer";
import { CommentNode } from "./element/CommentNode";
import { ConnectedOperationNode } from "./element/operation/ConnectedOperationNode";
import { ArrayOperandNode } from "./element/operation/operand/ArrayOperandNode";
import { FunctionOperandNode } from "./element/operation/operand/FunctionOperandNode";
import { OperandNode } from "./element/operation/operand/OperandNode";
import { OperationNode } from "./element/operation/OperationNode";
import { RuleNode } from "./element/RuleNode";
import { UnkownNode } from "./element/UnkownNode";
import { VariableNode } from "./element/VariableNode";

/**
 * Class that tries to outsource the class-transformer generation.
 * This currently don't workes in all classes so it need to be maintained for each class
 *  independently (see https://github.com/typestack/class-transformer/issues/297)
 */

export class TypeDecorator {
  public static getOperationOptions(): TypeOptions {
    return {
      discriminator: {
        property: "type",
        subTypes: [
          { value: OperationNode, name: "OperationNode" },
          { value: ConnectedOperationNode, name: "ConnectedOperationNode" },
          { value: FunctionOperandNode, name: "FunctionOperandNode" },
          { value: OperandNode, name: "OperandNode" },
          { value: ArrayOperandNode, name: "ArrayOperandNode" }
        ]
      }
    };
  }

  public static getGenericOptions(): TypeOptions {
    return {
      discriminator: {
        property: "type",
        subTypes: [
          { value: CommentNode, name: "CommentNode" },
          { value: VariableNode, name: "VariableNode" },
          { value: RuleNode, name: "RuleNode" },
          { value: OperationNode, name: "OperationNode" },
          { value: ConnectedOperationNode, name: "ConnectedOperationNode" },
          { value: FunctionOperandNode, name: "FunctionOperandNode" },
          { value: OperandNode, name: "OperandNode" },
          { value: UnkownNode, name: "UnkownNode" },
          { value: ArrayOperandNode, name: "ArrayOperandNode" }
        ]
      }
    };
  }
}
