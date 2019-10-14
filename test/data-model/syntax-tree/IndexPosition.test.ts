import "jest";
import { IndexPosition } from "../../../src/data-model/syntax-tree/IndexPosition";

describe("IndexPosition Tests", () => {
  test("IndexPosition getter/setter test", () => {
    const position: IndexPosition = new IndexPosition(0, 0);
    position.$line = 10;
    position.$column = 10;

    expect(position.$line).toEqual(10);
    expect(position.$column).toEqual(10);
  });

  test("equals with unequal positions, expect true", () => {
    const position: IndexPosition = new IndexPosition(0, 0);
    const secPosition: IndexPosition = new IndexPosition(0, 0);

    const actual = position.equals(secPosition);
    const expected = true;

    expect(actual).toEqual(expected);
  });

  test("equals with equal positions, expect false", () => {
    const position: IndexPosition = new IndexPosition(0, 0);
    const secPosition: IndexPosition = new IndexPosition(0, 10);

    const actual = position.equals(secPosition);
    const expected = false;

    expect(actual).toEqual(expected);
  });
});
