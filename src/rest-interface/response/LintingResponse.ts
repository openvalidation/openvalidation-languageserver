import { Type } from "class-transformer";
import { RuleResponseError } from "./error/RuleResponseError";
import { MainNode } from "../intelliSenseTree/MainNode";
import { ISchemaType } from "../schema/ISchemaType";

export class LintingResponse {
    private variableNames: string[];
    private staticStrings: string[];
    private schema: ISchemaType;

    @Type(() => MainNode)
    private mainAstNode: MainNode;
    
    @Type(() => RuleResponseError)
    private errors: RuleResponseError[];

    constructor(mainAstNode: MainNode, schema: ISchemaType) {
        this.errors = [];
        this.variableNames = [];
        this.staticStrings = [];
        this.mainAstNode = mainAstNode;
        this.schema = schema;
    }

    public getErrors(): RuleResponseError[] {
        return this.errors;
    }

    public getVariableNames(): string[] {
        return this.variableNames;
    }
    
    public getStaticStrings(): string[] {
        return this.staticStrings;
    }

    public getMainAstNode(): MainNode {
        return this.mainAstNode;
    }

    public getSchema(): ISchemaType {
        return this.schema;
    }
}