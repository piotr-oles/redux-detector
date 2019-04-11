import { Detector } from "../Detector";

export function mountDetector<TOuterState, TState>(
  selector: (state: TOuterState | undefined) => TState,
  detector: Detector<TState>
): Detector<TOuterState> {
  return function mountedDetector(
    prevState: TOuterState | undefined,
    nextState: TOuterState | undefined
  ): any | any[] | void {
    return detector(selector(prevState), selector(nextState));
  };
}
