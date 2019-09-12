import { Culture, Language } from "./ParsingEnums";

export class RestParameter {
    constructor(private _schema: JSON, private _culture: Culture, private _language: Language) {
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
}