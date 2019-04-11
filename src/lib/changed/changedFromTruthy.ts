/**
 * Condition detector that checks if state changed somehow and previous state was truthy
 */
export function changedFromTruthy<TState>(
  prevState?: TState,
  nextState?: TState
): boolean {
  return prevState !== nextState && !!prevState;
}
