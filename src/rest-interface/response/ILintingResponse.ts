import { MainNode } from "../../data-model/syntax-tree/MainNode";
import { ISchemaType } from "../schema/ISchemaType";

export interface ILintingResponse {
    variableNames: string[];
    staticStrings: string[];
    mainAstNode: MainNode;
    schema: ISchemaType;
}