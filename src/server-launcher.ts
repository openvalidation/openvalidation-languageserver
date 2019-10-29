import { ChildProcess, exec } from "child_process";

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
