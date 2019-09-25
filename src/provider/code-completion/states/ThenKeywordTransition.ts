import { StateTransition } from "./StateTransition";
import { StateTransitionEnum } from "./StateTransitionEnum";

export class ThenKeywordTransition extends StateTransition {
    constructor() {
        super(StateTransitionEnum.ThenKeyword)
    }
}