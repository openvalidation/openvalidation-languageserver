import 'jest';
import { OperandNode } from '../../../src/data-model/syntax-tree/element/operation/operand/OperandNode';
import { IndexRange } from '../../../src/data-model/syntax-tree/IndexRange';
import { MainNode } from '../../../src/data-model/syntax-tree/MainNode';
import { Variable } from '../../../src/data-model/syntax-tree/Variable';

describe('MainNode Tests', () => {
    beforeEach(() => {
    });

    test('MainNode getter/setter Tests', () => {
        const mainNode = new MainNode(IndexRange.create(0, 0, 0, 0));

        const expectedDeclarations = [new Variable('Test', 'String')];
        mainNode.$declarations = expectedDeclarations;

        const expectedScopes = [new OperandNode([], IndexRange.create(0, 0, 0, 0), '', '')];
        mainNode.$scopes = expectedScopes;

        const expectedRange = IndexRange.create(10, 10, 10, 10);
        mainNode.$range = expectedRange;

        expect(mainNode.$declarations).toEqual(expectedDeclarations);
        expect(mainNode.$scopes).toEqual(expectedScopes);
        expect(mainNode.$range).toEqual(expectedRange);
    });
});
