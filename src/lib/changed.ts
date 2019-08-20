import { ConditionDetector } from "../Detector";
import { Selector } from "../Selector";
import { mapDetector } from "./mapDetector";

export function changed<TOuterState = any, TInnerState = any>(
  selector: Selector<TOuterState, TInnerState>
): ConditionDetector<TOuterState> {
  return mapDetector(
    selector,
    (prevState, nextState) => prevState !== nextState
  );
}
