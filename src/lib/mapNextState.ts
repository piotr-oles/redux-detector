import { Detector } from "../Detector";
import { Selector } from "../Selector";

/**
 * Selects and maps next state from detector input.
 */
export function mapNextState<TStateA = any, TStateB = any>(
  selector: Selector<TStateA, TStateB>
): Detector<TStateA, TStateB>;

export function mapNextState<TStateA = any, TStateB = any, TStateC = any>(
  selectorA: Selector<TStateA, TStateB>,
  selectorB: Selector<TStateB, TStateC>
): Detector<TStateA, TStateC>;

export function mapNextState<
  TStateA = any,
  TStateB = any,
  TStateC = any,
  TStateD = any
>(
  selectorA: Selector<TStateA, TStateB>,
  selectorB: Selector<TStateB, TStateC>,
  selectorC: Selector<TStateC, TStateD>
): Detector<TStateA, TStateD>;

export function mapNextState(...selectors: Selector[]): Detector {
  return function mappedNextStateDetector(prevState, nextState) {
    return selectors.reduce((state, selector) => selector(state), nextState);
  };
}
