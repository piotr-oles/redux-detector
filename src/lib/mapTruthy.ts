import { ConditionDetector, Detector } from "../Detector";

/**
 * Maps detector output to boolean.
 */
export function mapTruthy<TState = any>(
  detector: Detector<TState, any>
): ConditionDetector<TState> {
  return function mapTruthyDetector(prevState, nextState) {
    return !!detector(prevState, nextState);
  };
}
