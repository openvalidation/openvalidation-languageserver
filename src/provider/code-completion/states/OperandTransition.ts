import { StateTransition } from "./StateTransition";
import { CompletionGenerator } from "../CompletionGenerator";
import { String } from "typescript-string-operations";

export class OperandTransition extends StateTransition {
    private dataType: string | undefined;
    private nameFilter: string | undefined;

    constructor(datatype?: string, nameFilter?: string, prependingText?: string) {
        super(prependingText);

        this.dataType = datatype;
        this.nameFilter = nameFilter;
    }

    public getDataType(): string | undefined {
        return this.dataType;
    }

    public getNameFilter(): string[] | undefined {
        if (!this.nameFilter) return undefined;

        var filter: string[] = [this.nameFilter];
        var complexChild: string[] = this.nameFilter.split('.');
        if (complexChild.length > 1) {
            filter.push(complexChild[complexChild.length - 1]);
        }

        return filter;
    }

    public isValid(name: string, datatype: string): boolean {
        if (!this.dataType && !this.nameFilter) return true;

        // Wrong Datatype
        if (!String.IsNullOrWhiteSpace(this.dataType!) && datatype != this.dataType) return false;

        // The Attribute with the name is not allowed
        if (!!this.nameFilter && this.nameFilter.includes(name)) return false;

        return true;
    }

    public addCompletionItems(generator: CompletionGenerator): void {
        generator.addFittingIdentifier(this);
    }
}