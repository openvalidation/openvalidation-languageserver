import { Type } from "class-transformer";
import { GenericNode } from "./GenericNode";
import { Variable } from "./Variable";
import { getGenericOptions } from "./TypeDecorator";

/**
 * MainNode for the syntax-tree
 *
 * @export
 * @class MainNode
 */
export class MainNode {
    @Type(() => Variable)
    private declarations: Variable[] = [];

    @Type(() => GenericNode, getGenericOptions())
    private scopes: GenericNode[];
    
    /**
     * Creates an instance of MainNode.
     * @memberof MainNode
     */
    constructor() {
        this.declarations = [];
        this.scopes = [];
    }

    public get $declarations(): Variable[] {
        return this.declarations;
    }
    public set $declarations(value: Variable[]) {
        this.declarations = value;
    }

    public get $scopes(): GenericNode[] {
        return this.scopes;
    }
    public set $scopes(value: GenericNode[]) {
        this.scopes = value;
    }
}