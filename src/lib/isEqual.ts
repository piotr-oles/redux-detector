import { ConditionDetector } from "../Detector";
import { Selector } from "../Selector";
import { mapDetector } from "./mapDetector";

export function isEqual<TOuterState = any, TInnerState = any>(
  selector: Selector<TOuterState, TInnerState>,
  expectedNextState: TInnerState
): ConditionDetector<TOuterState> {
  return mapDetector(
    selector,
    (prevState, nextState) => nextState === expectedNextState
  );
}
