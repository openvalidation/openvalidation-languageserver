import { StateTransitionEnum } from "./StateTransitionEnum";

export abstract class StateTransition {
    private state: StateTransitionEnum;
    private prependingText: string;

    constructor(state: StateTransitionEnum, prependingText?: string) {
        this.state = state;
        this.prependingText = !prependingText ? "" : prependingText;
    }

    public getState() {
        return this.state;
    }    

    public getPrependingText(): string {
        return this.prependingText;
    }
}