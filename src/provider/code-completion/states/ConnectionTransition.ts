import { StateTransition } from "./StateTransition";
import { StateTransitionEnum } from "./StateTransitionEnum";

export class ConnectionTransition extends StateTransition {
    constructor() {
        super(StateTransitionEnum.Connection)
    }
}