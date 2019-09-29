import { StateTransition } from "./StateTransition";
import { CompletionGenerator } from "../CompletionGenerator";

export class OperatorTransition extends StateTransition {
    private dataType: string;

    constructor(dataType: string) {
        super();

        this.dataType = dataType;
    }

    public getDataType(): string {
        return this.dataType;
    }
    
    public addCompletionItems(generator: CompletionGenerator): void {
        generator.addFittingOperator(this);
    }
}