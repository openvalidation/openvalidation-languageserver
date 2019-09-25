import { StateTransition } from "./StateTransition";
import { StateTransitionEnum } from "./StateTransitionEnum";

export class AsKeywordTransition extends StateTransition {
    constructor() {
        super(StateTransitionEnum.AsKeyword)
    }
}