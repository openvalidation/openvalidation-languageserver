import { Type } from "class-transformer";
import { GenericNode } from "./GenericNode";
import { Variable } from "./Variable";
import { getGenericOptions } from "./TypeDecorator";

export class MainNode {
    @Type(() => Variable)
    private declarations: Variable[] = [];

    @Type(() => GenericNode, getGenericOptions())
    private scopes: GenericNode[];
    constructor() {
        this.declarations = [];
        this.scopes = [];
    }

    public getDeclarations(): Variable[] {
        return this.declarations;
    }
    public setDeclarations(value: Variable[]) {
        this.declarations = value;
    }

    public getScopes(): GenericNode[] {
        return this.scopes;
    }
    public setScopes(value: GenericNode[]) {
        this.scopes = value;
    }
}