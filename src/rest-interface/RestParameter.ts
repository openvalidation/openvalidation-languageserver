import { CultureEnum } from "../enums/CultureEnum";
import { LanguageEnum } from "../enums/LanguageEnum";
import { AliasHelper } from "src/aliases/AliasHelper";

/**
 * Class that is used inside the REST-API which contains all the necessary parameters for parsing.
 *
 * @export
 * @class RestParameter
 */
export class RestParameter {
    constructor(private _schema: JSON, private _culture: CultureEnum, private _language: LanguageEnum, private _aliasHelper: AliasHelper) {
    }

    public get language(): LanguageEnum {
        return this._language;
    }
    public get culture(): CultureEnum {
        return this._culture;
    }
    public get schema(): JSON {
        return this._schema;
    }

    public get aliasHelper(): AliasHelper {
        return this._aliasHelper;
    }
}