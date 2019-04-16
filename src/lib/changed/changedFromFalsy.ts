/**
 * Condition detector that checks if state changed somehow and previous state was falsy
 */
export function changedFromFalsy<TState>(
  prevState?: TState,
  nextState?: TState
): boolean {
  return prevState !== nextState && !prevState;
}
