import { Action, AnyAction } from "redux";
import { ActionsDetector, ConditionDetector } from "./Detector";

export function conditionDetector<
  TState = any,
  TAction extends Action = AnyAction
>(
  condition: ConditionDetector<TState>,
  actions: ActionsDetector<TState, TAction>
): ActionsDetector<TState, TAction> {
  return function conditionalDetector(
    prevState: TState | undefined,
    nextState: TState | undefined
  ) {
    if (condition(prevState, nextState)) {
      return actions(prevState, nextState);
    }
  };
}
