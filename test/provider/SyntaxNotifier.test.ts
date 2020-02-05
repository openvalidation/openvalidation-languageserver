import "jest";
import { SyntaxNotifier } from "../../src/provider/SyntaxNotifier";
import { TestInitializer } from "../TestInitializer";
import { IConnection } from "vscode-languageserver";

describe("OvSyntax notifier test", () => {
  let provider: SyntaxNotifier;
  let testInitializer: TestInitializer;
  let connection: IConnection;

  beforeEach(() => {
    testInitializer = new TestInitializer(true);
    connection = testInitializer.$connection;
    provider = testInitializer.syntaxNotifier;

    jest.spyOn(connection, "sendNotification").mockImplementation = jest.fn();
  });

  test("Verify provider exists", () => {
    expect(provider).not.toBeNull();
  });

  test("sendNotificationsIfNecessary with not empty apiResponse, expect no error", () => {
    provider.sendTextMateGrammarIfNecessary(
      testInitializer.mockNotEmptyLintingResponse()
    );
    provider.sendGeneratedCodeIfNecessary(testInitializer.mockEmptyCode());

    expect(connection.sendNotification).toHaveBeenCalledTimes(1);
  });

  test("sendNotificationsIfNecessary with empty apiResponse, expect no error", () => {
    provider.sendTextMateGrammarIfNecessary(
      testInitializer.mockEmptyLintingResponse()
    );
    provider.sendGeneratedCodeIfNecessary(testInitializer.mockEmptyCode());

    expect(connection.sendNotification).not.toHaveBeenCalled();
  });

  test("sendNotificationsIfNecessary two times with not empty apiResponse, expect no error", () => {
    provider.sendTextMateGrammarIfNecessary(
      testInitializer.mockNotEmptyLintingResponse()
    );
    provider.sendGeneratedCodeIfNecessary(testInitializer.mockEmptyCode());
    provider.sendTextMateGrammarIfNecessary(
      testInitializer.mockNotEmptyLintingResponse()
    );

    const changedCode = testInitializer.mockEmptyCode();
    changedCode.frameworkResult = "Blabla";
    changedCode.implementationResult = "Blablabla";
    provider.sendGeneratedCodeIfNecessary(changedCode);

    expect(connection.sendNotification).toHaveBeenCalledTimes(3);
  });

  test("sendNotificationsIfNecessary two times with empty and not empty apiResponse, expect no error", () => {
    provider.sendTextMateGrammarIfNecessary(
      testInitializer.mockEmptyLintingResponse()
    );
    provider.sendGeneratedCodeIfNecessary(testInitializer.mockEmptyCode());
    provider.sendTextMateGrammarIfNecessary(
      testInitializer.mockNotEmptyLintingResponse()
    );

    const changedCode = testInitializer.mockEmptyCode();
    changedCode.frameworkResult = "Blabla";
    changedCode.implementationResult = "Blablabla";
    provider.sendGeneratedCodeIfNecessary(changedCode);

    expect(connection.sendNotification).toHaveBeenCalledTimes(2);
  });

  test("sendTextMateGrammarIfNecessary two times with empty and not empty apiResponse, expect no error", () => {
    provider.sendTextMateGrammarIfNecessary(
      testInitializer.mockEmptyLintingResponse()
    );
    provider.sendGeneratedCodeIfNecessary(testInitializer.mockEmptyCode());
    provider.sendTextMateGrammarIfNecessary(
      testInitializer.mockNotEmptyLintingResponse()
    );

    const changedCode = testInitializer.mockEmptyCode();
    changedCode.frameworkResult = "Blabla";
    changedCode.implementationResult = "Blablabla";
    provider.sendGeneratedCodeIfNecessary(changedCode);

    expect(connection.sendNotification).toHaveBeenCalledTimes(2);
  });

  test("sendTextMateGrammarIfNecessary with lintingResponse with empty ", () => {
    provider.sendTextMateGrammarIfNecessary(
      testInitializer.mockLintingResponseWithEmptyMainAst()
    );

    expect(connection.sendNotification).not.toHaveBeenCalled();
  });
});
