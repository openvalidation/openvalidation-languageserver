import { ChildProcess, exec } from "child_process";
import { OvServer } from "./OvServer";

export function startWebSocket() {
  require("./start-server");
}

export function startServerAsExternalProcess() {
  const path = require("path");

  // Starts the spring-boot-backend
  const exePath = path.join(
    "node node_modules/ov-language-server/dist/start-server.js"
  );
  const child: ChildProcess = exec(exePath);

  if (!!child.stderr) {
    child.stderr.on("data", stderr => {
      console.log(`Error: ${stderr}`);
    });
  }

  child.on("close", code => {
    console.log(`Language-Server exited with ${code}`);
  });
}

export function validateDocuments(stdout: string, server: OvServer) {
  if (stdout.trim() !== "Started REST-API") return;
  console.log("Started REST-API");

  if (!server || !server.documentActionProvider) return;
  for (const textDocument of server.documents.all()) {
    server.documentActionProvider.validate(textDocument.uri);
  }
  console.log("Validated Documents");
}
