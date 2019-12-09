const path = require("path");
const spawn = require("child_process").exec;

export function startBackend() {
  var relativePath = path.join(
    path.join(path.dirname(require!.main!.filename)),
    "/rest-interface/ov-rest.jar"
  );
  var jrePath = path.join(
    path.join(path.resolve(__dirname)),
    "../jre/jdk8u232-b09-jre/bin/java.exe"
  );
  var output = spawn(`${jrePath} -jar ${relativePath}`);

  if (!!output.stderr) {
    output.stderr.on("data", (stderr: any) => {
      console.error(`${stderr}`);
    });
  }
  if (!!output.stdout) {
    output.stdout.on("data", (stderr: any) => {
      console.log(`${stderr}`);
    });
  }
}
