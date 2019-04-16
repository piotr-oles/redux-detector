import { Detector } from "../Detector";

/**
 * Selects and maps previous state from detector input.
 */
export function mapPrevState<TState = any>(): Detector<
  TState,
  TState | undefined
>;

export function mapPrevState<TOuterState = any, TInnerState = any>(
  stateSelector: (state?: TOuterState) => TInnerState
): Detector<TOuterState, TInnerState>;

export function mapPrevState<
  TOuterState = any,
  TInnerState = any,
  TResult = any
>(
  stateSelector: (state?: TOuterState) => TInnerState,
  resultSelector: (state?: TInnerState) => TResult
): Detector<TOuterState, TResult>;

export function mapPrevState<
  TOuterState = any,
  TInnerState = any,
  TResult = any
>(
  stateSelector?: (state?: TOuterState) => TInnerState,
  resultSelector?: (state?: TInnerState) => TResult
): Detector<TOuterState, TOuterState | TInnerState | TResult | undefined> {
  return function mapPrevStateDetector(prevState) {
    let result: TOuterState | TInnerState | TResult | undefined = prevState;

    if (stateSelector) {
      result = stateSelector(result);

      if (resultSelector) {
        result = resultSelector(result);
      }
    }

    return result;
  };
}
