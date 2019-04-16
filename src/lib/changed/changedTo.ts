import { ConditionDetector } from "../../Detector";

/**
 * Condition detector that checks if state changed somehow and next step was equal expected state.
 */
export function changedTo<TState>(
  expectedNextState: TState
): ConditionDetector<TState> {
  return function changedFromDetector(prevState, nextState) {
    return prevState !== nextState && nextState === expectedNextState;
  };
}
