import { ChildProcess, exec } from "child_process";

const path = require("path");

export function startBackend(): ChildProcess {
  var relativePath = path.join(
    path.join(path.dirname(require!.main!.filename)),
    "/rest-interface/ov-rest.jar"
  );
  var jrePath = path.join(
    path.join(path.resolve(__dirname)),
    "../jre/jdk8u232-b09-jre/bin/java.exe"
  );
  var output = exec(`${jrePath} -jar ${relativePath}`);
  if (!!output.stderr) {
    output.stderr.on("data", (stderr: any) => {
      console.error(`${stderr}`);
    });
  }
  return output;
}
