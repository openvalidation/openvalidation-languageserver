import "jest";
import { CompletionBuilder } from "../../../../src/provider/code-completion/CompletionBuilder";
import { OperandTransition } from '../../../../src/provider/code-completion/states/OperandTransition';
import { TestInitializer } from "../../../Testinitializer";
import { Variable } from "../../../../src/data-model/syntax-tree/Variable";

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
        var transition: OperandTransition = new OperandTransition(undefined, ["Something"]);

        var expected = false;
        var actual = transition.isValid("Something", "Something Else");

        expect(actual).toEqual(expected);
    });

    test("Set nameFilter transition params, expected attribute to be valid", () => {
        var transition: OperandTransition = new OperandTransition(undefined, ["Something"]);

        var expected = true;
        var actual = transition.isValid("Something Else", "Something Else");

        expect(actual).toEqual(expected);
    });

    test("Set nameFilter with complex Schema transition params, expected attribute to be valid", () => {
        var transition: OperandTransition = new OperandTransition(undefined, ["Something.Else"]);

        var expected = false;
        var actual = transition.isValid("Else", "Something Else");

        expect(actual).toEqual(expected);
    });

    test("Set nameFilter with complex Schema transition params, expected attribute to be valid", () => {
        var transition: OperandTransition = new OperandTransition(undefined, ["Something.Else"]);

        var expected = false;
        var actual = transition.isValid("Something.Else", "Something Else");

        expect(actual).toEqual(expected);
    });   

    test("isValid undefined nameFilter and dataType, expected true", () => {
        var operandTransition: OperandTransition = new OperandTransition("Decimal");

        var expected: boolean = false;
        var actual: boolean = operandTransition.isValid("Something", "Object");

        expect(actual).toEqual(expected);
    });

    test("getCompletions with OperandTransition, expected more than zero completionItems", () => {
        var initializer: TestInitializer = new TestInitializer(true);
        var builder: CompletionBuilder = new CompletionBuilder([new Variable("Alter", "Decimal")], initializer.server.aliasHelper, initializer.server.schema);

        var operandTransition: OperandTransition = new OperandTransition();
        operandTransition.addCompletionItems(builder);

        var expectedLength: number = 0;
        var actualLength: number = builder.build().length;

        expect(actualLength).not.toEqual(expectedLength);
    });
});