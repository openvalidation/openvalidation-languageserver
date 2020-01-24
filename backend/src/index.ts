import { ChildProcess } from "child_process";
import { executeJar } from "node-java-connector";

const path = require("path");

export async function startBackend(): Promise<ChildProcess> {
  var relativePath = path.join(
    path.join(path.dirname(__dirname)),
    "../java/ov-rest.jar"
  );

  var output = await executeJar(relativePath);
  if (!!output.stderr) {
    output.stderr.on("data", (stderr: any) => {
      console.error(`${stderr}`);
    });
  }
  return output;
}
