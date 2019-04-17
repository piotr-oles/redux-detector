import { ConditionDetector } from "../Detector";
import { mapDetector } from "../mapDetector";

export function changedToFalsy<TOuterState = any, TInnerState = any>(
  selector: (state?: TOuterState) => TInnerState
): ConditionDetector<TOuterState> {
  return mapDetector(
    selector,
    (prevState, nextState) => !!prevState && !nextState
  );
}
