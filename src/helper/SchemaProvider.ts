import * as fs from "fs";
import {
  Diagnostic,
  DiagnosticSeverity,
  Range
} from "vscode-languageserver-types";
import { OvServer } from "../OvServer";
import { UseSchemaDataclass } from "./UseSchemaDataclass";

export class SchemaProvider {
  public static parseSpecificSchema(
    text: string,
    server: OvServer
  ): UseSchemaDataclass | undefined {
    let splittedText = text.split("\n");
    let path = require("path");
    let schemaPath: string = "";
    let useSchemaLineIndex: number = 0;
    let foundUseSchemaCommand: boolean = false;
    let commentKeyword:
      | string
      | null = server.getAliasHelper().getCommentKeyword();
    let useSchemaLine: string = "";

    // Iterate threw lines
    for (const line of splittedText) {
      let useSchemaIndex = line.toUpperCase().indexOf("USE SCHEMA");
      let commentSchemaIndex = !commentKeyword
        ? -1
        : line.toUpperCase().indexOf(commentKeyword);
      if (
        useSchemaIndex != -1 &&
        (commentSchemaIndex == -1 || useSchemaIndex < commentSchemaIndex)
      ) {
        useSchemaLine = line;
        schemaPath = line.replace(new RegExp("USE SCHEMA", "ig"), "").trim();
        foundUseSchemaCommand = true;
        break;
      }
      useSchemaLineIndex++;
    }

    // Then we don't have a "USE SCHEMA" command
    if (!foundUseSchemaCommand) return undefined;

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

    let schemaText: JSON = server.jsonSchema;
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

    // Get lines after the command
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
      diagnostics,
      useSchemaLine
    );
  }
}
