import { MainNode } from "src/rest-interface/intelliSenseTree/MainNode";
import { ISchemaType } from "src/rest-interface/schema/ISchemaType";

/**
 * General data-object for any REST-Requests
 *
 * @export
 * @interface GeneralApiResponse
 */
export interface GeneralApiResponse {
    variableNames: string[];
    staticStrings: string[];
    ruleErrors: string[];
    mainAstNode: MainNode;
    schema: ISchemaType;
}