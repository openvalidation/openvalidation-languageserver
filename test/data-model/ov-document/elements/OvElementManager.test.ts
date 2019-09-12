import "jest";
import { OvElementManager } from "../../../../src/data-model/ov-document/OvElementManager";
import { TestInitializer } from "../../../TestInitializer";

describe("Dummy Tests", () => {
    var elementManager: OvElementManager;

    beforeEach(() => {
        var testInitializer = new TestInitializer(true);
        elementManager = testInitializer.server.ovDocuments.get("test.ov")!.elementManager;
    });

    test("Verify elementManager exists", () => {
        expect(elementManager).not.toBeNull();
    });

    test("getRules with 2 existing rules, expect 2 rules", () => {
        var expectedLength: number = 2;
        var actualLength = elementManager.getRules().length;
        expect(actualLength).toEqual(expectedLength);
    });

    test("getComments with no existing comments, expect no comments", () => {
        var expectedLength: number = 1;
        var actualLength = elementManager.getComments().length;
        expect(actualLength).toEqual(expectedLength);
    });
});