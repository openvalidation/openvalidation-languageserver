import { URI } from "vscode-uri";
import * as path from "path";

/**
 * Generates a file path from an document with the given uri and
 *  the required document with the given path
 *
 * @export
 * @param {URI} uri path uri of the given document
 * @param {string} documentPath relative or absolute path of the file
 * @returns
 */
export function getPathFromUriAndString(uri: URI, documentPath: string) {
  if (path.isAbsolute(documentPath)) return documentPath;

  return path.resolve(path.dirname(uri.path), documentPath);
}
