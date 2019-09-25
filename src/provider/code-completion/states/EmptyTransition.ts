import { StateTransition } from "./StateTransition";
import { StateTransitionEnum } from "./StateTransitionEnum";

export class EmptyTransition extends StateTransition {
    constructor() {
        super(StateTransitionEnum.Empty);
    }
}