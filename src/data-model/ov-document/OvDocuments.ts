import { OvDocument } from "./OvDocument";

/**
 * Holds a definition of all currently known OvDocuments. This class
 * works as a cache for these documents
 *
 * @export
 * @class OvDocuments
 */
export class OvDocuments {
  private ovDocuments: Map<string, OvDocument>;

  /**
   * Creates an instance of OvDocuments.
   * @memberof OvDocuments
   */
  constructor() {
    this.ovDocuments = new Map<string, OvDocument>();
  }

  /**
   * Returns the file with the given identifier
   *
   * @param {string} uri identifier of the file
   * @returns
   * @memberof OvDocuments
   */
  public get(uri: string) {
    return this.ovDocuments.get(uri);
  }

  /**
   * Returns the file with the given identifier
   *
   * @param {string} uri identifier of the file
   * @returns
   * @memberof OvDocuments
   */
  public all(): OvDocument[] {
    return Array.from(this.ovDocuments.values());
  }

  /**
   * Saves the given file under the given identifier
   *
   * @param {string} uri identifier of the file
   * @param {OvDocument} document document which should be saved
   * @memberof OvDocuments
   */
  public addOrOverrideOvDocument(document: OvDocument) {
    this.ovDocuments.set(document.$documentUri, document);
  }
}
