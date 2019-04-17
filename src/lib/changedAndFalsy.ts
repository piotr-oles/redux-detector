import { ConditionDetector } from "../Detector";
import { mapDetector } from "../mapDetector";

export function changedAndFalsy<TOuterState = any, TInnerState = any>(
  selector: (state?: TOuterState) => TInnerState
): ConditionDetector<TOuterState> {
  return mapDetector(
    selector,
    (prevState, nextState) => prevState !== nextState && !nextState
  );
}
