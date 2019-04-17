import { ConditionDetector } from "../Detector";
import { mapDetector } from "../mapDetector";

export function isTruthy<TOuterState = any, TInnerState = any>(
  selector: (state?: TOuterState) => TInnerState
): ConditionDetector<TOuterState> {
  return mapDetector(selector, (prevState, nextState) => !!nextState);
}
