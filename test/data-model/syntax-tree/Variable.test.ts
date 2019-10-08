import 'jest';
import { Variable } from '../../../src/data-model/syntax-tree/Variable';

describe('Variable Tests', () => {
    test('Variable getter/setter test', () => {
        const variable: Variable = new Variable('Name', 'String');

        variable.$dataType = 'Decimal';
        variable.$name = 'Test';

        expect(variable.$dataType).toEqual('Decimal');
        expect(variable.$name).toEqual('Test');
    });
});
