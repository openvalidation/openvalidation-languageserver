import * as fs from "fs";
import {
  Diagnostic,
  Range,
  DiagnosticSeverity
} from "vscode-languageserver-types";

export class SchemaProvider {
  public static parseSpecificSchema(
    text: string,
    defaultSchema: JSON
  ): UseSchemaDataclass | null {
    let splittedText = text.split("\n");

    var path = require("path");

    // TODO: ASK for Schema aliases and look for it

    let schemaPath: string = "";
    let useSchemaLineIndex: number = 0;
    let foundUseSchemaCommand: boolean = false;

    for (const line of splittedText) {
      if (line.toUpperCase().indexOf("USE SCHEMA") != -1) {
        schemaPath = line.replace(new RegExp("USE SCHEMA", "ig"), "").trim();
        foundUseSchemaCommand = true;
        break;
      }
      useSchemaLineIndex++;
    }

    if (!foundUseSchemaCommand) return null;

    let diagnostics: Diagnostic[] = [];
    if (schemaPath.trim() === "") {
      diagnostics.push(
        Diagnostic.create(
          Range.create(
            useSchemaLineIndex,
            0,
            useSchemaLineIndex,
            splittedText[useSchemaLineIndex].length
          ),
          "you have to provide a schema-path",
          DiagnosticSeverity.Error
        )
      );
    }

    let schemaText: JSON = defaultSchema;
    if (schemaPath.trim() !== "") {
      try {
        let absolutePath = path.resolve(schemaPath);
        schemaText = JSON.parse(fs.readFileSync(absolutePath, "utf8"));
      } catch (err) {
        diagnostics.push(
          Diagnostic.create(
            Range.create(
              useSchemaLineIndex,
              0,
              useSchemaLineIndex,
              splittedText[useSchemaLineIndex].length
            ),
            err.message,
            DiagnosticSeverity.Error
          )
        );
      }
    }

    var ovText: string = "";

    // Split first lines
    for (let i = useSchemaLineIndex + 1; i < splittedText.length; i++) {
      ovText += splittedText[i];

      if (i < splittedText.length) {
        ovText += "\n";
      }
    }

    return new UseSchemaDataclass(
      useSchemaLineIndex,
      schemaText,
      ovText,
      diagnostics
    );
  }
}

export class UseSchemaDataclass {
  constructor(
    public schemaLineIndex: number,
    public schemaText: JSON,
    public ovText: string,
    public diagnostics: Diagnostic[]
  ) {}
}
