import { Detector } from "../Detector";

/**
 * Selects and maps previous state from detector input.
 */
export function mapPrevState<TState = any>(): Detector<
  TState,
  TState | undefined
>;
export function mapPrevState<TOuterState = any, TInnerState = any>(
  selector: (state: TOuterState | undefined) => TInnerState
): Detector<TOuterState, TInnerState>;
export function mapPrevState<TOuterState = any, TInnerState = TOuterState>(
  selector?: (state: TOuterState | undefined) => TInnerState
): Detector<TOuterState, TOuterState | TInnerState | undefined> {
  return function mapPrevStateDetector(prevState) {
    if (selector) {
      return selector(prevState);
    }

    return prevState;
  };
}
