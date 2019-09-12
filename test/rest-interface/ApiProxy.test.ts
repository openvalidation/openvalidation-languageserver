import "jest";
import { ApiProxy } from "../../src/rest-interface/ApiProxy";
import { TestInitializer } from "../Testinitializer";

describe("ApiProxy Tests", () => {

    var initializer: TestInitializer;

    beforeEach(() => {
        initializer = new TestInitializer(true);
    });

    test("postData with whole document, expect a response", async () => {
        var response = await ApiProxy.postData(initializer.getDocumentText(), initializer.server.restParameter);
        expect(response).not.toBeNull();
    });

    test("getAliases get default aliases, expect a response", async () => {
        var response = await ApiProxy.getAliases(initializer.server.culture);
        expect(response).not.toBeNull();
    });

    test("getAliases get default aliases, expect a response", async () => {
        var response = await ApiProxy.postLintingData(initializer.getDocumentText(), initializer.server.restParameter, undefined);
        expect(response).not.toBeNull();
    });


})