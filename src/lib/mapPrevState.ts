import { Detector } from "../Detector";
import { Selector } from "../Selector";

/**
 * Selects and maps previous state from detector input.
 */
export function mapPrevState<TStateA = any, TStateB = any>(
  selector: Selector<TStateA, TStateB>
): Detector<TStateA, TStateB>;

export function mapPrevState<TStateA = any, TStateB = any, TStateC = any>(
  selectorA: Selector<TStateA, TStateB>,
  selectorB: Selector<TStateB, TStateC>
): Detector<TStateA, TStateC>;

export function mapPrevState<
  TStateA = any,
  TStateB = any,
  TStateC = any,
  TStateD = any
>(
  selectorA: Selector<TStateA, TStateB>,
  selectorB: Selector<TStateB, TStateC>,
  selectorC: Selector<TStateC, TStateD>
): Detector<TStateA, TStateD>;

export function mapPrevState(...selectors: Selector[]): Detector {
  return function mappedPrevStateDetector(prevState) {
    return selectors.reduce((state, selector) => selector(state), prevState);
  };
}
