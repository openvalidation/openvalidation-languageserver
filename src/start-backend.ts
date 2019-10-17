import { ChildProcess, exec } from "child_process";

export function startBackend() {
  const path = require("path");

  // Starts the spring-boot-backend
  const exePath = path.join(__dirname, "/rest-interface/ov-rest.exe");
  const child: ChildProcess = exec(exePath);

  if (!!child.stdout) {
    child.stdout.on("data", data => {
      console.log(`REST-Log: ${data}`);
    });
  }

  if (!!child.stderr) {
    child.stderr.on("data", stderr => {
      console.error(`REST-Error: ${stderr}`);
    });
  }

  child.on("close", code => {
    console.log(`REST-Interface ${code}`);
  });
}
