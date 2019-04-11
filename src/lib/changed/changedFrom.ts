import { ConditionDetector } from "../../Detector";

/**
 * Condition detector that checks if state changed somehow and previous step was equal expected state.
 */
export function changedFrom<TState>(
  expectedPrevState: TState
): ConditionDetector<TState> {
  return function changedFromDetector(prevState, nextState) {
    return prevState !== nextState && prevState === expectedPrevState;
  };
}
