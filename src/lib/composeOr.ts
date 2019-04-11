import { ConditionDetector } from "../Detector";

/**
 * Composes condition detectors into one detector using "or" operation on detectors output.
 */
export function composeOr<TState>(
  ...detectors: ConditionDetector<TState>[]
): ConditionDetector<TState> {
  return function composedOrDetector(prevState, nextState) {
    return detectors.some(detector => detector(prevState, nextState));
  };
}
