import { Detector } from "../Detector";

/**
 * Selects and maps next state from detector input.
 */
export function mapNextState<TState = any>(): Detector<
  TState,
  TState | undefined
>;

export function mapNextState<TOuterState = any, TInnerState = any>(
  stateSelector: (state?: TOuterState) => TInnerState
): Detector<TOuterState, TInnerState>;

export function mapNextState<
  TOuterState = any,
  TInnerState = any,
  TResult = any
>(
  stateSelector: (state?: TOuterState) => TInnerState,
  resultSelector: (state?: TInnerState) => TResult
): Detector<TOuterState, TResult>;

export function mapNextState<
  TOuterState = any,
  TInnerState = any,
  TResult = any
>(
  stateSelector?: (state?: TOuterState) => TInnerState,
  resultSelector?: (state?: TInnerState) => TResult
): Detector<TOuterState, TOuterState | TInnerState | TResult | undefined> {
  return function mapNextStateDetector(prevState, nextState) {
    let result: TOuterState | TInnerState | TResult | undefined = nextState;

    if (stateSelector) {
      result = stateSelector(result);

      if (resultSelector) {
        result = resultSelector(result);
      }
    }

    return result;
  };
}
