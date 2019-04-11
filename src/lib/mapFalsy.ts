import { ConditionDetector, Detector } from "../Detector";

/**
 * Maps detector output to boolean using "not" operation.
 */
export function mapFalsy<TState = any>(
  detector: Detector<TState, any>
): ConditionDetector<TState> {
  return function mapFalsyDetector(prevState, nextState) {
    return !detector(prevState, nextState);
  };
}
