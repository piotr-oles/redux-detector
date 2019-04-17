import { Detector } from "./Detector";

/**
 * Selects and maps next state from detector input.
 */
export function mapNextState<
  TOuterState = any,
  TInnerState = any,
  TResult = any
>(
  stateSelector: (state?: TOuterState) => TInnerState,
  resultSelector: (state?: TInnerState) => TResult
): Detector<TOuterState, TResult> {
  return function mappedNextStateDetector(prevState, nextState) {
    return resultSelector(stateSelector(nextState));
  };
}
