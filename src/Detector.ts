/**
 * Function that reduces previous and next state to single value.
 */
export type Detector<TState = any, TResult = any> = (
  prevState: TState | undefined,
  nextState: TState | undefined
) => TResult;

/**
 * Function that compares previous and next state and can return action, array of actions or nothing.
 */
export type ActionsDetector<TState = any, TAction = any> = Detector<
  TState,
  TAction | TAction[] | void
>;

/**
 * Function that compares previous and next state and returns boolean value
 */
export type ConditionDetector<TState = any> = Detector<TState, boolean>;
