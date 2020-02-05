import "jest";
import { ApiProxy } from "../../src/rest-interface/ApiProxy";
import { TestInitializer } from "../Testinitializer";

describe("ApiProxy Tests with moked axios", () => {
  let initializer: TestInitializer;

  beforeEach(() => {
    initializer = new TestInitializer(true);
  });

  test("postData with whole document, expect a response", async () => {
    const response = await ApiProxy.postData(
      initializer.getDocumentText(),
      initializer.$server.restParameter,
      initializer.$server.jsonSchema
    );
    expect(response).not.toBeNull();
  });

  test("postData with whole document without axios-mock, expect null", async () => {
    initializer.resetAxios();

    const response = await ApiProxy.postData(
      initializer.getDocumentText(),
      initializer.$server.restParameter,
      initializer.$server.jsonSchema
    );
    expect(response).toBeNull();
  });

  test("getAliases get default aliases, expect a response", async () => {
    const response = await ApiProxy.getAliases(initializer.$server.culture);
    expect(response).not.toBeNull();
  });

  test("getAliases get default aliases without axios-mock, expect null", async () => {
    initializer.resetAxios();

    const response = await ApiProxy.getAliases(initializer.$server.culture);
    expect(response).toBeNull();
  });

  test("postLintingData, expect a response", async () => {
    const response = await ApiProxy.postLintingData(
      initializer.getDocumentText(),
      initializer.$server.restParameter,
      initializer.$server.jsonSchema
    );
    expect(response).not.toBeNull();
  });

  test("postLintingData without axios-mock, expect null", async () => {
    initializer.resetAxios();

    const response = await ApiProxy.postLintingData(
      initializer.getDocumentText(),
      initializer.$server.restParameter,
      initializer.$server.jsonSchema
    );
    expect(response).toBeNull();
  });

  test("postCompletionData without ovDocument, expect a response", async () => {
    const response = await ApiProxy.postCompletionData(
      initializer.getDocumentText(),
      initializer.$server.restParameter,
      initializer.$server.jsonSchema,
      undefined
    );
    expect(response).not.toBeNull();
  });

  test("postCompletionData with ovDocument, expect a response", async () => {
    const response = await ApiProxy.postCompletionData(
      initializer.getDocumentText(),
      initializer.$server.restParameter,
      initializer.$server.jsonSchema,
      initializer.$server.ovDocuments.get("test.ov")
    );
    expect(response).not.toBeNull();
  });

  test("postCompletionData with ovDocument but without axios-mock, expect null", async () => {
    initializer.resetAxios();

    const response = await ApiProxy.postCompletionData(
      initializer.getDocumentText(),
      initializer.$server.restParameter,
      initializer.$server.jsonSchema,
      initializer.$server.ovDocuments.get("test.ov")
    );
    expect(response).toBeNull();
  });
});
