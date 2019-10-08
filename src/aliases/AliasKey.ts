/**
 * Enum which conatins the relevant alias-keys that are required
 *  for handling with the aliases from the rest-interface
 *
 * @export
 * @enum {number}
 */
export enum AliasKey {
    // Logical Operators
    AND = 'ʬandʬ',
    OR = 'ʬorʬ',

    // Rules - Keywords
    IF = 'ʬifʬ',
    THEN = 'ʬthenʬ',
    CONSTRAINT = 'ʬconstraintʬmust',

    // Comment - Keyword
    COMMENT = 'ʬcommentʬ',

    // Variable - Keyword
    AS = 'ʬasʬ',

    // Operators
    OPERATOR = 'ʬoperatorʬ',
    EQUALS = 'ʬoperatorʬequals',

    // Functions
    FUNCTION = 'ʬfunctionʬ',
    SUM_OF = 'ʬfunctionʬsum_of',

    // Others
    OF = 'ʬofʬ',
}
