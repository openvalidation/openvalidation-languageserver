import { Type } from "class-transformer";


/**
 * Data-class that is used for the transfer of aliases.
 * Especially it is used for operators, which receive the valid-datatype whith them
 *
 * @export
 * @class AliasesWithOperators
 */
export class AliasesWithOperators {
    @Type(() => Map)
    private aliases: Map<string, string>;

    @Type(() => Map)
    private operators: Map<string, string>;

    constructor(aliases: Map<string, string>, operators: Map<string, string>) {
        this.aliases = aliases;
        this.operators = operators;
    }

    public get $aliases(): Map<string, string> {
        return this.aliases;
    }

    public get $operators(): Map<string, string> {
        return this.operators;
    }
}