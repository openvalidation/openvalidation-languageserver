import "jest";
import { startBackend } from "../src/index";

describe("Test startBackend", () => {
  beforeEach(() => {});

  test("Verify backend were started", async done => {
    const output = await startBackend();
    if (!!output.stdout) {
      output.stdout.on("data", (stdout: any) => {
        if (stdout.trim() === "Started REST-API") {
          done();
          output.kill();
        }
      });
    }
  }, 80000);
});
