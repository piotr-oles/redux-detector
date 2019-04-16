import { Detector } from "../Detector";

/**
 * Maps detector to selected state using selectors. Works perfectly with reselect library.
 */
export function mapState<TOuterState = any, TInnerState = any, TResult = any>(
  selector: (state: TOuterState | undefined) => TInnerState,
  detector: Detector<TInnerState, TResult>
): Detector<TOuterState, TResult> {
  return function mappedDetector(
    prevState: TOuterState | undefined,
    nextState: TOuterState | undefined
  ): TResult {
    return detector(selector(prevState), selector(nextState));
  };
}
