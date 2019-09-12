import { IComplexData } from "./IComplexData";
import { ISchemaProperty } from "./ISchemaProperty";

export interface ISchemaType {
    dataProperties: ISchemaProperty[];
    complexData: IComplexData[];
}