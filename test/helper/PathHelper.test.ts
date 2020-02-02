import "jest";
import { URI } from "vscode-uri";
import { getPathFromUriAndString } from "../../src/helper/PathHelper";

describe("getRelativePath Test", () => {
  beforeEach(() => {});

  test("test uri empty and relative path", () => {
    const documentPath = "";
    const documentUri = URI.parse(documentPath);
    const schemaPath = "./schema.json";

    const expectedPath = "/schema.json";
    const actualPath = getPathFromUriAndString(documentUri, schemaPath);

    expect(actualPath).toEqual(expectedPath);
  });

  test("test uri empty and relative path", () => {
    const documentPath = "";
    const documentUri = URI.parse(documentPath);
    const schemaPath = "./schema.json";

    const expectedPath = "/schema.json";
    const actualPath = getPathFromUriAndString(documentUri, schemaPath);

    expect(actualPath).toEqual(expectedPath);
  });

  test("test uri empty and absolute path", () => {
    const documentPath = "";
    const documentUri = URI.parse(documentPath);
    const schemaPath = "C:/schema.json";

    const expectedPath = "/C:/schema.json";
    const actualPath = getPathFromUriAndString(documentUri, schemaPath);

    expect(actualPath).toEqual(expectedPath);
  });

  test("test not empty uri and absolute path", () => {
    const documentPath = "/C:/test/test.ov";
    const documentUri = URI.parse(documentPath);
    const schemaPath = "/C:/schema.json";

    const expectedPath = "/C:/schema.json";
    const actualPath = getPathFromUriAndString(documentUri, schemaPath);

    expect(actualPath).toEqual(expectedPath);
  });

  test("test not empty uri and relative path", () => {
    const documentPath = "/C:/test/test.ov";
    const documentUri = URI.parse(documentPath);
    const schemaPath = "./schema.json";

    const expectedPath = "/C:/test/schema.json";
    const actualPath = getPathFromUriAndString(documentUri, schemaPath);

    expect(actualPath).toEqual(expectedPath);
  });
});
