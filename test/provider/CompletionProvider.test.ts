import "jest";
import {
  CompletionItem,
  CompletionParams,
  CompletionTriggerKind,
  Position,
  TextDocument
} from "vscode-languageserver";
import { CompletionKeyEnum } from "../../src/enums/CompletionKeyEnum";
import { CompletionProvider } from "../../src/provider/CompletionProvider";
import { TestInitializer } from "../TestInitializer";

describe("Completion provider test", () => {
  let provider: CompletionProvider;
  let testInitializer: TestInitializer;

  beforeEach(() => {
    testInitializer = new TestInitializer(true);
    provider = testInitializer.completionProvider;
  });

  test("Verify provider exists", () => {
    expect(provider).not.toBeNull();
  });

  test("completion with valid params, expect null because TextDocuments cant be mocked", async () => {
    const params: CompletionParams = {
      textDocument: {
        uri: "test.ov"
      },
      position: Position.create(0, 0),
      context: {
        triggerKind: CompletionTriggerKind.Invoked,
        triggerCharacter: ""
      }
    };

    const expected: CompletionItem[] | null = null;
    const actual: CompletionItem[] | null = await provider.completion(params);

    expect(actual).toEqual(expected);
  });

  test("completionForParsedElement with null, expected global items", () => {
    const expectedLength: number = 3;
    const actual: CompletionItem[] | null = provider[
      "completionForParsedElement"
    ](null, [], Position.create(0, 0), "");

    expect(actual!.length).toEqual(expectedLength);
  });

  test("completionForParsedElement with null, expected global items", () => {
    const expectedLength: number = 3;
    const actual: CompletionItem[] | null = provider[
      "completionForParsedElement"
    ](null, [], Position.create(0, 0), "");

    expect(actual!.length).toEqual(expectedLength);
  });

  test("completionForParsedElement with null, expected global items", () => {
    const expectedLength: number = 3;
    const actual: CompletionItem[] | null = provider[
      "completionForParsedElement"
    ](
      testInitializer.getInorrectCompletionResponse(),
      [],
      Position.create(3, 0),
      ""
    );

    expect(actual!.length).toEqual(expectedLength);
  });

  test("completionForParsedElement with null, expected global items", () => {
    const expectedLength: number = 0;
    const actual: CompletionItem[] | null = provider[
      "completionForParsedElement"
    ](
      testInitializer.getCorrectCompletionResponse(),
      [],
      Position.create(5, 0),
      ""
    );

    expect(actual!.length).toEqual(expectedLength);
  });

  test("completionByText with Alter, expected operators", async () => {
    const document: TextDocument = {
      uri: "test.ov",
      languageId: "ov",
      version: 0.1,
      getText: () => "Alter ",
      positionAt: () => Position.create(0, 0),
      offsetAt: () => 0,
      lineCount: 0
    };
    const params: CompletionParams = {
      textDocument: {
        uri: "test.ov"
      },
      position: Position.create(0, 0),
      context: {
        triggerKind: CompletionTriggerKind.Invoked,
        triggerCharacter: ""
      }
    };

    const actual: CompletionItem[] | null = await provider["completionByText"](
      document,
      params
    )!;
    const expectedLength: number = 0;

    expect(actual!.length).toEqual(expectedLength);
  });

  test("completionForSchema with Einkaufsliste, expected global items", async () => {
    const document: TextDocument = {
      uri: "test.ov",
      languageId: "ov",
      version: 0.1,
      getText: () => "Einkaufsliste.",
      positionAt: () => Position.create(0, 0),
      offsetAt: () => 0,
      lineCount: 0
    };
    const params: CompletionParams = {
      textDocument: {
        uri: "test.ov"
      },
      position: Position.create(0, "Einkaufsliste.".length),
      context: {
        triggerKind: CompletionTriggerKind.TriggerCharacter,
        triggerCharacter: CompletionKeyEnum.Array
      }
    };

    const actual: CompletionItem[] | null = await provider[
      "completionForSchema"
    ](document, params)!;
    const expectedLength: number = 1;

    expect(actual!.length).toEqual(expectedLength);
  });

  test("completionMethodSwitch with Array params, expected same result", async () => {
    const document: TextDocument = {
      uri: "test.ov",
      languageId: "ov",
      version: 0.1,
      getText: () => "Einkaufsliste.",
      positionAt: () => Position.create(0, 0),
      offsetAt: () => 0,
      lineCount: 0
    };
    const params: CompletionParams = {
      textDocument: {
        uri: "test.ov"
      },
      position: Position.create(0, "Einkaufsliste.".length),
      context: {
        triggerKind: CompletionTriggerKind.TriggerCharacter,
        triggerCharacter: CompletionKeyEnum.Array
      }
    };

    const expected: CompletionItem[] | null = await provider[
      "completionForArray"
    ](document, params)!;
    const actual: CompletionItem[] | null = await provider[
      "completionMethodSwitch"
    ](document, params)!;

    expect(actual).toEqual(expected);
  });

  test("completionMethodSwitch with Schema params, expected global items", async () => {
    const document: TextDocument = {
      uri: "test.ov",
      languageId: "ov",
      version: 0.1,
      getText: () => "Alter,",
      positionAt: () => Position.create(0, 0),
      offsetAt: () => 0,
      lineCount: 0
    };
    const params: CompletionParams = {
      textDocument: {
        uri: "test.ov"
      },
      position: Position.create(0, "Alter,".length),
      context: {
        triggerKind: CompletionTriggerKind.TriggerCharacter,
        triggerCharacter: CompletionKeyEnum.ComplexSchema
      }
    };

    const expected: CompletionItem[] | null = await provider[
      "completionForSchema"
    ](document, params)!;
    const actual: CompletionItem[] | null = await provider[
      "completionMethodSwitch"
    ](document, params)!;

    expect(actual).toEqual(expected);
  });

  test("completionMethodSwitch without special params, expected same result as completionByText", async () => {
    const document: TextDocument = {
      uri: "test.ov",
      languageId: "ov",
      version: 0.1,
      getText: () => "Alter ",
      positionAt: () => Position.create(0, 0),
      offsetAt: () => 0,
      lineCount: 0
    };
    const params: CompletionParams = {
      textDocument: {
        uri: "test.ov"
      },
      position: Position.create(0, 0),
      context: {
        triggerKind: CompletionTriggerKind.Invoked,
        triggerCharacter: ""
      }
    };

    const expected: CompletionItem[] | null = await provider[
      "completionByText"
    ](document, params)!;
    const actual: CompletionItem[] | null = await provider[
      "completionMethodSwitch"
    ](document, params)!;

    expect(actual).toEqual(expected);
  });

  test("completionMethodSwitch with falsy params, expected null", async () => {
    const document: TextDocument = {
      uri: "test.ov",
      languageId: "ov",
      version: 0.1,
      getText: () => "Alter ",
      positionAt: () => Position.create(0, 0),
      offsetAt: () => 0,
      lineCount: 0
    };
    const params: CompletionParams = {
      textDocument: {
        uri: "test.ov"
      },
      position: Position.create(0, 0),
      context: {
        triggerKind: CompletionTriggerKind.TriggerCharacter,
        triggerCharacter: "falsy"
      }
    };

    const expected: CompletionItem[] | null = null;
    const actual: CompletionItem[] | null = await provider[
      "completionMethodSwitch"
    ](document, params)!;

    expect(actual).toEqual(expected);
  });

  test("extractItem with multiple lines, fexpect correct text and start line", () => {
    const textInput: string[] = [
      "Wenn test",
      "Dann bla",
      "",
      "Stuff",
      "Als Test",
      "",
      "TextToFind",
      "find"
    ];
    const positionInput: Position = Position.create(7, 10);

    const expected: [string[], number] = [["TextToFind", "find"], 6];
    const actual = provider["extractItem"](textInput, positionInput);

    expect(actual).toEqual(expected);
  });

  test("extractItem empty line before variable-name, expect whole variable", () => {
    const textInput: string[] = [
      "Wenn test",
      "Dann bla",
      "",
      "    ",
      "Als Test",
      "",
      "TextToFind",
      "find"
    ];
    const positionInput: Position = Position.create(3, 4);

    const expected: [string[], number] = [["    ", "Als Test"], 3];
    const actual = provider["extractItem"](textInput, positionInput);

    expect(actual).toEqual(expected);
  });

  test("extractItem with multiple lines, expect correct text and start line", () => {
    const textInput: string[] = [
      "Kommentar Das ist ein Kommentar",
      "          ... über mehrere Zeiledddn",
      "    ",
      "ALS variable"
    ];
    const positionInput: Position = Position.create(1, 4);

    const expected: [string[], number] = [
      [
        "Kommentar Das ist ein Kommentar",
        "          ... über mehrere Zeiledddn"
      ],
      0
    ];
    const actual = provider["extractItem"](textInput, positionInput);

    expect(actual).toEqual(expected);
  });

  test("extractItem with position at paragraph, expect no lines", () => {
    const textInput: string[] = [
      "Kommentar Das ist ein Kommentar",
      "          ... über mehrere Zeiledddn",
      "    ",
      "ALS variable"
    ];
    const positionInput: Position = Position.create(2, 4);

    const expected: [string[], number] | null = null;
    const actual = provider["extractItem"](textInput, positionInput);

    expect(actual).toEqual(expected);
  });

  test("extractItem with position at variable after paragraph, expect variable", () => {
    const textInput: string[] = [
      "Kommentar Das ist ein Kommentar",
      "          ... über mehrere Zeiledddn",
      "    ",
      "ALS variable"
    ];
    const positionInput: Position = Position.create(3, 4);

    const expected: [string[], number] = [["ALS variable"], 3];
    const actual = provider["extractItem"](textInput, positionInput);

    expect(actual).toEqual(expected);
  });

  test("extractItem with multiple lines, expect correct text and start line", () => {
    const textInput: string[] = [
      "Kommentar Das ist ein Kommentar",
      "          ... über mehrere Zeiledddn",
      "    ",
      "    ",
      "ALS variable"
    ];
    const positionInput: Position = Position.create(3, 4);

    const expected: [string[], number] = [["    ", "ALS variable"], 3];
    const actual = provider["extractItem"](textInput, positionInput);

    expect(actual).toEqual(expected);
  });
});
