import { UseSchemaNode } from "../../../src/data-model/syntax-tree/UseSchemaNode";
import { IndexRange } from "../../../src/data-model/syntax-tree/IndexRange";
import { KeywordNode } from "../../../src/data-model/syntax-tree/KeywordNode";
// import { ScopeEnum } from "../../../src/enums/ScopeEnum";
import { TestInitializer } from "../../TestInitializer";
import { Position } from "vscode-languageserver";
import { CompletionContainer } from "../../../src/provider/code-completion/CompletionContainer";

describe("KeywordNode Tests", () => {
  let testInitializer: TestInitializer;

  beforeEach(() => {
    testInitializer = new TestInitializer(true);
  });

  test("KeywordNode getter/setter Tests", () => {
    const expectedLines = ["USE SCHEMA ./schema.json"];
    const expectedKeywords = [
      new KeywordNode(["USE SCHEMA"], IndexRange.create(0, 0, 0, 10))
    ];
    const expectedRange = IndexRange.create(0, 0, 0, 4);
    const useSchemaNode = new UseSchemaNode(
      0,
      "WENN",
      JSON.parse("{}"),
      "./schema.json"
    );
    useSchemaNode.$keywords = expectedKeywords;
    useSchemaNode.$lines = expectedLines;
    useSchemaNode.$range = expectedRange;

    expect(useSchemaNode.$keywords).toEqual(expectedKeywords);
    expect(useSchemaNode.$lines).toEqual(expectedLines);
    expect(useSchemaNode.$range).toEqual(expectedRange);
  });

  //   test("getSpecificTokens with keyword and string, expect two tokens", () => {
  //     const expectedLines = ["USE SCHEMA ./schema.json"];
  //     const expectedKeywords = [
  //       new KeywordNode(["USE SCHEMA"], IndexRange.create(0, 0, 0, 10))
  //     ];
  //     const expectedRange = IndexRange.create(0, 0, 0, 24);
  //     const useSchemaNode = new UseSchemaNode(
  //       0,
  //       "WENN",
  //       JSON.parse("{}"),
  //       "./schema.json"
  //     );
  //     useSchemaNode.$keywords = expectedKeywords;
  //     useSchemaNode.$lines = expectedLines;
  //     useSchemaNode.$range = expectedRange;

  //     const expectedTokens = [
  //       {
  //         pattern: ScopeEnum.Keyword,
  //         range: IndexRange.create(0, 0, 0, 10)
  //       },
  //       {
  //         pattern: ScopeEnum.StaticString,
  //         range: IndexRange.create(0, 11, 0, 24)
  //       }
  //     ];

  //     expect(useSchemaNode.getSpecificTokens()).toEqual(expectedTokens);
  //   });

  test("getBeautifiedContent with one line", () => {
    const expectedLines = ["USE SCHEMA ./schema.json"];
    const useSchemaNode = new UseSchemaNode(
      0,
      "WENN",
      JSON.parse("{}"),
      "./schema.json"
    );
    useSchemaNode.$lines = expectedLines;

    expect(
      useSchemaNode.getBeautifiedContent(
        testInitializer.$server.getAliasHelper()
      )
    ).toEqual("USE SCHEMA ./schema.json");
  });

  test("getCompletionContainer, expect empty container", () => {
    const useSchemaNode = new UseSchemaNode(
      0,
      "WENN",
      JSON.parse("{}"),
      "./schema.json"
    );

    expect(useSchemaNode.getCompletionContainer(Position.create(0, 0))).toEqual(
      CompletionContainer.init().emptyTransition()
    );
  });
});
