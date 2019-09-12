import { GenericNode } from "../intelliSenseTree/GenericNode";
import { IRuleResponseError } from "./error/IRuleResponseError";

export interface ILintingResponse {
    scope: GenericNode | null;
    errors: IRuleResponseError[];
}