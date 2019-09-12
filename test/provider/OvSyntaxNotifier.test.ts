import "jest";
import { OvSyntaxNotifier } from "../../src/provider/OvSyntaxNotifier";
import { TestInitializer } from "../TestInitializer";

describe("OvSyntax notifier test", () => {
    var provider: OvSyntaxNotifier;
    var testInitializer: TestInitializer;

    beforeEach(() => {
        testInitializer = new TestInitializer(true);
        provider = testInitializer.ovSyntaxNotifier;
    });

    test("Verify provider exists", () => {
        expect(provider).not.toBeNull();
    });

    test("sendNotificationsIfNecessary with apiResponseSuccess, expect no error", () => {
        provider.sendNotificationsIfNecessary(testInitializer.mockNotEmptyApiResponseSuccess());
    });

    test("sendNotificationsIfNecessary with empty apiResponse, expect no error", () => {
        provider.sendNotificationsIfNecessary(testInitializer.mockEmptyApiResponse());
    });

    test("sendNotificationsIfNecessary with not empty apiResponse, expect no error", () => {
        provider.sendNotificationsIfNecessary(testInitializer.mockNotEmptyApiResponse());
    });

    test("sendNotificationsIfNecessary two times with apiResponseSuccess, expect no error", () => {
        provider.sendNotificationsIfNecessary(testInitializer.mockNotEmptyApiResponseSuccess());
        provider.sendNotificationsIfNecessary(testInitializer.mockNotEmptyApiResponseSuccess());
    });
});