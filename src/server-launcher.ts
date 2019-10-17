import { ChildProcess, exec } from "child_process";

export function startWebSocket() {
  require("./start-server");
}

export function startServerAsExternalProcess() {
  const path = require("path");

  // Starts the spring-boot-backend
  const exePath = path.join(
    "node node_modules/ov-language-server/lib/start-server.js"
  );
  const child: ChildProcess = exec(exePath);

  if (!!child.stdout) {
    child.stdout.on("data", data => {
      console.log("Server-Log: " + data);
    });
  }

  if (!!child.stderr) {
    child.stderr.on("data", stderr => {
      console.log("Server-Error: " + stderr);
    });
  }

  child.on("close", code => {
    console.log(`child process exited with code ${code}`);
  });
}
