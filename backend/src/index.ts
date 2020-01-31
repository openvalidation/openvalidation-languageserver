import { ChildProcess } from "child_process";
import { executeJar } from "node-java-connector";
import * as path from "path";

const port = 31057;

export async function startBackend(): Promise<ChildProcess> {
  var relativePath = path.join(path.dirname(__filename), "../java/ov-rest.jar");

  var output = await executeJar(relativePath, [`--server.port=${port}`]);
  if (!!output.stderr) {
    output.stderr.on("data", (stderr: any) => {
      console.error(`${stderr}`);
    });
  }
  return output;
}
