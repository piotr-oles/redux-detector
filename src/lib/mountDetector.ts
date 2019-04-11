import { Detector } from "../Detector";

/**
 * Mounts detector to selected state using selectors. Works perfectly with reselect library.
 */
export function mountDetector<
  TOuterState = any,
  TInnerState = any,
  TResult = any
>(
  selector: (state: TOuterState | undefined) => TInnerState,
  detector: Detector<TInnerState, TResult>
): Detector<TOuterState, TResult> {
  return function mountedDetector(
    prevState: TOuterState | undefined,
    nextState: TOuterState | undefined
  ): TResult {
    return detector(selector(prevState), selector(nextState));
  };
}
