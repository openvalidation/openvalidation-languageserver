import 'jest';
import { LanguageEnum } from '../../src/enums/LanguageEnum';
import { LanguageHelper } from '../../src/helper/LanguageHelper';

describe('OvStringHelper.convertOvLanguageToMonacoLanguage Tests', () => {
    test('Insert Node, expected JavaScript', () => {
        const expected = 'JavaScript';
        const input = LanguageEnum.Node;

        const actual = LanguageHelper.convertOvLanguageToMonacoLanguage(input);

        expect(actual).toEqual(expected);
    });

    test('Insert Java, expected Java', () => {
        const expected = 'Java';
        const input = LanguageEnum.Java;

        const actual = LanguageHelper.convertOvLanguageToMonacoLanguage(input);

        expect(actual).toEqual(expected);
    });
});
