import "jest";
import { CultureEnum } from "../src/enums/CultureEnum";
import { LanguageEnum } from "../src/enums/LanguageEnum";
import { NotificationEnum } from "../src/enums/NotificationEnum";
import { TestInitializer } from "./Testinitializer";

describe("Dummy Tests", () => {
  let initializer: TestInitializer;

  beforeEach(() => {
    initializer = new TestInitializer(true);
  });

  test("initialize with rootPath in params, expect no error", async () => {
    expect(
      async () =>
        await initializer.$server["initialize"]({
          rootPath: "test",
          rootUri: "test",
          processId: 20,
          capabilities: {},
          workspaceFolders: null
        })
    ).not.toThrow(Error);
  });

  test("initialize without rootPath but with rootUri in params, expect no error", async () => {
    expect(
      async () =>
        await initializer.$server["initialize"]({
          rootUri: "test",
          processId: 20,
          capabilities: {},
          workspaceFolders: null
        })
    ).not.toThrow(Error);
  });

  test("initialize without paths in params, expect no error", async () => {
    expect(
      async () =>
        await initializer.$server["initialize"]({
          rootUri: null,
          processId: 20,
          capabilities: {},
          workspaceFolders: null
        })
    ).not.toThrow(Error);
  });

  test("validateAndSetSchemaDefinition with default params, expect no error", () => {
    expect(() =>
      initializer.$server["validateAndSetSchemaDefinition"]({
        schema: "Alter: 20",
        uri: "test.ov"
      })
    ).not.toThrow(Error);
  });

  test("setLanguage with default params, expect no error", () => {
    expect(
      async () =>
        await initializer.$server.setLanguage({
          language: "Java",
          uri: "test.ov"
        })
    ).not.toThrow(Error);
  });

  test("setCulture with default params, expect no error", () => {
    expect(
      async () =>
        await initializer.$server.setCulture({ culture: "de", uri: "test.ov" })
    ).not.toThrow(Error);
  });

  test("setAliases, expect no error", () => {
    expect(async () => await initializer.$server.setAliases()).not.toThrow(
      Error
    );
  });

  test("setGeneratedSchema, expect no error", () => {
    expect(() =>
      initializer.$server.setGeneratedSchema(
        initializer.mockNotEmptyLintingResponse()
      )
    ).not.toThrow(Error);
  });

  test("start, expect no error", () => {
    expect(() => initializer.$server.start()).not.toThrow(Error);
  });

  test("sendNotification CultureChanged, expect no error", () => {
    expect(() =>
      initializer.$server.connection.sendNotification(
        NotificationEnum.CultureChanged,
        { culture: CultureEnum.Russian, uri: "test.ov" }
      )
    ).not.toThrow(Error);
  });

  test("sendNotification CultureChanged, expect no error", () => {
    expect(() =>
      initializer.$server.connection.sendNotification(
        NotificationEnum.LanguageChanged,
        { language: LanguageEnum.Node, uri: "test.ov" }
      )
    ).not.toThrow(Error);
  });
});
