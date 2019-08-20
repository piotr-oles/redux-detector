/**
 * Maps state to a value.
 */
export type Selector<TState = any, TResult = any> = (
  state: TState | undefined
) => TResult;
