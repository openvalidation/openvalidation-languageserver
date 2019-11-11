import { IndexRange } from "../../../../data-model/syntax-tree/IndexRange";

export interface IStateTransition {
  prependingText?: string;
  filterStartText?: string;
  range?: IndexRange;
}
