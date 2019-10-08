import "jest"
import { IndexRange } from "../../../src/data-model/syntax-tree/IndexRange";
import { IndexPosition } from "../../../src/data-model/syntax-tree/IndexPosition";
import { Position } from "vscode-languageserver";

describe("IndexRange Tests", () => {
    test("IndexRange getter/setter test", () => {
        var position: IndexRange = IndexRange.create(0, 0, 0, 0);
        position.$start = new IndexPosition(0, 1);
        position.$end = new IndexPosition(0, 20);

        expect(position.$start).toEqual(new IndexPosition(0, 1));
        expect(position.$end).toEqual(new IndexPosition(0, 20));
    });

    test("equals with unequal positions, expect true", () => {
        var position: IndexRange = IndexRange.create(0, 0, 0, 0);
        var secPosition: IndexRange = IndexRange.create(0, 0, 0, 0);

        var actual = position.equals(secPosition);
        var expected = true;

        expect(actual).toEqual(expected);
    });

    test("equals with equal positions, expect false", () => {
        var position: IndexRange = IndexRange.create(0, 0, 0, 0);
        var secPosition: IndexRange = IndexRange.create(0, 10, 0, 15);

        var actual = position.equals(secPosition);
        var expected = false;

        expect(actual).toEqual(expected);
    });

    test("includesRange with not included Range, expect false", () => {
        var position: IndexRange = IndexRange.create(0, 0, 0, 0);
        var secPosition: IndexRange = IndexRange.create(0, 10, 0, 15);

        var actual = position.includesRange(secPosition);
        var expected = false;

        expect(actual).toEqual(expected);
    });
    
    test("includesRange with included Range, expect true", () => {
        var position: IndexRange = IndexRange.create(0, 0, 0, 12);
        var secPosition: IndexRange = IndexRange.create(0, 10, 0, 15);

        var actual = position.includesRange(secPosition);
        var expected = true;

        expect(actual).toEqual(expected);
    });

    test("includesRange with range without start, expect false", () => {
        var firstRange: IndexRange = IndexRange.create(0, 0, 0, 12);
        var secondRange: IndexRange = IndexRange.create(0, 10, 0, 15);
        secondRange.$start = null;

        var actual = firstRange.includesRange(secondRange);
        var expected = false;

        expect(actual).toEqual(expected);
    });

    test("includesRange with range without start, expect false", () => {
        var firstRange: IndexRange = IndexRange.create(0, 0, 0, 12);
        var secondRange: IndexRange = IndexRange.create(0, 10, 0, 15);
        secondRange.$end = null;

        var actual = firstRange.includesRange(secondRange);
        var expected = false;

        expect(actual).toEqual(expected);
    });

    test("startsAfter with no start and end, expect false", () => {
        var range: IndexRange = IndexRange.create(0, 0, 0, 12);
        range.$start = null;
        range.$end = null;

        var position: Position = Position.create(0, 10);
        var actual = range.startsAfter(position);
        var expected = false;

        expect(actual).toEqual(expected);
    });

    test("endsBefore with no start and end, expect false", () => {
        var range: IndexRange = IndexRange.create(0, 0, 0, 12);
        range.$start = null;
        range.$end = null;

        var position: Position = Position.create(0, 10);
        var actual = range.startsAfter(position);
        var expected = false;

        expect(actual).toEqual(expected);
    });
});