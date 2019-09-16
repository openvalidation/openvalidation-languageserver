import { MainNode } from "../intelliSenseTree/MainNode";
import { ISchemaType } from "../schema/ISchemaType";

export interface ILintingResponse {
    variableNames: string[];
    staticStrings: string[];
    mainAstNode: MainNode;
    schema: ISchemaType;
}