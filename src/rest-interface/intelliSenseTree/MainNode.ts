import { Type } from "class-transformer";
import { GenericNode } from "./GenericNode";
import { Variable } from "./Variable";
import { getGenericOptions } from "./TypeDecorator";
import { LintingError } from "../response/LintingError";

export class MainNode {
    @Type(() => Variable)
    private declarations: Variable[] = [];

    @Type(() => GenericNode, getGenericOptions())
    private scopes: GenericNode[];

    @Type(() => LintingError)
    private errors: LintingError[];

    constructor() {
        this.declarations = [];
        this.scopes = [];
        this.errors = [];
    }

    public getDeclarations(): Variable[] {
        return this.declarations;
    }
    public setDeclarations(value: Variable[]) {
        this.declarations = value;
    }

    public getErrors(): LintingError[] {
        return this.errors;
    }
    public setErrors(errors: LintingError[]) {
        this.errors = errors;
    }

    public getScopes(): GenericNode[] {
        return this.scopes;
    }
    public setScopes(value: GenericNode[]) {
        this.scopes = value;
    }
}