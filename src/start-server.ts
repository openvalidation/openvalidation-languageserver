/* --------------------------------------------------------------------------------------------
 * Starts the server as an express-application and enables connecting with an websocket.
 * ------------------------------------------------------------------------------------------ */

import * as express from "express";
import * as http from "http";
import * as net from "net";
import "reflect-metadata";
import * as url from "url";
import * as rpc from "vscode-ws-jsonrpc";
import * as ws from "ws";
import { startServer, OvServer } from "./OvServer";
import { startBackend } from "./start-backend";
import { ChildProcess } from "child_process";
import { validateDocuments } from "./server-launcher";

// Starts the Java-Backend in a separate file
const output: ChildProcess = startBackend();
if (!!output.stdout) {
  output.stdout.on("data", (stdout: any) => validateDocuments(stdout, server));
}

var server: OvServer;

process.on("uncaughtException", (err: any) => {
  console.error("Uncaught Exception: ", err.toString());
  if (err.stack) {
    console.error(err.stack);
  }
});

// create the express application
const app = express();
const PORT = process.env.PORT || 3010;

// serve the static content, i.e. index.html
app.use(express.static(__dirname));

// start the server
const expressServer = app.listen(PORT, () =>
  console.log(`Language-Server running on ${PORT}!`)
);

// create the web socket
const wss = new ws.Server({
  noServer: true,
  perMessageDeflate: false
});

expressServer.on(
  "upgrade",
  (request: http.IncomingMessage, socket: net.Socket, head: Buffer) => {
    const pathname = request.url ? url.parse(request.url).pathname : undefined;

    // Binding of the lsp-socket to the given socket
    if (pathname === "/ovLanguage") {
      wss.handleUpgrade(request, socket, head, webSocket => {
        bindWebSocket(webSocket);
      });
    }
  }
);

/**
 * Binds the WebSocket to our server and starts the server
 *
 * @param {ws} webSocket websocket we want to connect to
 */
function bindWebSocket(webSocket: ws): void {
  const socket: rpc.IWebSocket = {
    send: content =>
      webSocket.send(content, error => {
        if (error) {
          throw error;
        }
      }),
    onMessage: cb => webSocket.on("message", cb),
    onError: cb => webSocket.on("error", cb),
    onClose: cb => webSocket.on("close", cb),
    dispose: () => webSocket.close()
  };

  // launch the server when the web socket is opened
  if (webSocket.readyState === webSocket.OPEN) {
    launch(socket);
  } else {
    webSocket.on("open", () => launch(socket));
  }
}

/**
 * Creates the language-server and the connection to the given socket
 *
 * @param {rpc.IWebSocket} socket socket we want to connect to
 */
function launch(socket: rpc.IWebSocket) {
  const reader = new rpc.WebSocketMessageReader(socket);
  const writer = new rpc.WebSocketMessageWriter(socket);

  server = startServer(reader, writer);
}
