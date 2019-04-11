import { Action, AnyAction } from "redux";

/**
 * Function that reduces previous and next state to single value.
 */
export type Detector<TState = any, TResult = any> = (
  prevState?: TState,
  nextState?: TState
) => TResult;

/**
 * Function that compares previous and next state and can return action, array of actions or nothing.
 */
export type ActionsDetector<
  TState = any,
  TAction extends Action = AnyAction
> = Detector<TState, TAction | TAction[] | void>;

/**
 * Function that compares previous and next state and returns boolean value
 */
export type ConditionDetector<TState = any> = Detector<TState, boolean>;
