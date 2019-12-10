/* --------------------------------------------------------------------------------------------
 * Enables the starting for an extension e.g. for Vistual Studio Code
 * ------------------------------------------------------------------------------------------ */

import "reflect-metadata";
import { createConnection, ProposedFeatures } from "vscode-languageserver";
import { OvServer } from "./OvServer";
import { startBackend } from "./start-backend";
import { ChildProcess } from "child_process";
import { validateDocuments } from "./server-launcher";

// Starts the Java-Backend in a separate file
const output: ChildProcess = startBackend();
if (!!output.stdout) {
  output.stdout.on("data", (stdout: any) => validateDocuments(stdout, server));
}

// Create a connection for the server. The connection uses Node's IPC as a transport.
// Also include all preview / proposed LSP features.
const connection = createConnection(ProposedFeatures.all);
const server: OvServer = new OvServer(connection);
server.start();
