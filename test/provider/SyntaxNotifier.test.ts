import "jest";
import { SyntaxNotifier } from "../../src/provider/SyntaxNotifier";
import { TestInitializer } from "../TestInitializer";

describe("OvSyntax notifier test", () => {
    var provider: SyntaxNotifier;
    var testInitializer: TestInitializer;

    beforeEach(() => {
        testInitializer = new TestInitializer(true);
        provider = testInitializer.syntaxNotifier;
    });

    test("Verify provider exists", () => {
        expect(provider).not.toBeNull();
    });

    test("sendNotificationsIfNecessary with empty apiResponse, expect no error", () => {
        provider.sendTextMateGrammarIfNecessary(testInitializer.mockNotEmptyLintingResponse());
        provider.sendGeneratedCodeIfNecessary(testInitializer.mockEmptyCode());
    });

    test("sendNotificationsIfNecessary with not empty apiResponse, expect no error", () => {
        provider.sendTextMateGrammarIfNecessary(testInitializer.mockEmptyLintingResponse());
        provider.sendGeneratedCodeIfNecessary(testInitializer.mockEmptyCode());
    });

    test("sendNotificationsIfNecessary two times with not empty apiResponse, expect no error", () => {
        provider.sendTextMateGrammarIfNecessary(testInitializer.mockEmptyLintingResponse());
        provider.sendGeneratedCodeIfNecessary(testInitializer.mockEmptyCode());
        provider.sendTextMateGrammarIfNecessary(testInitializer.mockEmptyLintingResponse());
        provider.sendGeneratedCodeIfNecessary(testInitializer.mockEmptyCode());
    });
});