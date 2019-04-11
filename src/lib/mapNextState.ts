import { Detector } from "../Detector";

/**
 * Selects and maps next state from detector input.
 */
export function mapNextState<TState = any>(): Detector<
  TState,
  TState | undefined
>;
export function mapNextState<TOuterState = any, TInnerState = any>(
  selector: (state: TOuterState | undefined) => TInnerState
): Detector<TOuterState, TInnerState>;
export function mapNextState<TOuterState = any, TInnerState = TOuterState>(
  selector?: (state: TOuterState | undefined) => TInnerState
): Detector<TOuterState, TOuterState | TInnerState | undefined> {
  return function mapNextStateDetector(prevState, nextState) {
    if (selector) {
      return selector(nextState);
    }

    return nextState;
  };
}
