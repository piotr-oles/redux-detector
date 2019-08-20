import { Detector } from "../Detector";
import { Selector } from "../Selector";

/**
 * Maps detector to selected state using selectors. Works perfectly with reselect library.
 */
export function mapDetector<
  TOuterState = any,
  TInnerState = any,
  TResult = any
>(
  selector: Selector<TOuterState, TInnerState>,
  detector: Detector<TInnerState, TResult>
): Detector<TOuterState, TResult> {
  return function mappedDetector(
    prevState?: TOuterState,
    nextState?: TOuterState
  ): TResult {
    return detector(selector(prevState), selector(nextState));
  };
}
