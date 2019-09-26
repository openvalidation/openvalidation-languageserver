import { Culture, Language } from "./ParsingEnums";
import { AliasHelper } from "src/aliases/AliasHelper";

export class RestParameter {
    constructor(private _schema: JSON, private _culture: Culture, private _language: Language, private _aliasHelper: AliasHelper) {
    }

    public get language(): Language {
        return this._language;
    }
    public get culture(): Culture {
        return this._culture;
    }
    public get schema(): JSON {
        return this._schema;
    }

    public get aliasHelper(): AliasHelper {
        return this._aliasHelper;
    }
}