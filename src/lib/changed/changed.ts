/**
 * Condition detector that checks if state changed somehow using shallow equal compare
 */
export function changed<TState>(
  prevState?: TState,
  nextState?: TState
): boolean {
  return prevState !== nextState;
}
