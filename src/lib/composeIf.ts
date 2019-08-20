import { ActionsDetector, ConditionDetector } from "../Detector";

export function composeIf<TState = any, TAction = any>(
  condition: ConditionDetector<TState>,
  actions: ActionsDetector<TState, TAction>
): ActionsDetector<TState, TAction> {
  return function conditionalDetector(prevState?: TState, nextState?: TState) {
    if (condition(prevState, nextState)) {
      return actions(prevState, nextState);
    }
  };
}
