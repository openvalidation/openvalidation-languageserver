import { ChildProcess, exec } from "child_process";

const path = require("path");

// Starts the spring-boot-backend
const exePath = path.join(__dirname, "/rest-interface/ov-rest.exe");
const child: ChildProcess = exec(exePath);

if (!!child.stdout) {
  child.stdout.on("data", data => {
    console.log("stdout: " + data);
  });
}

if (!!child.stderr) {
  child.stderr.on("data", stderr => {
    console.log("stderr: " + stderr);
  });
}

child.on("close", code => {
  console.log(`child process exited with code ${code}`);
});
