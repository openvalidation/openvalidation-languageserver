const jre = require("node-jre");
const path = require("path");

export function startBackend() {
  var relativePath = path.join(
    path.join(path.dirname(require!.main!.filename)),
    "/rest-interface/ov-rest.jar"
  );
  console.log(relativePath);

  var output = jre.spawn(
    [relativePath],
    "org.springframework.boot.loader.JarLauncher",
    [],
    { encoding: "utf8" } // encode output as string
  );

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
