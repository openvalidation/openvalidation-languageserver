import 'jest';
import { Position, Range } from 'vscode-languageserver';
import { IndexPosition } from '../../../src/data-model/syntax-tree/IndexPosition';
import { IndexRange } from '../../../src/data-model/syntax-tree/IndexRange';

describe('IndexRange Tests', () => {
    test('IndexRange getter/setter test', () => {
        const position: IndexRange = IndexRange.create(0, 0, 0, 0);
        position.$start = new IndexPosition(0, 1);
        position.$end = new IndexPosition(0, 20);

        expect(position.$start).toEqual(new IndexPosition(0, 1));
        expect(position.$end).toEqual(new IndexPosition(0, 20));
    });

    test('equals with unequal positions, expect true', () => {
        const position: IndexRange = IndexRange.create(0, 0, 0, 0);
        const secPosition: IndexRange = IndexRange.create(0, 0, 0, 0);

        const actual = position.equals(secPosition);
        const expected = true;

        expect(actual).toEqual(expected);
    });

    test('equals with equal positions, expect false', () => {
        const position: IndexRange = IndexRange.create(0, 0, 0, 0);
        const secPosition: IndexRange = IndexRange.create(0, 10, 0, 15);

        const actual = position.equals(secPosition);
        const expected = false;

        expect(actual).toEqual(expected);
    });

    test('includesRange with not included Range, expect false', () => {
        const position: IndexRange = IndexRange.create(0, 0, 0, 0);
        const secPosition: IndexRange = IndexRange.create(0, 10, 0, 15);

        const actual = position.includesRange(secPosition);
        const expected = false;

        expect(actual).toEqual(expected);
    });

    test('includesRange with included Range, expect true', () => {
        const position: IndexRange = IndexRange.create(0, 0, 0, 12);
        const secPosition: IndexRange = IndexRange.create(0, 10, 0, 15);

        const actual = position.includesRange(secPosition);
        const expected = true;

        expect(actual).toEqual(expected);
    });

    test('includesRange with range without start, expect false', () => {
        const firstRange: IndexRange = IndexRange.create(0, 0, 0, 12);
        const secondRange: IndexRange = IndexRange.create(0, 10, 0, 15);
        secondRange.$start = null;

        const actual = firstRange.includesRange(secondRange);
        const expected = false;

        expect(actual).toEqual(expected);
    });

    test('includesRange with range without start, expect false', () => {
        const firstRange: IndexRange = IndexRange.create(0, 0, 0, 12);
        const secondRange: IndexRange = IndexRange.create(0, 10, 0, 15);
        secondRange.$end = null;

        const actual = firstRange.includesRange(secondRange);
        const expected = false;

        expect(actual).toEqual(expected);
    });

    test('startsAfter with no start and end, expect false', () => {
        const range: IndexRange = IndexRange.create(0, 0, 0, 12);
        range.$start = null;
        range.$end = null;

        const position: Position = Position.create(0, 10);
        const actual = range.startsAfter(position);
        const expected = false;

        expect(actual).toEqual(expected);
    });

    test('endsBefore with no start and end, expect false', () => {
        const range: IndexRange = IndexRange.create(0, 0, 0, 12);
        range.$start = null;
        range.$end = null;

        const position: Position = Position.create(0, 10);
        const actual = range.endsBefore(position);
        const expected = false;

        expect(actual).toEqual(expected);
    });

    test('asRange with no start and end', () => {
        const range: IndexRange = IndexRange.create(0, 0, 0, 12);
        range.$start = null;
        range.$end = null;

        const actual: Range = range.asRange();
        const expected: Range = Range.create(-1, -1, -1, -1);

        expect(actual).toEqual(expected);
    });

    test('asRange with no start', () => {
        const range: IndexRange = IndexRange.create(0, 0, 0, 12);
        range.$start = null;

        const actual: Range = range.asRange();
        const expected: Range = Range.create(-1, -1, 0, 12);

        expect(actual).toEqual(expected);
    });

    test('asRange with no end', () => {
        const range: IndexRange = IndexRange.create(0, 0, 0, 12);
        range.$end = null;

        const actual: Range = range.asRange();
        const expected: Range = Range.create(0, 0, -1, -1);

        expect(actual).toEqual(expected);
    });

    test('asRange with no end', () => {
        const range: IndexRange = IndexRange.create(0, 0, 0, 12);

        const actual: Range = range.asRange();
        const expected: Range = Range.create(0, 0, 0, 12);

        expect(actual).toEqual(expected);
    });
});
