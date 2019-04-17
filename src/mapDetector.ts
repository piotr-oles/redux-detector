import { Detector } from "./Detector";

/**
 * Maps detector to selected state using selectors. Works perfectly with reselect library.
 */
export function mapDetector<
  TOuterState = any,
  TInnerState = any,
  TResult = any
>(
  selector: (state?: TOuterState) => TInnerState,
  detector: Detector<TInnerState, TResult>
): Detector<TOuterState, TResult> {
  return function mappedDetector(
    prevState?: TOuterState,
    nextState?: TOuterState
  ): TResult {
    return detector(selector(prevState), selector(nextState));
  };
}
