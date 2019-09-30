import "jest";
import { OperandTransition } from '../../../../src/provider/code-completion/states/OperandTransition';

describe("OperandTransition.isValid Tests", () => {
    test("Empty transition params, expected everything to be valid", () => {
        var transition: OperandTransition = new OperandTransition();

        var expected = true;
        var actual = transition.isValid("Something", "Something");

        expect(actual).toEqual(expected);
    });

    test("Set datatype transition params, expected attribute to be valid", () => {
        var transition: OperandTransition = new OperandTransition("Something");

        var expected = true;
        var actual = transition.isValid("Something", "Something");

        expect(actual).toEqual(expected);
    });

    test("Set datatype transition params, expected attribute to be invalid", () => {
        var transition: OperandTransition = new OperandTransition("Something");

        var expected = false;
        var actual = transition.isValid("Something", "Something Else");

        expect(actual).toEqual(expected);
    });

    test("Set nameFilter transition params, expected attribute to be invalid", () => {
        var transition: OperandTransition = new OperandTransition(undefined, "Something");

        var expected = false;
        var actual = transition.isValid("Something", "Something Else");

        expect(actual).toEqual(expected);
    });

    test("Set nameFilter transition params, expected attribute to be valid", () => {
        var transition: OperandTransition = new OperandTransition(undefined, "Something");

        var expected = true;
        var actual = transition.isValid("Something Else", "Something Else");

        expect(actual).toEqual(expected);
    });

    test("Set nameFilter with complex Schema transition params, expected attribute to be valid", () => {
        var transition: OperandTransition = new OperandTransition(undefined, "Something.Else");

        var expected = false;
        var actual = transition.isValid("Else", "Something Else");

        expect(actual).toEqual(expected);
    });

    test("Set nameFilter with complex Schema transition params, expected attribute to be valid", () => {
        var transition: OperandTransition = new OperandTransition(undefined, "Something.Else");

        var expected = false;
        var actual = transition.isValid("Something.Else", "Something Else");

        expect(actual).toEqual(expected);
    });

    test("Set nameFilter with complex Schema transition params, expected attribute to be valid", () => {
        var transition: OperandTransition = new OperandTransition(undefined, "Something.Else");

        var expected = true;
        var actual = transition.isValid("Something", "Something Else");

        expect(actual).toEqual(expected);
    });
});