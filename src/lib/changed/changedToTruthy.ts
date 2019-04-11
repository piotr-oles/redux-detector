/**
 * Condition detector that checks if state changed somehow and next state is truthy
 */
export function changedToTruthy<TState>(
  prevState?: TState,
  nextState?: TState
): boolean {
  return prevState !== nextState && !!nextState;
}
