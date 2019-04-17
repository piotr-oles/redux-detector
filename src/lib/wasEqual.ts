import { ConditionDetector } from "../Detector";
import { mapDetector } from "../mapDetector";

export function wasEqual<TOuterState = any, TInnerState = any>(
  selector: (state?: TOuterState) => TInnerState,
  expectedPrevState: TInnerState
): ConditionDetector<TOuterState> {
  return mapDetector(selector, prevState => prevState === expectedPrevState);
}
