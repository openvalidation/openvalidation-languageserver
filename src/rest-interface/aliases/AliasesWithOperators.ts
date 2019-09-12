import { Type } from "class-transformer";

export class AliasesWithOperators {
    @Type(() => Map)
    private aliases: Map<string, string>;

    @Type(() => Map)
    private operators: Map<string, string>;

    constructor(aliases: Map<string, string>, operators: Map<string, string>) {
        this.aliases = aliases;
        this.operators = operators;
    }

    public getAliases(): Map<string, string> {
        return this.aliases;
    }

    public getOperators(): Map<string, string> {
        return this.operators;
    }
}