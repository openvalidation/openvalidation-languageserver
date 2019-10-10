import 'jest';
import { OvElementManager } from '../../../src/data-model/ov-document/OvElementManager';
import { OperandNode } from '../../../src/data-model/syntax-tree/element/operation/operand/OperandNode';
import { IndexRange } from '../../../src/data-model/syntax-tree/IndexRange';
import { TestInitializer } from '../../TestInitializer';

describe('Dummy Tests', () => {
    let elementManager: OvElementManager;

    beforeEach(() => {
        const testInitializer = new TestInitializer(true);
        elementManager = testInitializer.$server.ovDocuments.get('test.ov')!.$elementManager;
    });

    test('Verify elementManager exists', () => {
        expect(elementManager).not.toBeNull();
    });

    test('getRules with 1 existing rules, expect 1 rule', () => {
        const expectedLength: number = 1;
        const actualLength = elementManager.getRules().length;
        expect(actualLength).toEqual(expectedLength);
    });

    test('getComments with no existing comments, expect no comments', () => {
        const expectedLength: number = 1;
        const actualLength = elementManager.getComments().length;
        expect(actualLength).toEqual(expectedLength);
    });

    test('addElement test, expect element is added', () => {
        const operandNode = new OperandNode([], IndexRange.create(0, 0, 0, 0), '', '');
        elementManager.addElement(operandNode);

        expect(elementManager.$elements.includes(operandNode));
    });
});
