import { Action } from 'redux';
import { Detector } from './Detector';

export function mountDetector<S1, S2, A extends Action>(selector: (state: S1) => S2, detector: Detector<S2>): Detector<S1> {
  return function mountedDetector(prevState: S1, nextState: S1): A[] | void {
    return detector<A>(selector(prevState), selector(nextState));
  };
}
