import { Type } from "class-transformer";
import { MainNode } from "../../data-model/syntax-tree/MainNode";
import { ISchemaType } from "../schema/ISchemaType";
import { LintingError } from "./LintingError";

export class LintingResponse {
    private schema: ISchemaType;

    @Type(() => MainNode)
    private mainAstNode: MainNode;
    
    @Type(() => LintingError)
    private errors: LintingError[];

    constructor(mainAstNode: MainNode, schema: ISchemaType) {
        this.errors = [];
        this.mainAstNode = mainAstNode;
        this.schema = schema;
    }

    public getErrors(): LintingError[] {
        return this.errors;
    }
    
    public getMainAstNode(): MainNode {
        return this.mainAstNode;
    }

    public getSchema(): ISchemaType {
        return this.schema;
    }
}