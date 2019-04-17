import { ConditionDetector } from "../Detector";
import { mapDetector } from "../mapDetector";

export function wasFalsy<TOuterState = any, TInnerState = any>(
  selector: (state?: TOuterState) => TInnerState
): ConditionDetector<TOuterState> {
  return mapDetector(selector, prevState => !prevState);
}
