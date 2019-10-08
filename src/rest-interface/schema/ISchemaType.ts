import { IComplexData } from './IComplexData';
import { ISchemaProperty } from './ISchemaProperty';

/**
 * Interface for the parsed schema which we get from the rest-interface.
 * It contains especially a list of complex items which consists of a child and parent.
 *
 * @export
 * @interface ISchemaType
 */
export interface ISchemaType {
    dataProperties: ISchemaProperty[];
    complexData: IComplexData[];
}
