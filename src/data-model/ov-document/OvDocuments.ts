import { OvDocument } from "./OvDocument";

/**
 * Holds a definition of all currently known OvDocuments. This class
 * works as a cache for these documents
 *
 * @export
 * @class OvDocuments
 */
export class OvDocuments {
    private _ovDocuments: Map<string, OvDocument>;

    constructor() {
        this._ovDocuments = new Map<string, OvDocument>();
    }

    /**
     * Returns the file with the given identifier
     *
     * @param {string} uri identifier of the file
     * @returns
     * @memberof OvDocuments
     */
    public get(uri: string) {
        return this._ovDocuments.get(uri);
    }


    /**
     * Saves the given file under the given identifier
     *
     * @param {string} uri identifier of the file
     * @param {OvDocument} document document which should be saved
     * @memberof OvDocuments
     */
    public addOrOverrideOvDocument(uri: string, document: OvDocument) {
        this._ovDocuments.set(uri, document);
    }
}