import { ConditionDetector } from "./Detector";

/**
 * Composes condition detectors into one detector using "and" operation on detectors output.
 */
export function composeAnd<TState>(
  ...detectors: ConditionDetector<TState>[]
): ConditionDetector<TState> {
  return function composedAndDetector(prevState, nextState) {
    return detectors.length
      ? detectors.every(detector => detector(prevState, nextState))
      : false;
  };
}
