import { ConditionDetector } from "../Detector";
import { mapDetector } from "../mapDetector";

export function isEqual<TOuterState = any, TInnerState = any>(
  selector: (state?: TOuterState) => TInnerState,
  expectedNextState: TInnerState
): ConditionDetector<TOuterState> {
  return mapDetector(
    selector,
    (prevState, nextState) => nextState === expectedNextState
  );
}
