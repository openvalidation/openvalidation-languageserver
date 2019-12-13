import { ChildProcess, exec } from "child_process";
import * as findJavaHome from "find-java-home";

const path = require("path");

// TODO: Move this whole thing to an own package
export async function startBackend(): Promise<ChildProcess> {
  var relativePath = path.join(
    path.join(path.dirname(require!.main!.filename)),
    "/rest-interface/ov-rest.jar"
  );

  let javaCall = path.join(
    path.join(path.resolve(__dirname)),
    "../jre/jdk8u232-b09-jre/bin/java.exe"
  );

  let javaHomeExists: boolean = false;
  await findJavaHome({ allowJre: true }, async (err, home) => {
    if (err) return console.log(err);

    // Then we can just call "java" in the console
    if (!!home && home !== "") {
      javaHomeExists = true;
      javaCall = "java";
    }
  });

  if (!javaHomeExists && process.platform != "win32") {
    throw Error("You have to install Java to run this Extension");
  }

  var output = exec(`${javaCall} -jar ${relativePath}`);
  if (!!output.stderr) {
    output.stderr.on("data", (stderr: any) => {
      console.error(`${stderr}`);
    });
  }
  return output;
}
