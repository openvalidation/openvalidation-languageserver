import "jest";
import { OvServer } from "../../../src/OvServer";
import { TextMateGrammarFactory } from "../../../src/provider/syntax-highlighting/TextMateGrammarFactory";
import { TestInitializer } from "../../TestInitializer";

describe("TextMateGrammarFactory Tests", () => {
    var textMateGrammarFactory: TextMateGrammarFactory;
    var testInitializer: TestInitializer;
    var server: OvServer;

    beforeEach(() => {
        testInitializer = new TestInitializer(true);
        server = testInitializer.server;
        textMateGrammarFactory = new TextMateGrammarFactory();
    });

    test("generateTextMateGrammar with empty response and empty server, expect not null", () => {
        var actualGrammar = textMateGrammarFactory.generateTextMateGrammar(testInitializer.mockEmptyLintingResponse(), server);
        expect(actualGrammar).not.toBeNull();
    });

    test("generateTextMateGrammar with empty response and not empty schema, expect not null", () => {
        server.schema = JSON.parse(JSON.stringify({ Alter: 20 }));

        var actualGrammar = textMateGrammarFactory.generateTextMateGrammar(testInitializer.mockEmptyLintingResponse(), server);
        expect(actualGrammar).not.toBeNull();
    });

    test("generateTextMateGrammar with not empty response and empty schema, expect not null", () => {
        var actualGrammar = textMateGrammarFactory.generateTextMateGrammar(testInitializer.mockNotEmptyLintingResponse(), server);
        expect(actualGrammar).not.toBeNull();
    });
})