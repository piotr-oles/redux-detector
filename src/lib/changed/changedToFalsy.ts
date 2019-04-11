/**
 * Condition detector that checks if state changed somehow and next state is falsy
 */
export function changedToFalsy<TState>(
  prevState?: TState,
  nextState?: TState
): boolean {
  return prevState !== nextState && !nextState;
}
