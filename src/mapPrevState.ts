import { Detector } from "./Detector";

/**
 * Selects and maps previous state from detector input.
 */
export function mapPrevState<
  TOuterState = any,
  TInnerState = any,
  TResult = any
>(
  stateSelector: (state?: TOuterState) => TInnerState,
  resultSelector: (state?: TInnerState) => TResult
): Detector<TOuterState, TResult> {
  return function mappedPrevStateDetector(prevState) {
    return resultSelector(stateSelector(prevState));
  };
}
