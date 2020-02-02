import * as fs from "fs";
import { getPathFromUriAndString } from "./PathHelper";
import {
  Diagnostic,
  DiagnosticSeverity,
  Range
} from "vscode-languageserver-types";
import { URI } from "vscode-uri";
import { OvServer } from "../OvServer";
import { UseSchemaDataclass } from "./UseSchemaDataclass";

export class SchemaProvider {
  public static parseSpecificSchema(
    text: string,
    server: OvServer,
    documentUri: URI
  ): UseSchemaDataclass | undefined {
    let splittedText = text.split("\n");
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
        useSchemaLine = line.replace("\r", "");
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

    let schemaText: JSON | null = null;
    if (schemaPath.trim() !== "") {
      try {
        // the path of the file is required, because it otherwise wouldn't be relative
        let absolutePath = getPathFromUriAndString(documentUri, schemaPath);
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
