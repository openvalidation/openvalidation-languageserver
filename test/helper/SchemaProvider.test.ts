import { TestInitializer } from "../Testinitializer";
import { OvServer } from "../../src/OvServer";
import { SchemaProvider } from "../../src/helper/SchemaProvider";
import { UseSchemaDataclass } from "../../src/helper/UseSchemaDataclass";
import { Diagnostic, Range, DiagnosticSeverity } from "vscode-languageserver";
import { URI } from "vscode-uri";

describe("SchemaProvider Tests", () => {
  let initializer: TestInitializer;
  let server: OvServer;

  beforeEach(() => {
    initializer = new TestInitializer(true);
    server = initializer.$server;
  });

  test("parseSpecificSchema with empty string, expect empty result", () => {
    const textParameter = ``;

    const actualResult:
      | UseSchemaDataclass
      | undefined = SchemaProvider.parseSpecificSchema(
      textParameter,
      server,
      URI.parse("./test.ov")
    );
    const expectedResult: UseSchemaDataclass | undefined = undefined;

    expect(actualResult).toEqual(expectedResult);
  });

  test("parseSpecificSchema with use schema with empty string, expect diagnostic", () => {
    const textParameter = "USE SCHEMA\n ";

    const actualResult:
      | UseSchemaDataclass
      | undefined = SchemaProvider.parseSpecificSchema(
      textParameter,
      server,
      URI.parse("./test.ov")
    );
    const expectedResult: UseSchemaDataclass = new UseSchemaDataclass(
      0,
      null,
      " \n",
      [
        Diagnostic.create(
          Range.create(0, 0, 0, "USE SCHEMA".length),
          "you have to provide a schema-path",
          DiagnosticSeverity.Error
        )
      ],
      "USE SCHEMA",
      ""
    );

    expect(actualResult).toEqual(expectedResult);
  });

  test("parseSpecificSchema with use schema with empty string, expect diagnostic", () => {
    const textParameter = "USE SCHEMA blabla\n ";

    const actualResult:
      | UseSchemaDataclass
      | undefined = SchemaProvider.parseSpecificSchema(
      textParameter,
      server,
      URI.parse("./test.ov")
    );
    const expectedResult: UseSchemaDataclass = new UseSchemaDataclass(
      0,
      null,
      " \n",
      [
        Diagnostic.create(
          Range.create(0, 0, 0, "USE SCHEMA blabla".length),
          "ENOENT: no such file or directory, open 'C:\\Projects\\openVALIDATION\\ov-language-server\\blabla'",
          DiagnosticSeverity.Error
        )
      ],
      "USE SCHEMA blabla",
      "/test.ov/"
    );

    expect(actualResult!.diagnostics[0].range).toEqual(
      expectedResult.diagnostics[0].range
    );
  });

  test("parseSpecificSchema with commented use-schema, expect undefined", () => {
    const textParameter = "COMMENT USE SCHEMA blabla\n ";

    const actualResult:
      | UseSchemaDataclass
      | undefined = SchemaProvider.parseSpecificSchema(
      textParameter,
      server,
      URI.parse("./test.ov")
    );
    const expectedResult: UseSchemaDataclass | undefined = undefined;

    expect(actualResult).toEqual(expectedResult);
  });
});
