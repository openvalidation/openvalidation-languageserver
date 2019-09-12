import "jest";
import { FoldingRange, FoldingRangeRequestParam } from "vscode-languageserver";
import { FoldingRangesProvider } from "../../src/provider/FoldingRangesProvider";
import { TestInitializer } from "../TestInitializer";

describe("FoldingRanges provider test", () => {
    var provider: FoldingRangesProvider;
    var testInitializer: TestInitializer;

    beforeEach(() => {
        testInitializer = new TestInitializer(true);
        provider = testInitializer.foldingRangesProvider;
    });


    function getEmptyParams(): FoldingRangeRequestParam {
        return {
            textDocument: {
                uri: "test.ov"
            }
        }
    }

    test("Verify provider exists", () => {
        expect(provider).not.toBeNull();
    });

    test("getFoldingRanges with empty document, expect empty array", () => {
        var tmpTestInitializer = new TestInitializer(false);
        var tmpProvider = tmpTestInitializer.foldingRangesProvider;

        var expected: FoldingRange[] = [];
        var actual = tmpProvider.getFoldingRanges(getEmptyParams());

        expect(actual).toEqual(expected);
    });

    test("getFoldingRanges with wrong uri, expected empty list", () => {
        var expected: FoldingRange[] = [];

        var input = {
            textDocument: {
                uri: "wrongUri"
            }
        };
        var actual = provider.getFoldingRanges(input);

        expect(actual).toEqual(expected);
    });
});