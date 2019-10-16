import { Type } from "class-transformer";
import { MainNode } from "../../data-model/syntax-tree/MainNode";
import { ISchemaType } from "../schema/ISchemaType";
import { LintingError } from "./LintingError";

/**
 * Class for the response of the most-import REST-API.
 * It consists of the parsed schema, the parsed elements inside the document and the errors.
 *
 * @export
 * @class LintingResponse
 */
export class LintingResponse {
  private schema: ISchemaType;

  @Type(() => MainNode)
  private mainAstNode: MainNode;

  @Type(() => LintingError)
  private errors: LintingError[];

  /**
   * Creates an instance of LintingResponse.
   * @param {MainNode} mainAstNode parsed syntax-tree mainNode
   * @param {ISchemaType} schema parsed schema
   * @memberof LintingResponse
   */
  constructor(mainAstNode: MainNode, schema: ISchemaType) {
    this.errors = [];
    this.mainAstNode = mainAstNode;
    this.schema = schema;
  }

  public get $errors(): LintingError[] {
    return this.errors;
  }
  public set $errors(errors: LintingError[]) {
    this.errors = errors;
  }

  public get $mainAstNode(): MainNode {
    return this.mainAstNode;
  }
  public set $mainAstNode(mainAstNode: MainNode) {
    this.mainAstNode = mainAstNode;
  }

  public get $schema(): ISchemaType {
    return this.schema;
  }
}
