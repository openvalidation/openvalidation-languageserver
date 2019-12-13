import { Diagnostic } from "vscode-languageserver";

export class UseSchemaDataclass {
  constructor(
    public schemaLineIndex: number,
    public schemaText: JSON | null,
    public ovText: string,
    public diagnostics: Diagnostic[],
    public useSchemaLine: string
  ) {}
}
